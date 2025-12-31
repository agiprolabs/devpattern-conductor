/**
 * Implement Tool - MCP tool handler for executing track implementation
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { implementPrompt } from "../prompts/implement.js";
import { getTrackDirectories } from "../utils/files.js";
import { validateOptionalString } from "../utils/validation.js";
import {
  createTextResponse,
  validateSetup,
  getTracksSummary,
} from "../utils/toolHelpers.js";

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
) {
  try {
    // Validate arguments
    const projectPath =
      validateOptionalString(args?.projectPath, "projectPath") || process.cwd();
    const trackId = validateOptionalString(args?.trackId, "trackId");

    // Check if conductor is set up
    const setupError = await validateSetup(projectPath);
    if (setupError) {
      return setupError;
    }

    // Get existing tracks and their status
    const existingTracks = await getTrackDirectories(projectPath);
    if (existingTracks.length === 0) {
      return createTextResponse(
        `📋 **No Tracks Found**

There are no tracks to implement. Create a new track first using \`devpattern_newTrack\`.

**Project Path:** \`${projectPath}\``,
        true
      );
    }

    // Get track status summary
    const summary = await getTracksSummary(projectPath);

    let trackInfo = `
**Available Tracks:** ${existingTracks.length}
${existingTracks.map((t) => `- \`${t}\``).join("\n")}

**Status Summary:**
- ✅ Completed: ${summary.completed}
- 🔄 In Progress: ${summary.inProgress}
- ⏳ Pending: ${summary.pending}

`;

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
    return createTextResponse(
      `Error starting implementation: ${errorMessage}`,
      true
    );
  }
}
