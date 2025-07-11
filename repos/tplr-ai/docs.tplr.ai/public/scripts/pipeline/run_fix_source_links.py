import os
import re
from pathlib import Path
from urllib.parse import urljoin
import config # type: ignore

def sanitize_filename_component(name_str: str) -> str:
    """
    Sanitizes a string to be a valid filename component.

    Args:
        name_str (str): The string to sanitize.

    Returns:
        str: The sanitized string.
    """
    slug = name_str.lower()
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug

def parse_filename_and_lines(text_content: str) -> tuple[str, str]:
    """
    Parses 'path/to/filename:line-start-line-end' or 'filename:line' or 'filename'.

    Args:
        text_content (str): The text content to parse.

    Returns:
        tuple[str, str]: A tuple containing the filename and the line fragment (e.g., #L10-L20).
    """
    # Regex to capture:
    # 1. Filename (group 1): Allows a-z, A-Z, 0-9, _, ., /, -
    # 2. Optional line start (group 2): Digits
    # 3. Optional line end (group 3): Digits, preceded by a hyphen
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

def create_source_link_component(text: str, href: str) -> str:
    """
    Creates a <SourceLink> component string.

    Args:
        text (str): The text attribute for the SourceLink.
        href (str): The href attribute for the SourceLink.

    Returns:
        str: The <SourceLink> component string.
    """
    # Ensure quotes in text and href are properly escaped for the HTML attribute
    text_attr = text.replace('"', "&quot;")
    href_attr = href.replace('"', "&quot;")
    return f'<SourceLink text="{text_attr}" href="{href_attr}" />'

