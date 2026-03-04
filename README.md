# ProductAI MCP Server

MCP server for [ProductAI](https://create.productai.photo) — generate AI-powered product photos.

## Tools

| Tool | Description |
|------|-------------|
| `generate_image` | Generate a product photo from an image URL + prompt |
| `generate_and_wait` | Generate and poll until the result is ready (one-step) |
| `get_job` | Check generation job status |
| `wait_for_job` | Poll until a job completes |

## Models

`nanobananapro` (default, best quality), `gpt-low`, `gpt-medium`, `gpt-high`, `kontext-pro`, `kontext-max`, `nanobanana`, `seedream`

Multi-image input is supported with `seedream` and `nanobanana` models.

## Setup

### 1. Get your API key

Sign up at [ProductAI](https://create.productai.photo) and get your API key from the dashboard.

### 2. Build

```bash
cd productai-mcp
npm install
npm run build
```

### 3. Configure in Claude

Add to your Claude config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "productai": {
      "command": "node",
      "args": ["/FULL/PATH/TO/productai-mcp/dist/index.js"],
      "env": {
        "PRODUCTAI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

> **Tip:** If `node` is not found, use the full path to your Node.js binary in the `command` field. You can find it by running `which node` in your terminal (e.g. `"/Users/you/.nvm/versions/node/v22.0.0/bin/node"`).

### New to MCP? How to add your first MCP server

If this is your first time adding an MCP server, here's how to get started:

**Claude Desktop:**

1. Open Claude Desktop
2. Go to **Settings** > **Developer** > **Edit Config**
3. This opens the `claude_desktop_config.json` file. Paste the config from step 3 above (replace the full path and API key)
4. Save the file and restart Claude Desktop
5. You should see the ProductAI tools available in the chat (look for the hammer icon)

**Cursor:**

1. Open Cursor Settings (`Cmd+,` on Mac, `Ctrl+,` on Windows)
2. Search for "MCP" in settings
3. Click **Add new MCP server**
4. Add the config from step 3 above
5. Restart Cursor

**Claude Code (CLI):**

Run this command (replace the path and API key):

```bash
claude mcp add productai -- node /FULL/PATH/TO/productai-mcp/dist/index.js
```

Then set the environment variable:

```bash
export PRODUCTAI_API_KEY="your-api-key-here"
```

## Usage Examples

> "Generate a product photo of this shoe on a white marble surface" (with image URL)

> "Use the kontext-pro model to add sunglasses to this product image"

> "Check the status of my ProductAI job 245922"
