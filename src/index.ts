#!/usr/bin/env node

/**
 * DevPattern MCP Server
 * 
 * Context-Driven Development server that implements the Conductor methodology
 * for use with Cline, Cursor, and other agentic coding platforms.
 * 
 * Forked from Google's Conductor extension for Gemini CLI.
 * Original: https://github.com/gemini-cli-extensions/conductor
 * License: Apache-2.0
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { setupTool, handleSetup } from "./tools/setup.js";
import { newTrackTool, handleNewTrack } from "./tools/newTrack.js";
import { implementTool, handleImplement } from "./tools/implement.js";
import { statusTool, handleStatus } from "./tools/status.js";
import { revertTool, handleRevert } from "./tools/revert.js";
import { getResources, readResource } from "./resources/context.js";
import { getPrompts, getPrompt } from "./prompts/index.js";

const server = new Server(
  {
    name: "devpattern",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      setupTool,
      newTrackTool,
      implementTool,
      statusTool,
      revertTool,
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "devpattern_setup":
        return await handleSetup(args);
      case "devpattern_newTrack":
        return await handleNewTrack(args);
      case "devpattern_implement":
        return await handleImplement(args);
      case "devpattern_status":
        return await handleStatus(args);
      case "devpattern_revert":
        return await handleRevert(args);
      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return await getResources();
});

// Read a specific resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  return await readResource(request.params.uri);
});

// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return await getPrompts();
});

// Get a specific prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  return await getPrompt(request.params.name, request.params.arguments);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DevPattern MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
