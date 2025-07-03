This is a PoC demo.

### To run
0. Clone this repo.
1. Install `uv`.
2. Go to the project directory. Change the medusa url in `config.toml.example`, and fill in all ids, urls, and contract addresses. Save it to `config.toml`.
3. Run 
```bash
uv venv
```
```bash
source .venv/bin/activate
```
```bash
uv pip install -r pyproject.toml
```
4. Create the Claude Desktop config according to [https://github.com/modelcontextprotocol/python-sdk/issues/148](https://github.com/modelcontextprotocol/python-sdk/issues/148). A working version looks like
```json
{
  "mcpServers": {
    "medusa-mcp-demo": {
      "command": "<absolute path to uv binary>",
      "args": [
        "--directory",
        "<absolute path to medusa-mcp-demo project directory>",
        "run",
        "<absolute path to medusa-mcp-demo project directory>/main.py"
      ],
      "env": {
        "PATH": "/usr/local/bin:/usr/bin:<absolute path to medusa-mcp-demo project directory>/.venv/bin"
      }
    }
  }
}
```

5. Open Claude Desktop.
6. MCP functionalities
  - List supported chains
  - Create a bridge intent from one supported chain to another when liquidity exists
