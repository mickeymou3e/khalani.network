# DeepWiki to Astro/Starlight Migration & Update Pipeline

This project provides a suite of Python scripts to automate the extraction, transformation, and integration of documentation pages from a DeepWiki instance into an Astro/Starlight based technical documentation website. The pipeline handles content ingestion, page generation, link resolution, and several post-processing steps to ensure the documentation is clean and well-formatted.

## 🚀 Project Overview

The primary goal of this pipeline is to maintain an Astro/Starlight documentation site that mirrors content from a specified DeepWiki. It facilitates:
1.  **Initial Migration:** Transferring all relevant DeepWiki pages to the Astro/Starlight site.
2.  **Content Updates:** Pulling the latest changes from DeepWiki and updating the corresponding Astro/Starlight pages.

The pipeline is designed to:
- Scrape navigation and content from DeepWiki.
- Convert DeepWiki content structure into Starlight-compatible `.mdx` files.
- Resolve internal links and source code links (pointing to GitHub).
- Automate the placement of Astro components for features like collapsible asides and source links.
- Perform cleanup tasks like removing redundant headers and fixing misplaced import statements.

## 🔧 Prerequisites

Before running any scripts, ensure you have the following set up:

1.  **Python:** Python 3.7+ is recommended.
2.  **Dependencies:** Install necessary Python packages. Common libraries used are `selenium` and `beautifulsoup4` (though BeautifulSoup is optional in `run_cdi.py`). You can typically install these using pip:
    ```bash
    pip install selenium beautifulsoup4
    ```
3.  **WebDriver:**
    * **ChromeDriver:** Download the ChromeDriver executable that matches your Chrome/Brave browser version. The path to this executable must be correctly set in `config.py`.
    * **Brave Browser (Optional):** If you intend to use Brave Browser, ensure its executable path is also correctly set in `config.py`. Otherwise, the scripts will default to Chrome/Chromium.
4.  **Project Structure:** The scripts assume a certain project structure, particularly for `config.py` to correctly determine `WORKSPACE_BASE` if derived automatically.
5.  **Astro/Starlight Project:** An existing Astro project with Starlight integration set up. The `TARGET_DOCS_DIR` in `config.py` should point to the `src/content/docs/` directory (or equivalent) of this Astro project.

## ⚙️ Configuration (`config.py`)

The `config.py` file is central to the pipeline. It contains all necessary paths, URLs, and settings for the scripts. **You must review and update this file before running the pipeline.**

Key configuration variables include:

* `WORKSPACE_BASE`: The absolute path to your workspace. Can be set directly or derived if `config.py` is in the workspace root.
* `BASE_DEEPWIKI_URL`: The base URL of the DeepWiki instance to scrape (e.g., `"https://deepwiki.com/tplr-ai/templar"`).
* `ROOT_DEEPWIKI_PAGE_HREF`: The DeepWiki page HREF that will become the main `index.mdx` for your documentation (e.g., `"/tplr-ai/templar/1-overview"`).
* `GITHUB_REPO_URL`: The base URL of your GitHub repository for resolving source links (e.g., `"https://github.com/tplr-ai/templar"`).
* `GITHUB_REF`: The branch, commit hash, or tag to use for GitHub source links (e.g., `"bb2fc2a9"`, `"main"`).
* `INGESTED_DATA_JSON_PATH`: Path where the intermediate JSON data (scraped from DeepWiki) will be saved. Defaults to `ingested_deepwiki_data.json` in the workspace base.
* `TARGET_DOCS_DIR`: **Crucial setting.** The absolute path to your Astro project's content directory where `.mdx` files will be generated (e.g., `"/Users/monkey/docs.tplr.ai/src/content/docs"`).
* `CHROMEDRIVER_EXECUTABLE_PATH`: The absolute path to your ChromeDriver executable (e.g., `"/Users/monkey/chromedriver-mac-arm64/chromedriver"`).
* `BRAVE_EXECUTABLE_PATH` (Optional): The absolute path to your Brave browser executable if you prefer it over Chrome. Set to `None` or an empty string to use default Chrome/Chromium.
* `MIN_PAGE_LEN_HEURISTIC`: Minimum character length for a script payload to be considered a full page during content extraction.
* `FILE_MAPPING_OVERRIDES` (Optional): Allows manual overrides for page slugs, categories, or titles if the automated generation isn't suitable for specific DeepWiki pages.

Ensure all paths are correct for your local environment.

## 🔄 Documentation Update Pipeline

The pipeline consists of several Python scripts that must be run in a specific order to update your Astro/Starlight documentation from DeepWiki.

**Order of Execution:**

1.  `run_cdi.py` (Comprehensive DeepWiki Ingestor)
2.  `run_spbcp.py` (Starlight Page Builder & Component Placer)
3.  `run_remove_redundant_h1s.py` (Redundant H1 Remover)
4.  `run_fix_misplaced_imports.py` (Misplaced Imports Fixer)
5.  `run_convert_internal_anchors.py` (Internal Anchor Converter)
6.  `run_fix_source_links.py` (Source Link Fixer)

