# run_remove_redundant_h1s.py

import os
import re
import config # Assuming your config.py has TARGET_DOCS_DIR

def get_frontmatter_title(content_lines):
    """
    Extracts the title from frontmatter lines.
    Returns the title string or None if not found or no frontmatter.
    """
    if not content_lines or not content_lines[0].strip() == '---':
        return None # No frontmatter start

    in_frontmatter = False
    for line in content_lines:
        stripped_line = line.strip()
        if stripped_line == '---':
            if not in_frontmatter:
                in_frontmatter = True
                continue
            else: # Closing '---', means end of frontmatter
                return None 
        
        if in_frontmatter:
            # Regex to match 'title: "My Title"', 'title: My Title', or 'title: \'My Title\''
            # It captures the content of the title.
            match = re.match(r'^\s*title:\s*["\']?(.*?)["\']?\s*$', stripped_line, re.IGNORECASE)
            if match:
                return match.group(1).strip() # Return the captured title
    return None # Should be unreachable if frontmatter closes properly before title

def remove_redundant_h1_in_file(filepath):
    """
    Reads an .mdx file, gets the frontmatter title, and if the first H1
    in the body content matches it, removes that H1.
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
        return False

    if not lines:
        return False

    frontmatter_title = get_frontmatter_title(lines)
    
    if not frontmatter_title:
        # No frontmatter title found, or invalid frontmatter structure for title extraction.
        # print(f"  No frontmatter title found or readable in {filepath}")
        return False

    # Find the end of the frontmatter block
    frontmatter_end_index = -1
    if lines[0].strip() == '---': # Check for starting '---'
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                frontmatter_end_index = i
                break
    
    if frontmatter_end_index == -1:
        # print(f"  Could not find closing frontmatter in {filepath}")
        return False # No proper frontmatter block

    # Search for the first H1 after the frontmatter
    # The H1 could be immediately after imports or components placed by SPBCP
    first_h1_line_number_in_file = -1
    h1_text_content = None

    for i in range(frontmatter_end_index + 1, len(lines)):
        line_content = lines[i]
        stripped_line_content = line_content.strip()

        if not stripped_line_content: # Skip empty lines
            continue
        
        # Check if this line is an H1 heading
        h1_match = re.match(r'^\s*#\s+([^\n\r]+)', stripped_line_content) # Matches '# Some Title'
        if h1_match:
            first_h1_line_number_in_file = i
            h1_text_content = h1_match.group(1).strip()
            break # Found the first H1, process it
        # No longer breaking if a non-H1, non-empty line is found.
        # This allows the script to find H1s even if they are not the absolute first content
        # after frontmatter (e.g., after import statements or other elements).
            
    if h1_text_content:
        # Normalize titles for comparison (lowercase, strip whitespace)
        normalized_fm_title = frontmatter_title.lower().strip()
        normalized_h1_text = h1_text_content.lower().strip()

        if normalized_fm_title == normalized_h1_text:
            print(f"Found redundant H1 in {filepath} (Title: '{frontmatter_title}')")
            
            # Remove the H1 line
            del lines[first_h1_line_number_in_file]
            
            # Optionally, remove blank lines that might have been immediately after the H1
            # while first_h1_line_number_in_file < len(lines) and not lines[first_h1_line_number_in_file].strip():
            #     del lines[first_h1_line_number_in_file]
            
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.writelines(lines)
                print(f"  Removed redundant H1 from: {filepath}")
                return True
            except Exception as e:
                print(f"  Error writing updated file {filepath}: {e}")
                return False
        # else:
            # print(f"  H1 ('{h1_text_content}') differs from frontmatter title ('{frontmatter_title}') in {filepath}.")
    # else:
        # print(f"  No H1 found as first content in {filepath}")
        
    return False

def main():
    print("Starting script to remove redundant H1s...")
    target_docs_dir = config.TARGET_DOCS_DIR
    
    if not os.path.exists(target_docs_dir):
        print(f"Error: Target documents directory '{target_docs_dir}' not found.")
        print("Please ensure config.TARGET_DOCS_DIR is set correctly.")
        return

    modified_files_count = 0
    processed_files_count = 0

    for root, _, files in os.walk(target_docs_dir):
        for file in files:
            if file.endswith(".mdx"): # Process .mdx files
                filepath = os.path.join(root, file)
                processed_files_count += 1
                if remove_redundant_h1_in_file(filepath):
                    modified_files_count += 1
    
    print(f"\nProcessed {processed_files_count} .mdx files.")
    print(f"Removed redundant H1s from {modified_files_count} files.")
    print("Redundant H1 removal complete.")

if __name__ == "__main__":
    main()