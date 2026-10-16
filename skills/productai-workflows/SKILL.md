---
name: productai-workflows
description: Generate and edit commercial product photography with ProductAI at productai.photo. Use when creating e-commerce packshots, hero images, lifestyle scenes, product-in-hand images, ad creative, background replacements, or branded product-photo variations through the ProductAI MCP tools.
---

# ProductAI Workflows

Use ProductAI to transform an existing product image into realistic, production-ready marketing content while preserving product identity.

## Prepare the request

Confirm or infer:

- The direct, reachable URL of the source product image
- The target channel, such as Shopify, Amazon, paid social, a product page, or a reel
- The desired scene, composition, lighting, camera angle, mood, aspect ratio, and negative space
- Brand constraints, especially exact packaging, label, logo, typography, color, shape, texture, and material

If the source is only a local file, explain that the current ProductAI MCP needs a reachable image URL. Do not invent a URL.

## Write the prompt

Describe the transformation clearly and visually. Include:

1. Product identity anchors that must remain unchanged
2. Scene and surface
3. Lighting and shadows
4. Composition and camera perspective
5. Mood and color palette
6. Intended commercial use
7. Elements to exclude

Keep labels, logos, packaging geometry, and product colors faithful to the source. Apply stylization to the scene rather than altering the product. Avoid adding unsupported claims or features.

## Choose a ProductAI tool

- Use `generate_and_wait` for a normal one-image request that should return the completed result in one step.
- Use `generate_image` when starting several jobs or when the user wants asynchronous control.
- Use `get_job` to check once.
- Use `wait_for_job` when the user asks to wait for an existing job.

Use `nanobananapro` by default for best-quality single-image work. Choose another model only when the user requests it or the model's tradeoff is relevant:

- Small precise edit that must keep the product, composition and background untouched: `gpt-2.5-precise`
- Best GPT model: `gpt-2.5`
- Cheaper Nano Banana: `nanobanana2.1`
- Multiple source-image URLs (up to 5): `nanobananapro`, `nanobanana2.1`, `gpt-2.5`, `gpt-2.5-precise`, or `seedream`

## Execute safely

- Treat an explicit generation request as authorization for one generation.
- Do not spend credits on extra variants unless the user requested them.
- Do not repeatedly rerun a subjective result without confirmation.
- Never expose or echo `PRODUCTAI_API_KEY`.
- If authentication is missing, direct the user to obtain an API key from `https://create.productai.photo/dashboard/api-access` and set `PRODUCTAI_API_KEY`.
- If a job fails, report the ProductAI error accurately and suggest the smallest relevant correction.

## Return the result

Show the generated image URL when available. Briefly state the model used and summarize the prompt. Preserve the job ID so the user can check or continue an asynchronous generation.
