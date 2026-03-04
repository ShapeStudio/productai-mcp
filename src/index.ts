#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "https://api.productai.photo/v1";

const MODELS = [
  "gpt-low",
  "gpt-medium",
  "gpt-high",
  "kontext-pro",
  "kontext-max",
  "nanobananapro",
  "nanobanana",
  "seedream",
] as const;

function getApiKey(): string {
  const key = process.env.PRODUCTAI_API_KEY;
  if (!key) {
    throw new Error(
      "PRODUCTAI_API_KEY environment variable is required. Get your key from https://create.productai.photo/dashboard/api-access"
    );
  }
  return key;
}

async function apiRequest(
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<unknown> {
  const apiKey = getApiKey();
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    "x-api-key": apiKey,
  };

  let requestBody: string | undefined;
  if (body) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `ProductAI API error (${response.status}): ${errorText}`
    );
  }

  return response.json();
}

// Create the MCP server
const server = new McpServer({
  name: "productai",
  version: "1.0.0",
  icons: [
    {
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFnElEQVR4nO3dy0tbWxTH8RVaRLQIrYIiFHTSljoQrIogFCyKghjbio8/QAqCiG+dWQqKj0BBNBJFqqPWgR1UjFCp4FQyCUIriojgQAWj0mq1GtdlBwW53Ou9npzn3r8vrKGwT/xwkpOcBxERY0jlsXwBGAIADAEAhgAAQwCAIQDAEABgCAAwBAAYAgAMAQCGAABDAIAhAMAQAGAIADAEABgCAEzlsXzJgaejIlKqz+q5aJZ5Jcm3fAEYAgAMAQCGAABDAIAhAMAQAGAIADAEABgCAAwBAIYAAEMAgCEAwBAAYAgAMAQAGLIJgMLCQu7o6DB8mpqa+M2bN/z69WvOyspid3KyaRsXPUacwSLu5j06OnqrCzSdCkCqS8OimdzcXJ6cnOSfP39q2kgAcCgAsXsSu/hoAwCHAUhMTOSxsbHIe6AeAYCDAIhDmq2tLdYzAHAIAHGpsvgOW+8AwOYAxK9Vb9++ZaMCAJsDGBgYYCMDABsDaGtrY6MDAJsCKCgoiNx3z+gAwIYAUlJSIr9bmxEA2BDAx48f2awAwGYAxNkqZgYANgOwtLTEZgYANgJQXFzMZgcANgIwOzvLZgcANgGQnJxsyFe9/xUA2ARAQ0MDWxEA2ASA+EdYEQDYAMCdO3ci9+uzIvGFk0Bg1zmw6HUxFcCjR48s20hkAwBlZWU3LANJD6CxsdGyjUQ2ANDV1XXDMpD0AGR61p5M4ZExGjo9PWVZAgANhUIhliUA0NDGxgbLEgBoaGFhgWUJADQ0MjLCsgQAGmpvb+fDw0OWIQDQUEtLC8/MzLAMAYBGAI2SfLMJABoBpKammnJNg9EBgEYARKTLvQusDgCiAOB2u9npAUAUAFwuFweDQXZyABAFAJJgLwAAUQIgC8911CMA0AFAWloa7+/vsxMDAB0AEBFXVFSwEwMAnQAQEff19bHTAgAdAbhcLh4fH2cnBQA6AiAivnv3buSupk4JAHQGQJd7Aqe8HQCAAQDocl6+fGn708cAwEAARMTp6emWXBL/fwMAgwHQtb3B8vIy2y0AMAkAXX42EBC+ffum242wow0ATARA1+bhw4fc3NzMfr9f83MQHAVAPOnD5/NJMUVFRVED+Puh4+PHj7m8vDyCQlxGJ26fa8a2lJSUmAMAQzKN5QvAEABgCAAwBAAYAgAMAQCGAABDAIAhAMAQAGAIADAEABjSd/4Cbq6W6rfb5TkAAAAASUVORK5CYII=",
      mimeType: "image/png",
      sizes: ["128x128"],
    },
  ],
});