### Step-by-Step Guide to Update Pages:

#### Step 1: Configure `config.py`
   - Ensure all paths and URLs in `config.py` are correctly set up for your environment and the target DeepWiki/GitHub repository.

#### Step 2: Ingest DeepWiki Content
   - **Script:** `run_cdi.py`
   - **Purpose:** This script uses Selenium to navigate the DeepWiki site, scrape the navigation structure (sitemap), and extract the Markdown content from each page. It also performs initial link processing and identifies Mermaid diagrams and "Relevant source files" sections.
   - **Output:** Saves all extracted data into a structured JSON file specified by `INGESTED_DATA_JSON_PATH` (e.g., `ingested_deepwiki_data.json`).
   - **How to run:**
     ```bash
     python run_cdi.py
     ```

#### Step 3: Build Starlight Pages
   - **Script:** `run_spbcp.py`
   - **Purpose:** Reads the `ingested_deepwiki_data.json` file generated in the previous step. It then constructs the `.mdx` files for each documentation page, placing them into the `TARGET_DOCS_DIR`. This script handles frontmatter generation, imports necessary Astro components (`CollapsibleAside.astro`, `SourceLink.astro`), replaces DeepWiki-specific link formats with Starlight/Astro compatible ones, and embeds components for source links.
   - **Input:** `ingested_deepwiki_data.json`
   - **Output:** Generates `.mdx` files in the `TARGET_DOCS_DIR`.
   - **How to run:**
     ```bash
     python run_spbcp.py
     ```

#### Step 4: Remove Redundant H1 Headers
   - **Script:** `run_remove_redundant_h1s.py`
   - **Purpose:** Starlight typically uses the frontmatter `title` to generate the main H1 header for a page. If the Markdown content itself starts with an H1 that is identical to the frontmatter title, this script removes that redundant H1 from the body of the `.mdx` file.
   - **Input:** `.mdx` files in `TARGET_DOCS_DIR`.
   - **Output:** Modifies `.mdx` files in place.
   - **How to run:**
     ```bash
     python run_remove_redundant_h1s.py
     ```

#### Step 5: Fix Misplaced Imports
   - **Script:** `run_fix_misplaced_imports.py`
   - **Purpose:** Sometimes, import statements for Astro components might accidentally be placed within the frontmatter block by earlier scripts. This script identifies such misplaced imports and moves them to the correct position immediately after the frontmatter.
   - **Input:** `.mdx` files in `TARGET_DOCS_DIR`.
   - **Output:** Modifies `.mdx` files in place.
   - **How to run:**
     ```bash
     python run_fix_misplaced_imports.py
     ```

#### Step 6: Convert Internal Anchor Links
   - **Script:** `run_convert_internal_anchors.py`
   - **Purpose:** This script processes specific types of internal anchor links. If a link like `[Link Text](#some-anchor)` was intended to point to an anchor on a *different* page (where "Link Text" matches the title of that other page), this script converts it to the full Astro path like `[Link Text](/path/to/other-page#some-anchor)`. It uses the `ingested_deepwiki_data.json` file to map titles to Astro paths.
   - **Inputs:**
     - `.mdx` files in `TARGET_DOCS_DIR`.
     - `ingested_deepwiki_data.json` (for title-to-path mapping).
   - **Output:** Modifies `.mdx` files in place.
   - **How to run:**
     ```bash
     python run_convert_internal_anchors.py
     ```

#### Step 7: Fix and Standardize Source Links
   - **Script:** `run_fix_source_links.py`
   - **Purpose:** This script ensures that Markdown links intended to be source code references (e.g., `[path/to/file.py:10-20]()`) are correctly converted into `<SourceLink>` Astro components, pointing to the appropriate GitHub URL (constructed using `GITHUB_BLOB_URL_PREFIX` and `GITHUB_REF` from `config.py`). It handles links that might have been missed or improperly formatted by `run_spbcp.py`.
   - **Input:** `.mdx` files in `TARGET_DOCS_DIR`.
   - **Output:** Modifies `.mdx` files in place.
   - **How to run:**
     ```bash
     python run_fix_source_links.py
     ```

After completing these steps, the `.mdx` files in your `src/content/docs/` directory should be updated with the latest content from DeepWiki, properly formatted and linked for your Astro/Starlight site.

## 🤖 GitHub Actions Workflow for Automation

To automate the entire update pipeline, a GitHub Actions workflow is provided.

**Workflow File:**
* `.github/workflows/manual-docs-update-apt-get.yml`

**Features:**
* **Manual Trigger:** Can be run manually from the "Actions" tab of your GitHub repository.
* **Customizable Inputs:** Allows optional inputs for the commit message and the target branch when running the workflow.
* **Automated Environment Setup:**
    * Sets up Python 3.10.
    * Installs dependencies like Selenium and BeautifulSoup4.
    * Installs Google Chrome and the correct ChromeDriver version strictly via `apt-get` within the runner environment.
