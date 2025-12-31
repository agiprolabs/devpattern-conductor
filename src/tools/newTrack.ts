/**
 * NewTrack Tool - MCP tool handler for creating new tracks
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { newTrackPrompt } from "../prompts/newTrack.js";
import { getTrackDirectories } from "../utils/files.js";
import { validateOptionalString } from "../utils/validation.js";
import {
  createTextResponse,
  validateSetup,
} from "../utils/toolHelpers.js";

export const newTrackTool: Tool = {
  name: "devpattern_newTrack",
  description:
    "Create a new feature or bug track with interactive spec and plan generation. " +
    "Guides you through defining requirements, creating specifications, and generating an implementation plan.",
  inputSchema: {
    type: "object",
    properties: {
      description: {
        type: "string",
        description:
          "Brief description of the track (e.g., 'Add dark mode toggle to settings page')",
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

export async function handleNewTrack(
  args: Record<string, unknown> | undefined
) {
  try {
    // Validate arguments
    const projectPath =
      validateOptionalString(args?.projectPath, "projectPath") || process.cwd();
    const description = validateOptionalString(args?.description, "description");

    // Check if conductor is set up
    const setupError = await validateSetup(projectPath);
    if (setupError) {
      return setupError;
    }

    // Get existing tracks for context
    const existingTracks = await getTrackDirectories(projectPath);
    let trackInfo = "";
    if (existingTracks.length > 0) {
      trackInfo = `
**Existing Tracks:** ${existingTracks.length}
${existingTracks.map((t) => `- \`${t}\``).join("\n")}

---

`;
    }

    // Get the newTrack prompt
    const prompt = newTrackPrompt(projectPath, description);

    return {
      content: [
        {
          type: "text",
          text: `# Create New Track

**Project Path:** \`${projectPath}\`
${description ? `**Description:** "${description}"` : "**Description:** Not provided - will be requested"}

${trackInfo}The following instructions guide the AI agent through creating a new track. Follow them step by step.

---

${prompt}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return createTextResponse(`Error creating new track: ${errorMessage}`, true);
  }
}
