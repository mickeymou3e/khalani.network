# run_spbcp.py
# Starlight Page Builder & Component Placer
# (Latest: Direct URL for inline sources, enhanced re.sub debugging)

import config
import json
import os
import re
from pathlib import Path
from urllib.parse import urljoin

def sanitize_filename_component(name_str):
    """Sanitizes a string to be a valid filename component (not full path)."""
    slug = name_str.lower()
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'[^\w\s-]', '', slug) 
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug

def create_directory_if_not_exists(file_path):
    """Creates the directory for the given file_path if it doesn't exist."""
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"  Created directory: {directory}")

def parse_filename_and_lines(text_content):
    """Parses 'path/to/filename:line-start-line-end' or 'filename:line' or 'filename'."""
    match = re.match(r"([\w\._/-]+)(?::(\d+)(?:-(\d+))?)?", text_content) 
    if match:
        filename = match.group(1)
        line_start = match.group(2)
        line_end = match.group(3)
        
        line_fragment = ""
        if line_start and line_end:
            line_fragment = f"#L{line_start}-L{line_end}"
        elif line_start:
            line_fragment = f"#L{line_start}"
        return filename, line_fragment
    return text_content, ""


def build_page_content(page_data):
    """Builds the full .mdx content string for a single page."""
    lines = []

    # 1. Frontmatter
    lines.append("---")
    title_text = page_data.get('potential_frontmatter', {}).get('title', page_data.get('title', 'Untitled'))
    title_text = title_text.replace('"', '\\"')
    lines.append(f'title: "{title_text}"')
    lines.append("---")
    lines.append("")

    # 2. Imports (using Astro Path Aliases)
    imports_needed = set()
    
    collapsible_links = [link for link in page_data.get("resolved_links", []) if link["context"] == "collapsible_aside_link"]
    if collapsible_links:
        imports_needed.add("import CollapsibleAside from '@components/CollapsibleAside.astro';")
        imports_needed.add("import SourceLink from '@components/SourceLink.astro';")

    inline_source_links = [link for link in page_data.get("resolved_links", []) if link["context"] == "inline_source_link"]
    if inline_source_links: 
         imports_needed.add("import SourceLink from '@components/SourceLink.astro';")

    if imports_needed:
        for imp_line in sorted(list(imports_needed)):
            lines.append(imp_line)
        lines.append("")

    # 3. CollapsibleAside for "Relevant source files"
    if collapsible_links:
        lines.append('<CollapsibleAside title="Relevant Source Files">')
        for link in collapsible_links:
            text_attr = link["text"].replace('"', "&quot;")
            href_attr = link["href"].replace('"', "&quot;")
            lines.append(f'  <SourceLink text="{text_attr}" href="{href_attr}" />')
        lines.append('</CollapsibleAside>')
        lines.append("")

    # 4. Main Markdown Content
    markdown_content = page_data.get("main_markdown_content", "")

    # Remove the original <details> block for "Relevant source files"
    details_block_pattern = r"<details>\s*<summary>Relevant source files</summary>.*?</details>"
    markdown_content = re.sub(details_block_pattern, "", markdown_content, count=1, flags=re.IGNORECASE | re.DOTALL)

    # 4a. Replace Inline "Sources:" links using direct URL construction
    # The `relevant_file_paths` map is no longer built or used for this specific resolution.
    # The `DEBUG RFS MAP` print can be removed or kept if you want to see what `collapsible_links` contained.
    # For now, let's remove it to reduce noise, as it's not directly used in this loop.
    # print(f"DEBUG RFS MAP for page '{page_data['title']}': {json.dumps(relevant_file_paths, indent=2)}") 
    
    source_link_placeholders = {}
    placeholder_idx = 0

    for link_info in inline_source_links:
        original_link_text_content = link_info["text"] 
        original_link_in_markdown_href_part = link_info["original_deepwiki_href"] 
        
        placeholder_link_regex_str = rf"\[{re.escape(original_link_text_content)}\]\({re.escape(original_link_in_markdown_href_part)}\)"
        
        filename_part, line_fragment = parse_filename_and_lines(original_link_text_content)
        
        # Ensure DEBUG prints are removed or commented out if not needed by user for this step
        # print(f"DEBUG PARSE (Inline Source): Input='{original_link_text_content}', Parsed Filename='{filename_part}', Parsed Fragment='{line_fragment}'")
        
        resolved_github_url = None
        actual_component_text = ""

        if filename_part: 
            prefix = config.GITHUB_BLOB_URL_PREFIX
            if not prefix.endswith('/'):
                prefix += '/'
            base_url = urljoin(prefix, filename_part.lstrip('/'))
            resolved_github_url = base_url + line_fragment
            # print(f"  Directly constructed URL: {resolved_github_url}")

            text_attr = original_link_text_content.replace('"', "&quot;")
            href_attr = resolved_github_url.replace('"', "&quot;")
            actual_component_text = f'<SourceLink text="{text_attr}" href="{href_attr}" />'
        else: 
            unresolved_href = f"#TODO-construct-source-{sanitize_filename_component(original_link_text_content or 'unknown_text')}"
            text_attr = original_link_text_content.replace('"', "&quot;")
            actual_component_text = f'<SourceLink text="{text_attr}" href="{unresolved_href}" />'
            # print(f"    Warning: Could not parse filename well from inline source: '{original_link_text_content}'. Placeholder component used.")

        # --- DETAILED DEBUG FOR RE.SUB ---
        # print(f"DEBUG RE.SUB: Attempting to replace pattern: {repr(placeholder_link_regex_str)}")
        # print(f"DEBUG RE.SUB: For link text: '{original_link_text_content}'")
        
        # context_snippet = "Context not easily found."
        # try:
        #     literal_link_to_find = f"[{original_link_text_content}]({original_link_in_markdown_href_part})"
        #     search_text_start_index = markdown_content.find(literal_link_to_find)
        #     if search_text_start_index != -1:
        #         context_start = max(0, search_text_start_index - 40)
        #         context_end = min(len(markdown_content), search_text_start_index + len(literal_link_to_find) + 40)
        #         text_for_snippet = markdown_content[context_start:context_end].replace('\\n', '\\\\n')
        #         context_snippet = f"(Context around link text only): ...{text_for_snippet}..."
        #     else:
        #         search_text_start_index = markdown_content.find(original_link_text_content)
        #         if search_text_start_index != -1:
        #             context_start = max(0, search_text_start_index - 40)
        #             context_end = min(len(markdown_content), search_text_start_index + len(original_link_text_content) + 40)
        #             text_for_snippet = markdown_content[context_start:context_end].replace('\\n', '\\\\n')
        #             context_snippet = f"(Context around link text only): ...{text_for_snippet}..."
        #         else:
        #             context_snippet = f"(Link text '{original_link_text_content}' not found as substring)"
        # except Exception as e_debug_ctx:
        #     context_snippet = f"(Error finding context: {e_debug_ctx})"
        # print(f"DEBUG RE.SUB: Markdown context: ...{context_snippet}...")
        # --- END DETAILED DEBUG FOR RE.SUB ---
        
        current_placeholder = f"__SOURCELINK_PLACEHOLDER_{placeholder_idx}__"
        source_link_placeholders[current_placeholder] = actual_component_text
        placeholder_idx += 1
        
        temp_markdown_content = markdown_content
        markdown_content = re.sub(placeholder_link_regex_str, current_placeholder, markdown_content, count=1)
        
        if markdown_content == temp_markdown_content:
            # If re.sub didn't replace, remove the placeholder entry if it was for this link
            # This might happen if the link was already processed or part of another structure
            # that the regex didn't match as expected.
            if source_link_placeholders.get(current_placeholder) == actual_component_text:
                 del source_link_placeholders[current_placeholder]
                 # placeholder_idx -=1 # Not strictly necessary to decrement, but good for exact count
            print(f"    WARNING: re.sub with pattern {repr(placeholder_link_regex_str)} did NOT change markdown for link text '{original_link_text_content}'. Placeholder {current_placeholder} potentially unused.")

    # 4b. Replace Internal Page Links
    internal_page_links = [link for link in page_data.get("resolved_links", []) if link["context"] == "internal_page_link_from_content_body"]
    for link_info in internal_page_links:
        original_text_escaped = re.escape(link_info["text"])
        original_href_escaped = re.escape(link_info["original_deepwiki_href"])
        
        regex_pattern = rf"\[({original_text_escaped})\]\({original_href_escaped}\)"
        replacement_markdown_link = f'[{link_info["text"]}]({link_info["href"]})' 
        
        current_markdown_snapshot = markdown_content
        markdown_content, num_replacements = re.subn(regex_pattern, replacement_markdown_link, markdown_content)

        if num_replacements == 0: 
             if link_info["original_deepwiki_href"] and link_info["original_deepwiki_href"] != "#":
                original_md_link_str = f'[{link_info["text"]}]({link_info["original_deepwiki_href"]})'
                if original_md_link_str in markdown_content:
                    markdown_content = markdown_content.replace(original_md_link_str, replacement_markdown_link, 1)
                    num_replacements = 1 
            
             if num_replacements == 0: 
                print(f"    Warning: Internal link replacement for '[{link_info['text']}]({link_info['original_deepwiki_href']})' did not find/replace a match in content for page '{page_data['title']}'.")

    # After all other processing, substitute placeholders back
    for placeholder, component_text in source_link_placeholders.items():
        markdown_content = markdown_content.replace(placeholder, component_text)

    lines.append(markdown_content.strip())
    return "\n\n".join(l for l in lines if l or l == "")