def process_mdx_file(file_path: Path, github_prefix: str) -> None:
    """
    Processes a single .mdx file to find and replace source links.

    Args:
        file_path (Path): The path to the .mdx file.
        github_prefix (str): The GitHub blob URL prefix.
    """
    try:
        content = file_path.read_text(encoding="utf-8")
        original_content = content
        
        replacements_made = 0

        def replacer_function(match: re.Match) -> str:
            nonlocal replacements_made
            full_match_text = match.group(0)
            
            # If the match already contains <SourceLink, skip it.
            if "<SourceLink" in full_match_text:
                return full_match_text

            prefix = match.group(1) # "Sources: " or "- " or "  - " etc.
            link_text_content = match.group(3) # e.g., "neurons/validator.py:356-437"
            original_href_content = match.group(4) # e.g., "neurons/validator.py:356-437" or empty

            # Check if link_text_content looks like a file path.
            # Basic check: contains '.', '/', or '\' and optionally ':' for line numbers.
            # And does not contain multiple spaces which might indicate it's not a file path.
            if not (re.search(r"[./\\]", link_text_content) and "  " not in link_text_content):
                 # print(f"    Skipping potential non-file link text: {link_text_content}")
                 return full_match_text # Not a file path, skip.

            filename_part, line_fragment = parse_filename_and_lines(link_text_content)

            if not filename_part:
                # print(f"    Could not parse filename from: {link_text_content}")
                return full_match_text # Could not parse, skip

            # Construct GitHub URL
            target_url = github_prefix
            if not target_url.endswith('/'):
                target_url += '/'
            
            resolved_github_url = urljoin(target_url, filename_part.lstrip('/')) + line_fragment
            
            component = create_source_link_component(link_text_content, resolved_github_url)
            replacements_made += 1
            # print(f"    Replacing: '[{link_text_content}]({original_href_content or ''})' with '{component}'")
            return f"{prefix}{component}"

        # Simplified regex pattern without variable-width lookbehind
        # Pattern matches: prefix + [text](optional_href)
        # where text looks like a file path and href is empty or same as text
        specific_pattern = r"(Sources:\s*|\*\s*|\-\s*|\s*\-\s+)(\[([\w\.\-\/:]+)\]\(([^\)]*)\))"
        
        # Apply the regex substitution
        content = re.sub(specific_pattern, replacer_function, content, flags=re.IGNORECASE)
        
        # Second pass: Find any remaining unconverted markdown links
        # This catches links on mixed lines that have both SourceLink components and unconverted links
        # Use a more targeted approach to find [filename:lines]() patterns that are NOT inside SourceLink components
        
        def final_replacer(match: re.Match) -> str:
            nonlocal replacements_made
            link_text_content = match.group(1)
            original_href_content = match.group(2)
            
            # Check if it looks like a file path
            if not (re.search(r"[./\\]", link_text_content) and "  " not in link_text_content):
                return match.group(0)
                
            # Check if href is empty or same as text (indicating it needs conversion)
            if original_href_content == "" or original_href_content == link_text_content:
                filename_part, line_fragment = parse_filename_and_lines(link_text_content)
                
                if filename_part:
                    target_url = github_prefix
                    if not target_url.endswith('/'):
                        target_url += '/'
                    
                    resolved_github_url = urljoin(target_url, filename_part.lstrip('/')) + line_fragment
                    component = create_source_link_component(link_text_content, resolved_github_url)
                    replacements_made += 1
                    return component
            
            return match.group(0)
        
        # Pattern to find [text](href) that are NOT inside SourceLink text or href attributes
        # Split content around SourceLink components and only process the parts outside them
        sourcelink_pattern = r'<SourceLink[^>]*>'
        parts = re.split(sourcelink_pattern, content)
        processed_parts = []
        
        for i, part in enumerate(parts):
            if i % 2 == 0:  # This is content outside SourceLink components
                # Apply conversion to markdown links in this part
                link_pattern = r'\[([\w\.\-\/:]+)\]\(([^\)]*)\)'
                processed_part = re.sub(link_pattern, final_replacer, part)
                processed_parts.append(processed_part)
            else:  # This would be SourceLink component content, but we split on tags, so this shouldn't happen
                processed_parts.append(part)
        
        # Reconstruct content by finding and reinserting the SourceLink components
        final_content = content
        link_pattern = r'\[([\w\.\-\/:]+)\]\(([^\)]*)\)'
        
        # Use a different approach: process the content while preserving SourceLink components
        # Find all SourceLink components and their positions
        sourcelink_matches = list(re.finditer(r'<SourceLink[^>]*>', content))
        
        if sourcelink_matches:
            # Process content in segments between SourceLink components
            new_content = ""
            last_end = 0
            
            for sl_match in sourcelink_matches:
                # Process content before this SourceLink
                segment = content[last_end:sl_match.start()]
                processed_segment = re.sub(link_pattern, final_replacer, segment)
                new_content += processed_segment
                
                # Add the SourceLink component unchanged
                new_content += sl_match.group(0)
                last_end = sl_match.end()
            
            # Process remaining content after the last SourceLink
            remaining_segment = content[last_end:]
            processed_remaining = re.sub(link_pattern, final_replacer, remaining_segment)
            new_content += processed_remaining
            
            content = new_content
        else:
            # No SourceLink components found, process the whole content
            content = re.sub(link_pattern, final_replacer, content)

        if replacements_made > 0:
            print(f"  Processed: {file_path.name} - {replacements_made} replacements made.")
            file_path.write_text(content, encoding="utf-8")
        # else:
            # print(f"  No changes for: {file_path.name}")

    except Exception as e:
        print(f"Error processing file {file_path}: {e}")


def main():
    """
    Main function to iterate through .mdx files and process them.
    """
    print("Starting Source Link Fixer script...")
    
    target_docs_dir = Path(config.TARGET_DOCS_DIR)
    github_url_prefix = config.GITHUB_BLOB_URL_PREFIX

    if not target_docs_dir.exists() or not target_docs_dir.is_dir():
        print(f"Error: Target directory '{target_docs_dir}' does not exist or is not a directory.")
        return

    if not github_url_prefix:
        print("Error: GITHUB_BLOB_URL_PREFIX is not configured in config.py.")
        return
    
    print(f"Scanning .mdx files in: {target_docs_dir}")
    print(f"Using GitHub prefix: {github_url_prefix}")

    mdx_files_processed = 0
    for mdx_file in target_docs_dir.rglob("*.mdx"):
        # print(f"Found file: {mdx_file}")
        process_mdx_file(mdx_file, github_url_prefix)
        mdx_files_processed += 1
    
    if mdx_files_processed == 0:
        print("No .mdx files found in the target directory.")
    else:
        print(f"Finished processing {mdx_files_processed} .mdx files.")

    print("Source Link Fixer script completed.")

if __name__ == "__main__":
    main() 