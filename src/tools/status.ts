/**
 * Status Tool - MCP tool handler for displaying project progress
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { statusPrompt } from "../prompts/status.js";
import { getTrackDirectories } from "../utils/files.js";
import { validateOptionalString } from "../utils/validation.js";
import {
  createTextResponse,
  validateSetup,
  getTracksSummary,
} from "../utils/toolHelpers.js";

export const statusTool: Tool = {
  name: "devpattern_status",
  description:
    "Display the current progress of all tracks and active tasks. " +
    "Shows a comprehensive status report including completed, in-progress, and pending work.",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: {
        type: "string",
        description:
          "Path to the project directory (defaults to current working directory)",
      },
    },
    required: [],
  },
};

export async function handleStatus(
  args: Record<string, unknown> | undefined
) {
  try {
    // Validate arguments
    const projectPath =
      validateOptionalString(args?.projectPath, "projectPath") || process.cwd();

    // Check if conductor is set up
    const setupError = await validateSetup(projectPath);
    if (setupError) {
      return setupError;
    }

    // Gather quick status info
    const summary = await getTracksSummary(projectPath);
    const existingTracks = await getTrackDirectories(projectPath);

    // Build quick summary
    const quickSummary = `
## Quick Summary

| Status | Count |
|--------|-------|
| ✅ Completed Tracks | ${summary.completed} |
| 🔄 In Progress Tracks | ${summary.inProgress} |
| ⏳ Pending Tracks | ${summary.pending} |
| **Total Tracks** | **${existingTracks.length}** |

`;

    // Get the status prompt for full analysis
    const prompt = statusPrompt(projectPath);

    return {
      content: [
        {
          type: "text",
          text: `# DevPattern Status Report

**Project Path:** \`${projectPath}\`
**Report Time:** ${new Date().toISOString()}

${quickSummary}---

The following instructions guide the AI agent through generating a comprehensive status report. Follow them to provide detailed progress information.

---

${prompt}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return createTextResponse(`Error getting status: ${errorMessage}`, true);
  }
}