* **Dynamic Configuration:** Generates a `config.py` file at runtime from `config.template.py` (expected at `public/scripts/pipeline/config.template.py`), automatically populating the detected ChromeDriver path and the absolute path to the documentation directory (e.g., `src/content/docs`) within the repository.
* **Full Pipeline Execution:** Runs all six Python pipeline scripts in the correct order.
* **Automatic Commits & Push:** If changes are detected in the documentation directory (e.g., `src/content/docs`) or the `ingested_deepwiki_data.json` file, the workflow automatically commits these changes and pushes them to the specified (or current) branch.

**Prerequisites for Using the Workflow:**
1.  **`config.template.py`:** This file must exist, for example, at `public/scripts/pipeline/config.template.py`. It needs to contain the placeholders `__CHROMEDRIVER_PATH_PLACEHOLDER__` and `__TARGET_DOCS_DIR_PLACEHOLDER__`. Other configurations within this template should be appropriate for the CI environment or managed via GitHub Secrets.
2.  **Workflow Configuration:** The workflow YAML file itself contains an environment variable (`TARGET_DOCS_PATH_IN_REPO`) that specifies the relative path to your Starlight documentation directory (e.g., `src/content/docs`). Ensure this path is correct in the workflow file.
3.  **Repository Permissions:** The workflow requires `contents: write` permission to commit and push changes. This is usually configured by default for actions running on the repository.

**How to Use the Workflow:**
1.  Navigate to the **Actions** tab in your GitHub repository.
2.  In the left sidebar, find and select the workflow named "Manual Docs Update from DeepWiki (apt-get)".
3.  Click the **Run workflow** button (usually on the right side).
4.  Optionally, you can customize the "Commit message for documentation updates" and "Branch to commit updates to".
5.  Click the green **Run workflow** button to start the process.
6.  You can monitor the progress and logs of the workflow run in the Actions tab.

## ✨ Astro & Starlight Development

Once the pipeline has generated or updated the `.mdx` files in `src/content/docs/`, you can use the standard Astro commands to build, preview, and develop your documentation site.

All commands are run from the root of your Astro project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

### Project Structure (Astro/Starlight)

A typical Astro + Starlight project includes:

```
.
├── public/                     # Static assets (favicons, etc.)
├── src/
│   ├── assets/                 # Images, etc., embeddable in Markdown
│   ├── components/             # Custom Astro components (e.g., CollapsibleAside.astro, SourceLink.astro)
│   ├── content/
│   │   ├── docs/               # Your .mdx documentation files (managed by this pipeline)
│   │   └── config.ts         # Starlight content collection configuration
│   └── env.d.ts                # TypeScript environment declarations
├── astro.config.mjs            # Astro configuration file
├── package.json
└── tsconfig.json
```

-   **.mdx files:** Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. These are generated and updated by this pipeline.
-   **Images:** Can be added to `src/assets/` and embedded in Markdown with a relative link.
-   **Custom Components:** Ensure that any Astro components referenced by the pipeline (e.g., `CollapsibleAside.astro`, `SourceLink.astro`) exist in your Astro project, typically under `src/components/`. The paths in the generated `.mdx` files (e.g., `@components/CollapsibleAside.astro`) assume appropriate Astro path aliases are configured in your `tsconfig.json` or `jsconfig.json`.

## 💡 Troubleshooting & Notes

* **Selenium Errors:** Most Selenium errors stem from an incorrect ChromeDriver path or version mismatch with your browser. Double-check `CHROMEDRIVER_EXECUTABLE_PATH` in `config.py`.
* **DeepWiki Structure Changes:** If the HTML structure of DeepWiki changes significantly, the scraping logic in `run_cdi.py` (especially CSS selectors) might need adjustments.
* **Content Extraction Issues:** The `MIN_PAGE_LEN_HEURISTIC` in `config.py` helps filter out irrelevant script payloads. If valid content is missed or irrelevant snippets are included, this value might need tuning.
* **Link Resolution:** The accuracy of resolved GitHub links depends heavily on the `GITHUB_REPO_URL` and `GITHUB_REF` settings in `config.py`.
* **File Paths in `config.py`:** Use absolute paths for `TARGET_DOCS_DIR`, `CHROMEDRIVER_EXECUTABLE_PATH`, and `BRAVE_EXECUTABLE_PATH` to avoid ambiguity.
* **Astro Path Aliases:** Ensure that path aliases like `@components/` (used for importing `CollapsibleAside.astro` and `SourceLink.astro`) are correctly configured in your Astro project's `tsconfig.json` or `jsconfig.json`. Example:
    ```json
    // tsconfig.json or jsconfig.json
    {
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@components/*": ["src/components/*"],
          "@assets/*": ["src/assets/*"]
          // Add other aliases as needed
        }
      }
    }
    ```

## 👀 Want to learn more about Starlight?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