def main():
    print("Starting Starlight Page Builder & Component Placer (SPBCP)...")

    if not os.path.exists(config.INGESTED_DATA_JSON_PATH):
        print(f"Error: Ingested data file not found at {config.INGESTED_DATA_JSON_PATH}")
        print("Please run the CDI script (run_cdi.py) first.")
        return
    
    try:
        with open(config.INGESTED_DATA_JSON_PATH, "r", encoding="utf-8") as f:
            all_pages_data = json.load(f) 
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from {config.INGESTED_DATA_JSON_PATH}: {e}")
        return
    except Exception as e:
        print(f"Error reading ingested data file {config.INGESTED_DATA_JSON_PATH}: {e}")
        return
    
    if not all_pages_data:
        print("Error: Ingested data is empty.")
        return

    print(f"Loaded {len(all_pages_data)} page entries from JSON.")

    if not os.path.exists(config.TARGET_DOCS_DIR):
        os.makedirs(config.TARGET_DOCS_DIR)
        print(f"Created base output directory: {config.TARGET_DOCS_DIR}")

    for deepwiki_href, page_data in all_pages_data.items():
        title = page_data.get("title", "Untitled Page")
        target_astro_path_str = page_data.get("target_astro_path")

        if not target_astro_path_str:
            print(f"Warning: Skipping page '{title}' (deepwiki_href: {deepwiki_href}) due to missing 'target_astro_path'.")
            continue
        
        print(f"Processing page: '{title}' -> Astro path: '{target_astro_path_str}'")

        if target_astro_path_str == "/":
            filename = "index.mdx"
            output_path_obj = Path(config.TARGET_DOCS_DIR) / filename
        else:
            path_segments = target_astro_path_str.strip("/").split("/")
            filename = f"{sanitize_filename_component(path_segments[-1])}.mdx"
            if len(path_segments) > 1:
                sanitized_dir_parts = [sanitize_filename_component(part) for part in path_segments[:-1]]
                directory_path = Path(config.TARGET_DOCS_DIR).joinpath(*sanitized_dir_parts)
            else:
                directory_path = Path(config.TARGET_DOCS_DIR)
            output_path_obj = directory_path / filename
        
        create_directory_if_not_exists(str(output_path_obj))

        mdx_content = build_page_content(page_data) 

        try:
            with open(output_path_obj, "w", encoding="utf-8") as f:
                f.write(mdx_content)
            print(f"  Successfully wrote: {output_path_obj}")
        except Exception as e:
            print(f"  Error writing file {output_path_obj}: {e}")

    print("SPBCP run completed.")

if __name__ == "__main__":
    main()