// --- Tool: Generate Image ---
server.tool(
  "generate_image",
  "Generate an AI-powered product photo. Provide a product image URL and a text prompt describing the desired edit or scene. Supports single image (all models) or multiple images (seedream, nanobanana models only).",
  {
    image_url: z
      .union([z.string().url(), z.array(z.string().url())])
      .describe(
        "URL of the product image, or an array of URLs for multi-image models (seedream, nanobanana)"
      ),
    prompt: z
      .string()
      .describe(
        "Text prompt describing the desired product photo (e.g. 'Place on a white marble surface with soft lighting' or 'Add sunglasses')"
      ),
    model: z
      .enum(MODELS)
      .default("nanobananapro")
      .describe(
        "AI model to use. Options: gpt-low, gpt-medium, gpt-high, kontext-pro, kontext-max, nanobananapro, nanobanana, seedream. Default: nanobananapro"
      ),
  },
  async ({ image_url, prompt, model }) => {
    try {
      const result = await apiRequest("POST", "/api/generate", {
        model,
        image_url,
        prompt,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Generation failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// --- Tool: Get Job Status ---
server.tool(
  "get_job",
  "Check the status of a product photo generation job. Returns status (RUNNING/COMPLETED/FAILED) and the result image URL when completed.",
  {
    job_id: z
      .number()
      .int()
      .describe("The job ID returned from generate_image (the 'id' field in the response data)"),
  },
  async ({ job_id }) => {
    try {
      const result = await apiRequest("GET", `/api/job/${job_id}`);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Job status check failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// --- Tool: Wait for Job ---
server.tool(
  "wait_for_job",
  "Wait for a generation job to complete by polling its status. Returns the final result with the generated image URL when done.",
  {
    job_id: z.number().int().describe("The job ID to wait for"),
    max_wait_seconds: z
      .number()
      .int()
      .min(5)
      .max(300)
      .default(120)
      .describe("Maximum seconds to wait before timing out (default: 120)"),
    poll_interval_seconds: z
      .number()
      .int()
      .min(2)
      .max(30)
      .default(5)
      .describe("Seconds between status checks (default: 5)"),
  },
  async ({ job_id, max_wait_seconds, poll_interval_seconds }) => {
    const startTime = Date.now();
    const maxWaitMs = max_wait_seconds * 1000;
    const pollMs = poll_interval_seconds * 1000;

    try {
      while (Date.now() - startTime < maxWaitMs) {
        const result = (await apiRequest("GET", `/api/job/${job_id}`)) as {
          status?: string;
          data?: { status?: string; [key: string]: unknown };
          [key: string]: unknown;
        };

        const status = result.data?.status ?? result.status;

        if (status === "COMPLETED" || status === "FAILED") {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        await new Promise((resolve) => setTimeout(resolve, pollMs));
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `Job ${job_id} did not complete within ${max_wait_seconds} seconds. Use get_job to check status manually.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Polling failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// --- Tool: Generate and Wait ---
server.tool(
  "generate_and_wait",
  "Generate a product photo and wait for the result in one step. Returns the completed job with the generated image URL.",
  {
    image_url: z
      .union([z.string().url(), z.array(z.string().url())])
      .describe(
        "URL of the product image, or an array of URLs for multi-image models (seedream, nanobanana)"
      ),
    prompt: z
      .string()
      .describe(
        "Text prompt describing the desired product photo"
      ),
    model: z
      .enum(MODELS)
      .default("nanobananapro")
      .describe(
        "AI model to use. Default: nanobananapro"
      ),
    max_wait_seconds: z
      .number()
      .int()
      .min(5)
      .max(300)
      .default(120)
      .describe("Maximum seconds to wait (default: 120)"),
  },
  async ({ image_url, prompt, model, max_wait_seconds }) => {
    try {
      // Start generation
      const genResult = (await apiRequest("POST", "/api/generate", {
        model,
        image_url,
        prompt,
      })) as { data?: { id?: number }; [key: string]: unknown };

      const jobId = genResult.data?.id;
      if (!jobId) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Generation started but no job ID returned: ${JSON.stringify(genResult, null, 2)}`,
            },
          ],
        };
      }

      // Poll for completion
      const startTime = Date.now();
      const maxWaitMs = max_wait_seconds * 1000;

      while (Date.now() - startTime < maxWaitMs) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const result = (await apiRequest("GET", `/api/job/${jobId}`)) as {
          data?: { status?: string; image_url?: string; [key: string]: unknown };
          [key: string]: unknown;
        };

        const status = result.data?.status;

        if (status === "COMPLETED" || status === "FAILED") {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `Job ${jobId} did not complete within ${max_wait_seconds}s. Use get_job with job_id ${jobId} to check later.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Generation failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ProductAI MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
