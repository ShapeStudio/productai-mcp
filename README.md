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

`gpt-low`, `gpt-medium`, `gpt-high`, `kontext-pro`, `kontext-max`, `nanobananapro`, `nanobanana`, `seedream`

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

Add to your Claude config:

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

## Usage Examples

> "Generate a product photo of this shoe on a white marble surface" (with image URL)

> "Use the kontext-pro model to add sunglasses to this product image"

> "Check the status of my ProductAI job 245922"
