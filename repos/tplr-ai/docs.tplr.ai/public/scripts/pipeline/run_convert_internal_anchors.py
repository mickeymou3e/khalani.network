# run_convert_internal_anchors.py

import os
import re
import json
import config # Assuming config.py has TARGET_DOCS_DIR and INGESTED_DATA_JSON_PATH
from pathlib import Path

def load_title_to_astro_path_map(json_path):
    """
    Loads the ingested_deepwiki_data.json and creates a mapping from
    lowercase page titles to their target_astro_path.
    """
    title_map = {}
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            site_data = json.load(f) # This is the site_map from CDI
        
        for page_info in site_data.values():
            title = page_info.get("title")
            astro_path = page_info.get("target_astro_path")
            if title and astro_path:
                # Store lowercase, stripped title for case-insensitive matching
                title_map[title.lower().strip()] = astro_path
    except FileNotFoundError:
        print(f"Error: JSON data file not found at {json_path}")
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {json_path}")
    except Exception as e:
        print(f"An unexpected error occurred while loading title map: {e}")
    return title_map

def get_astro_path_from_filepath(filepath, base_docs_dir):
    """
    Determines the canonical Astro path for a given .mdx file.
    Example: /Users/user/project/src/content/docs/category/page.mdx 
             with base_docs_dir /Users/user/project/src/content/docs
             should return /category/page
             And .../docs/index.mdx should return /
    """
    try:
        base_path = Path(base_docs_dir)
        mdx_path = Path(filepath)
        relative_path = mdx_path.relative_to(base_path)

        if relative_path.name == "index.mdx":
            # If it's an index.mdx, its path is its parent directory's path
            # relative to base_docs_dir, or "/" if it's the root index.mdx
            astro_path_str = str(relative_path.parent).replace("\\", "/")
            if astro_path_str == ".": # Root index.mdx
                return "/"
            return "/" + astro_path_str
        else:
            # For other files, it's the path relative to base_docs_dir without .mdx
            astro_path_str = str(relative_path.with_suffix('')).replace("\\", "/")
            return "/" + astro_path_str
    except ValueError:
        print(f"Warning: File {filepath} seems to be outside base_docs_dir {base_docs_dir}")
        return None


def convert_anchors_in_file(filepath, title_map, current_file_astro_path):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
        return False

    original_content = content
    
    # Regex for Markdown links: [text](href), ensuring not an image link ![...]
    def replace_link_callback(match):
        link_text = match.group(1)
        href = match.group(2)

        # Only process simple anchor links (e.g., #some-id, not /page#some-id)
        # And ensure href is not just "#"
        if href.startswith('#') and len(href) > 1 and not ('/' in href or ':' in href or '.' in href.split('#')[0]):
            link_text_lower_stripped = link_text.lower().strip()
            
            if link_text_lower_stripped in title_map:
                target_page_astro_path = title_map[link_text_lower_stripped]
                
                # Critical check: Only convert if the link text implies a *different* page.
                # If link_text maps to the current page's astro_path, it's a same-page link, leave it.
                if target_page_astro_path != current_file_astro_path:
                    new_href = target_page_astro_path + href # href already includes the '#'
                    print(f"  Converting in {Path(filepath).name}: '[{link_text}]({href})' -> '[{link_text}]({new_href})'")
                    return f"[{link_text}]({new_href})"
        
        return match.group(0) # Return original match if no changes needed

    # Using re.sub with a callback
    # Pattern: [ followed by not !, then anything not ], then ], then (, then anything not ), then )
    content = re.sub(r"\[([^!][^\]]*)\]\(([^)]+)\)", replace_link_callback, content)

    if content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            # print(f"  Updated anchors in: {filepath}") # Covered by the print inside callback
            return True
        except Exception as e:
            print(f"  Error writing updated file {filepath}: {e}")
    return False

def main():
    print("Starting script to convert title-based internal anchor links...")
    json_data_path = config.INGESTED_DATA_JSON_PATH
    target_docs_dir = config.TARGET_DOCS_DIR

    if not os.path.exists(json_data_path):
        print(f"Error: JSON data file not found at {json_data_path}. Please run CDI first.")
        return
    if not os.path.exists(target_docs_dir):
        print(f"Error: Target documents directory '{target_docs_dir}' not found.")
        return

    title_to_astro_path = load_title_to_astro_path_map(json_data_path)
    if not title_to_astro_path:
        print("Failed to load title-to-Astro path map. Aborting.")
        return

    modified_files_count = 0
    processed_files_count = 0

    for root, _, files in os.walk(target_docs_dir):
        for file in files:
            if file.endswith(".mdx"):
                filepath = os.path.join(root, file)
                processed_files_count += 1
                
                current_page_astro_path = get_astro_path_from_filepath(filepath, target_docs_dir)
                if current_page_astro_path is None:
                    print(f"Warning: Could not determine Astro path for {filepath}, skipping anchor conversion for it.")
                    continue
                
                if convert_anchors_in_file(filepath, title_to_astro_path, current_page_astro_path):
                    modified_files_count += 1
    
    print(f"\nProcessed {processed_files_count} .mdx files.")
    print(f"Converted title-based anchor links in {modified_files_count} files.")
    print("Internal anchor conversion complete.")

if __name__ == "__main__":
    main()