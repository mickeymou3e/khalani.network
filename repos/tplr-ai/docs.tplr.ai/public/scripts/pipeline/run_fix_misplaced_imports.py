# run_fix_misplaced_imports.py

import os
import re
import config # Assuming your config.py has TARGET_DOCS_DIR

def fix_misplaced_imports_in_file(filepath):
    """
    Reads an .mdx file, finds any import statements within the frontmatter,
    and moves them to appear immediately after the frontmatter.
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
        return False

    if not lines or not lines[0].strip() == '---':
        # Not a valid frontmatter file or empty
        return False

    frontmatter_end_index = -1
    for i in range(1, len(lines)):
        if lines[i].strip() == '---':
            frontmatter_end_index = i
            break
    
    if frontmatter_end_index == -1:
        # No closing frontmatter found
        return False

    frontmatter_lines = lines[1:frontmatter_end_index]
    content_after_frontmatter = lines[frontmatter_end_index+1:]
    
    misplaced_imports = []
    remaining_frontmatter_lines = []
    modified = False

    for line in frontmatter_lines:
        # Basic check for import statements (can be made more robust if needed)
        # Handles 'import ...' and 'import type ...'
        if line.strip().startswith('import ') or line.strip().startswith('import type '):
            misplaced_imports.append(line)
            modified = True
        else:
            remaining_frontmatter_lines.append(line)

    if modified:
        print(f"Found and moving misplaced imports in: {filepath}")
        
        # Reconstruct the file content
        new_lines = [lines[0]] # Start with '---'
        new_lines.extend(remaining_frontmatter_lines)
        new_lines.append(lines[frontmatter_end_index]) # Add closing '---'
        
        # Add a blank line after frontmatter if there are imports and content following
        if misplaced_imports and (content_after_frontmatter or any(l.strip() for l in misplaced_imports)):
             # Check if there's already a blank line or if imports already have one
            if not (content_after_frontmatter and not content_after_frontmatter[0].strip() == "" ) and \
               not (misplaced_imports and misplaced_imports[-1].strip() == ""):
                 # Add blank line if needed before adding imports,
                 # but only if there's content after or imports themselves don't end with a blank line.
                 # This logic is a bit tricky to ensure perfect spacing. A simpler approach is to always add one
                 # if there wasn't one after frontmatter.
                 # Let's ensure imports are followed by a blank line if there's main content.
                pass # The natural flow will handle spacing

        # Add the misplaced imports
        for imp_line in misplaced_imports:
            new_lines.append(imp_line.rstrip('\n') + '\n') # Ensure it has a newline

        # Add a blank line after imports if there's content following and imports don't end with one
        if content_after_frontmatter and misplaced_imports and misplaced_imports[-1].strip() != "":
            if not content_after_frontmatter[0].strip() == "": # If content doesn't start with blank
                 new_lines.append('\n')
        elif not content_after_frontmatter and misplaced_imports and misplaced_imports[-1].strip() != "":
            # If no content after, but imports don't end blank, ensure it's clean.
             pass


        new_lines.extend(content_after_frontmatter)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            print(f"  Fixed: {filepath}")
            return True
        except Exception as e:
            print(f"  Error writing fixed file {filepath}: {e}")
            return False
    return False

def main():
    print("Starting script to fix misplaced imports...")
    target_docs_dir = config.TARGET_DOCS_DIR
    
    if not os.path.exists(target_docs_dir):
        print(f"Error: Target documents directory '{target_docs_dir}' not found.")
        return

    fixed_files_count = 0
    processed_files_count = 0

    for root, _, files in os.walk(target_docs_dir):
        for file in files:
            if file.endswith(".mdx"): # Or .md if you use those too
                filepath = os.path.join(root, file)
                processed_files_count += 1
                if fix_misplaced_imports_in_file(filepath):
                    fixed_files_count += 1
    
    print(f"\nProcessed {processed_files_count} .mdx files.")
    print(f"Found and fixed misplaced imports in {fixed_files_count} files.")
    print("Misplaced imports check complete.")

if __name__ == "__main__":
    main()