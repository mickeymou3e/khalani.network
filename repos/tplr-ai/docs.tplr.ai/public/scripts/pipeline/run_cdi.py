# run_cdi.py
# Comprehensive DeepWiki Ingestor (Corrected "Relevant source files" parsing)

import config # Import project configurations
import json
import os
import re
import time
from urllib.parse import urljoin, urlparse

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# BeautifulSoup is not strictly needed for the corrected logic below,
# but keeping the import if other parts might use it or for future.
try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None
    # print("BeautifulSoup not installed. Some HTML parsing features in markdown might be limited.")

class ComprehensiveDeepWikiIngestor:
    def __init__(self):
        self.site_map = {}
        self.link_resolution_map = {}
        self.driver = self._init_driver()
        self.current_astro_parent_path_for_level = {}

    def _init_driver(self):
        print("Initializing Selenium WebDriver...")
        chrome_options = ChromeOptions()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument('--log-level=3')

        if config.BRAVE_EXECUTABLE_PATH and os.path.exists(config.BRAVE_EXECUTABLE_PATH):
            chrome_options.binary_location = config.BRAVE_EXECUTABLE_PATH
            print(f"Using Brave browser executable: {config.BRAVE_EXECUTABLE_PATH}")
        elif config.BRAVE_EXECUTABLE_PATH:
            print(f"Warning: Brave executable path specified but not found: {config.BRAVE_EXECUTABLE_PATH}. Trying default Chrome/Chromium.")

        if not os.path.exists(config.CHROMEDRIVER_EXECUTABLE_PATH):
            raise FileNotFoundError(f"ChromeDriver executable not found at: {config.CHROMEDRIVER_EXECUTABLE_PATH}")

        service = ChromeService(executable_path=config.CHROMEDRIVER_EXECUTABLE_PATH)
        
        try:
            driver = webdriver.Chrome(service=service, options=chrome_options)
            print("WebDriver initialized successfully.")
            return driver
        except Exception as e:
            print(f"Error initializing WebDriver: {e}")
            raise

    def _sanitize_title_for_slug(self, title_str):
        if not title_str: return ""
        slug = title_str.lower()
        slug = re.sub(r'\s+', '-', slug)
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'-+', '-', slug)
        slug = slug.strip('-')
        return slug

    def _get_astro_path(self, title, level, deepwiki_href):
        slug = self._sanitize_title_for_slug(title)
        if not slug:
            parsed_href = urlparse(deepwiki_href)
            fallback_slug_part = parsed_href.path.strip('/').split('/')[-1]
            slug = self._sanitize_title_for_slug(fallback_slug_part or f"page-{len(self.site_map)}")

        if deepwiki_href == config.ROOT_DEEPWIKI_PAGE_HREF:
            target_astro_path = "/"
            self.current_astro_parent_path_for_level[level] = "/" 
            return target_astro_path

        if config.FILE_MAPPING_OVERRIDES and deepwiki_href in config.FILE_MAPPING_OVERRIDES:
            override = config.FILE_MAPPING_OVERRIDES[deepwiki_href]
            if "target_astro_path" in override:
                self.current_astro_parent_path_for_level[level] = override["target_astro_path"]
                return override["target_astro_path"]
        
        parent_astro_path = ""
        if level > 0:
            parent_astro_path = self.current_astro_parent_path_for_level.get(level - 1, "")

        if parent_astro_path == "/":
            target_astro_path = f"/{slug}"
        elif parent_astro_path:
            target_astro_path = f"{parent_astro_path}/{slug}"
        else: 
            target_astro_path = f"/{slug}"
            
        self.current_astro_parent_path_for_level[level] = target_astro_path
        return target_astro_path

    def scrape_navigation_and_build_sitemap(self):
        print(f"Navigating to DeepWiki base URL: {config.BASE_DEEPWIKI_URL}")
        self.driver.get(config.BASE_DEEPWIKI_URL)
        nav_container_selector = "div.border-r-border[class*='md:sticky']"

        try:
            print(f"Waiting for navigation container: {nav_container_selector}")
            nav_container = WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, nav_container_selector))
            )
            print("Navigation container found. Locating UL element within it.")
            nav_ul_element = nav_container.find_element(By.CSS_SELECTOR, "ul.flex-1")
            print("Navigation UL element located. Parsing list items...")
        except TimeoutException:
            print(f"Timeout: Navigation UL element or its container not found using selectors '{nav_container_selector}' or within it.")
            try:
                page_source_filename = "debug_page_source_at_failure.html"
                with open(page_source_filename, "w", encoding="utf-8") as f: f.write(self.driver.page_source)
                print(f"ACTION REQUIRED: Page source at failure has been saved to: {os.path.abspath(page_source_filename)}")
            except Exception as e_ps: print(f"Error saving page source: {e_ps}")
            return False
        except NoSuchElementException:
            print(f"NoSuchElement: Navigation UL element not found. Check CSS selectors.")
            return False

        list_items = nav_ul_element.find_elements(By.XPATH, "./li")
        print(f"Found {len(list_items)} navigation list items.")

        for idx, li in enumerate(list_items):
            try:
                a_tag = li.find_element(By.TAG_NAME, "a")
                raw_title = a_tag.text.strip()
                deepwiki_href_attr = a_tag.get_attribute("href")

                if not raw_title or not deepwiki_href_attr: continue
                
                parsed_href_attr = urlparse(deepwiki_href_attr)
                deepwiki_path = parsed_href_attr.path 
                base_parsed = urlparse(config.BASE_DEEPWIKI_URL)
                full_deepwiki_url = urljoin(f"{base_parsed.scheme}://{base_parsed.netloc}", deepwiki_path)

                padding_style = li.get_attribute("style")
                level = 0
                match = re.search(r"padding-left:\s*(\d+)px", padding_style if padding_style else "")
                if match: level = int(match.group(1)) // 12

                title = raw_title
                if config.FILE_MAPPING_OVERRIDES and deepwiki_path in config.FILE_MAPPING_OVERRIDES:
                    title = config.FILE_MAPPING_OVERRIDES[deepwiki_path].get("title", raw_title)

                target_astro_path = self._get_astro_path(title, level, deepwiki_path)
                
                self.site_map[deepwiki_path] = {
                    "original_deepwiki_href": deepwiki_path, "title": title,
                    "full_deepwiki_url": full_deepwiki_url, "level": level,
                    "target_astro_path": target_astro_path, "main_markdown_content": None,
                    "resolved_links": [], "mermaid_diagrams": [],
                    "potential_frontmatter": {"title": title}
                }
                self.link_resolution_map[deepwiki_path.lower()] = target_astro_path
                self.link_resolution_map[title.lower()] = target_astro_path
                # print(f"  Mapped: L{level} '{title}' ({deepwiki_path}) -> '{target_astro_path}'") # Already in user's successful output
            except Exception as e:
                print(f"Error processing a navigation item (index {idx}): {e}")
        print(f"Site map generated with {len(self.site_map)} pages.")
        return bool(self.site_map)

    def _extract_payload_from_js_innerHTML(self, js_innerHTML):
        match = re.search(r'self\.__next_f\.push\(\s*\[\s*[^,\]]+\s*,\s*"(.*)"\s*\]\s*\)', js_innerHTML, re.DOTALL)
        if match:
            js_escaped_string = match.group(1)
            try: return json.loads('"' + js_escaped_string + '"')
            except json.JSONDecodeError:
                try: return bytes(js_escaped_string, "utf-8").decode("unicode_escape", "ignore")
                except Exception: return js_escaped_string
        return None

    def _extract_all_markdown_chunks_from_url(self, url_to_scan):
        print(f"  Extracting markdown chunks from URL: {url_to_scan}")
        if self.driver.current_url != url_to_scan:
            self.driver.get(url_to_scan)
            WebDriverWait(self.driver, 20).until(lambda d: d.execute_script('return document.readyState') == 'complete')
            time.sleep(3)

        extracted_markdowns = []
        script_elements = self.driver.find_elements(By.TAG_NAME, "script")
        for script_element in script_elements:
            try:
                script_innerHTML = script_element.get_attribute('innerHTML')
                if script_innerHTML and "self.__next_f.push" in script_innerHTML:
                    payload_content = self._extract_payload_from_js_innerHTML(script_innerHTML)
                    if payload_content and payload_content.strip().startswith("# ") and len(payload_content.strip()) >= config.MIN_PAGE_LEN_HEURISTIC:
                        extracted_markdowns.append(payload_content.strip())
            except Exception as e_script: print(f"    Error processing a script element on {url_to_scan}: {e_script}")
        print(f"  Found {len(extracted_markdowns)} potential markdown chunks from {url_to_scan}.")
        return extracted_markdowns

    def ingest_pages_content(self):
        print("Starting content ingestion phase...")
        bulk_markdown_chunks = self._extract_all_markdown_chunks_from_url(config.BASE_DEEPWIKI_URL)
        bulk_content_by_title = {}
        for chunk in bulk_markdown_chunks:
            h1_match = re.search(r"^#\s+(.*?)\s*(\n|$)", chunk, re.MULTILINE)
            if h1_match:
                title = h1_match.group(1).strip()
                if title not in bulk_content_by_title: bulk_content_by_title[title] = chunk
                sanitized_title_slug = self._sanitize_title_for_slug(title)
                if sanitized_title_slug not in bulk_content_by_title: bulk_content_by_title[sanitized_title_slug] = chunk

        pages_found_in_bulk = 0
        for page_data in self.site_map.values():
            content = bulk_content_by_title.get(page_data["title"]) or \
                      bulk_content_by_title.get(self._sanitize_title_for_slug(page_data["title"]))
            if content:
                page_data["main_markdown_content"] = content
                pages_found_in_bulk += 1
        print(f"{pages_found_in_bulk} pages had content associated from bulk extraction.")

        pages_needing_fallback = 0
        for page_data in self.site_map.values():
            if not page_data["main_markdown_content"]:
                pages_needing_fallback +=1
                print(f"  Fallback: No bulk content for '{page_data['title']}'. Fetching from: {page_data['full_deepwiki_url']}")
                try:
                    individual_page_chunks = self._extract_all_markdown_chunks_from_url(page_data['full_deepwiki_url'])
                    for chunk in individual_page_chunks:
                        h1_match = re.search(r"^#\s+(.*?)\s*(\n|$)", chunk, re.MULTILINE)
                        if h1_match and h1_match.group(1).strip() == page_data['title']:
                            page_data["main_markdown_content"] = chunk
                            print(f"    Successfully fetched content for '{page_data['title']}' via fallback.")
                            break
                    else: print(f"    Warning: Fallback fetch for '{page_data['title']}' did not yield matching content.")
                except Exception as e_fallback: print(f"    Error during fallback fetch for '{page_data['title']}': {e_fallback}")
        print(f"Fallback extraction attempted for {pages_needing_fallback} pages.")
        return True

    def process_page_links_and_data(self):
        print("Processing links and extracting data from page content...")
        for page_data in self.site_map.values():
            if not page_data.get("main_markdown_content"): continue
            
            # print(f"  Processing page: {page_data['title']}") # Already printed in user's successful SPBCP output
            markdown_content = page_data["main_markdown_content"]
            resolved_links_for_page = []

            mermaid_blocks = re.findall(r"```mermaid\n(.*?)\n```", markdown_content, re.DOTALL)
            page_data["mermaid_diagrams"] = mermaid_blocks

            # --- Start of MODIFIED Section for "Relevant source files" ---
            relevant_files_details_match = re.search(
                r"<details>\s*<summary>Relevant source files</summary>(.*?)<\/details>", 
                markdown_content, 
                re.IGNORECASE | re.DOTALL
            )
            if relevant_files_details_match:
                details_content = relevant_files_details_match.group(1)
                # Find Markdown links: typically "- [text](href)"
                for link_match in re.finditer(r"-\s*\[([^\]]+)\]\(([^)]+)\)", details_content):
                    text = link_match.group(1).strip()
                    original_href = link_match.group(2).strip()
                    
                    if not text or not original_href: continue

                    github_url = urljoin(config.GITHUB_BLOB_URL_PREFIX, original_href.lstrip('/'))
                    
                    resolved_links_for_page.append({
                        "text": text,
                        "href": github_url,
                        "original_deepwiki_href": original_href, 
                        "context": "collapsible_aside_link"
                    })
            # --- End of MODIFIED Section ---

            # New logic for inline source links:
            for line in markdown_content.splitlines():
                if line.strip().lower().startswith("sources:"):
                    # --- CDI DEBUG ---
                    if "docker-deployment" in page_data.get("target_astro_path", ""):
                        print(f"CDI DEBUG: Processing line for docker-deployment: '{line}'")
                    # --- END CDI DEBUG ---
                    # Find all standard markdown links on this line
                    for link_match in re.finditer(r"\[([^\]]+?)\]\(([^)]*?)\)", line):
                        # --- CDI DEBUG ---
                        if "docker-deployment" in page_data.get("target_astro_path", ""):
                            print(f"  CDI DEBUG: Found link_match on this line: text='{link_match.group(1)}', href='{link_match.group(2)}'")
                        # --- END CDI DEBUG ---
                        text_content = link_match.group(1).strip()
                        original_href_val = link_match.group(2).strip()
                        
                        is_already_added = False
                        for existing_link in resolved_links_for_page:
                            if existing_link["text"] == text_content and \
                               existing_link["original_deepwiki_href"] == original_href_val and \
                               existing_link["context"] == "inline_source_link":
                                is_already_added = True
                                break
                        if not is_already_added:
                            resolved_links_for_page.append({
                                "text": text_content, "href": "", 
                                "original_deepwiki_href": original_href_val,
                                "context": "inline_source_link"
                            })
            
            for internal_link_match in re.finditer(r"\[([^!][^\]]*)\]\(([^)]+)\)", markdown_content):
                link_text = internal_link_match.group(1)
                original_internal_href = internal_link_match.group(2)
                resolved_astro_path = None
                parsed_original_href = urlparse(original_internal_href)
                original_path_lower = parsed_original_href.path.lower()

                if original_path_lower in self.link_resolution_map:
                    resolved_astro_path = self.link_resolution_map[original_path_lower]
                elif original_internal_href.startswith("#") and link_text.lower() in self.link_resolution_map:
                    resolved_astro_path = self.link_resolution_map[link_text.lower()] + original_internal_href
                elif original_path_lower.startswith(urlparse(config.BASE_DEEPWIKI_URL).path.lower()):
                     if original_path_lower in self.link_resolution_map:
                        resolved_astro_path = self.link_resolution_map[original_path_lower]
                if resolved_astro_path:
                    resolved_links_for_page.append({
                        "text": link_text, "href": resolved_astro_path,
                        "original_deepwiki_href": original_internal_href,
                        "context": "internal_page_link_from_content_body"
                    })
            page_data["resolved_links"] = resolved_links_for_page
        return True

    def save_ingested_data(self):
        print(f"Saving ingested data to: {config.INGESTED_DATA_JSON_PATH}")
        try:
            output_dir = os.path.dirname(config.INGESTED_DATA_JSON_PATH)
            if output_dir and not os.path.exists(output_dir): os.makedirs(output_dir)
            with open(config.INGESTED_DATA_JSON_PATH, "w", encoding="utf-8") as f:
                json.dump(self.site_map, f, indent=2, ensure_ascii=False)
            print("Ingested data saved successfully.")
        except Exception as e: print(f"Error saving ingested data: {e}")

    def run(self):
        print("Starting Comprehensive DeepWiki Ingestion...")
        start_time = time.time()
        if not self.scrape_navigation_and_build_sitemap(): print("Failed to scrape navigation. Aborting."); return
        if not self.ingest_pages_content(): print("Failed to ingest page content.")
        if not self.process_page_links_and_data(): print("Failed during link processing.")
        self.save_ingested_data()
        print(f"CDI run completed in {time.time() - start_time:.2f} seconds.")

    def close_driver(self):
        if self.driver: print("Closing WebDriver..."); self.driver.quit(); self.driver = None

if __name__ == "__main__":
    ingestor = None
    try:
        ingestor = ComprehensiveDeepWikiIngestor()
        ingestor.run()
    except Exception as e:
        print(f"An unhandled error occurred during CDI execution: {e}")
    finally:
        if ingestor: ingestor.close_driver()