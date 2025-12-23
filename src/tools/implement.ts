/**
 * Implement Tool - MCP tool handler for executing track implementation
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { implementPrompt } from "../prompts/implement.js";
import {
  isConductorSetup,
  getTrackDirectories,
  readFileContent,
  getContextPaths,
} from "../utils/files.js";
import { join } from "path";

export const implementTool: Tool = {
  name: "devpattern_implement",
  description:
    "Execute tasks from a track's implementation plan. " +
    "Follows the defined workflow (TDD, commits, phase checkpoints) to implement features or fix bugs.",
  inputSchema: {
    type: "object",
    properties: {
      trackId: {
        type: "string",
        description:
          "Specific track ID to implement (defaults to next incomplete track)",
      },
      projectPath: {
        type: "string",
        description:
          "Path to the project directory (defaults to current working directory)",
      },
    },
    required: [],
  },
};

export async function handleImplement(
  args: Record<string, unknown> | undefined
): Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}> {
  const projectPath = (args?.projectPath as string) || process.cwd();
  const trackId = args?.trackId as string | undefined;

  try {
    // Check if conductor is set up
    const isSetup = await isConductorSetup(projectPath);
    if (!isSetup) {
      return {
        content: [
          {
            type: "text",
            text: `❌ **DevPattern Not Set Up**

The DevPattern/Conductor environment is not set up for this project.
Please run \`devpattern_setup\` first to initialize the project.

**Project Path:** \`${projectPath}\``,
          },
        ],
        isError: true,
      };
    }

    // Get existing tracks and their status
    const existingTracks = await getTrackDirectories(projectPath);
    if (existingTracks.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `📋 **No Tracks Found**

There are no tracks to implement. Create a new track first using \`devpattern_newTrack\`.

**Project Path:** \`${projectPath}\``,
          },
        ],
        isError: true,
      };
    }

    // Read tracks.md for status overview
    const paths = getContextPaths(projectPath);
    const tracksContent = await readFileContent(paths.tracks);

    let trackInfo = `
**Available Tracks:** ${existingTracks.length}
${existingTracks.map((t) => `- \`${t}\``).join("\n")}

`;

    if (tracksContent) {
      // Extract status summary from tracks.md
      const completedCount = (tracksContent.match(/\[x\]/g) || []).length;
      const inProgressCount = (tracksContent.match(/\[~\]/g) || []).length;
      const pendingCount = (tracksContent.match(/\[ \]/g) || []).length;

      trackInfo += `**Status Summary:**
- ✅ Completed: ${completedCount}
- 🔄 In Progress: ${inProgressCount}
- ⏳ Pending: ${pendingCount}

`;
    }

    // Get the implement prompt
    const prompt = implementPrompt(projectPath, trackId);

    return {
      content: [
        {
          type: "text",
          text: `# Implement Track

**Project Path:** \`${projectPath}\`
${trackId ? `**Track ID:** \`${trackId}\`` : "**Track ID:** Auto-select next incomplete track"}

${trackInfo}---

The following instructions guide the AI agent through implementing the track. Follow them step by step.

---

${prompt}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error starting implementation: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
