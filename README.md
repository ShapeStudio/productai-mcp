# ProductAI Plugin and MCP Server

Codex plugin and MCP server for [ProductAI](https://create.productai.photo) — generate AI-powered product photos.

The repository contains:

- An installable Codex plugin manifest in `.codex-plugin/plugin.json`
- ProductAI workflow guidance in `skills/productai-workflows/`
- A self-contained MCP bundle in `mcp/productai/`
- The TypeScript MCP source in `src/`

## Tools

| Tool | Description |
|------|-------------|
| `generate_image` | Generate a product photo from an image URL + prompt |
| `generate_and_wait` | Generate and poll until the result is ready (one-step) |
| `get_job` | Check generation job status |
| `wait_for_job` | Poll until a job completes |

## Models

`nanobanana2.1` (default), `nanobananapro` (best quality), `gpt-low`, `gpt-medium`, `gpt-high`, `gpt-1.5`, `gpt-2`, `gpt-2.5`, `gpt-2.5-precise`, `kontext-pro`, `kontext-max`, `nanobanana`, `nanobanana2`, `seedream`, `seedream-5-lite`, `seedream-5-pro`

- `gpt-2.5` — OpenAI GPT Image 2.5, the best GPT model: better images and faster (~11s) than `gpt-2`. 10 credits.
- `gpt-2.5-precise` — GPT Image 2.5 precise-edit variant: changes only what the prompt asks and keeps the product, composition and background as they are. Best for small targeted edits to an existing photo. A little slower (~15–20s). 10 credits.
- `nanobanana2.1` — Google Nano Banana 2.1, the successor to `nanobanana2`: better and cheaper. 5 credits.

Multi-image input (an array of up to 5 image URLs; up to 10 for `seedream-5-lite` / `seedream-5-pro`) is supported with the `gpt-1.5`, `gpt-2`, `gpt-2.5`, `gpt-2.5-precise`, `nanobanana`, `nanobananapro`, `nanobanana2`, `nanobanana2.1`, `seedream`, `seedream-5-lite` and `seedream-5-pro` models.

The ProductAI API also accepts `gpt-1.5`, `gpt-2`, `gpt-2.5` and `gpt-2.5-precise` without an `image_url` (text-to-image), but these MCP tools currently always require an image URL.

## Setup

### Install as a Codex plugin

Install the plugin from this repository, then set `PRODUCTAI_API_KEY` in the environment used to launch Codex. The plugin starts the bundled MCP server from `mcp/productai/index.js`.

Get an API key from the [ProductAI API access dashboard](https://create.productai.photo/dashboard/api-access).

### Run the MCP server from source

### 1. Get your API key

Sign up at [ProductAI](https://create.productai.photo) and get your API key from the dashboard.

### 2. Build

```bash
cd productai-mcp
npm install
npm run build
```

### 3. Configure an MCP client

Use the built server in any stdio-compatible MCP client. For Claude Desktop, add this to `claude_desktop_config.json`:

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
