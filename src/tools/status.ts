/**
 * Status Tool - MCP tool handler for displaying project progress
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { statusPrompt } from "../prompts/status.js";
import {
  isConductorSetup,
  getTrackDirectories,
  readFileContent,
  getContextPaths,
} from "../utils/files.js";
import { join } from "path";

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
): Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}> {
  const projectPath = (args?.projectPath as string) || process.cwd();

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

    // Gather quick status info
    const paths = getContextPaths(projectPath);
    const tracksContent = await readFileContent(paths.tracks);
    const existingTracks = await getTrackDirectories(projectPath);

    // Build quick summary
    let quickSummary = "";
    if (tracksContent) {
      const completedTracks = (tracksContent.match(/## \[x\]/g) || []).length;
      const inProgressTracks = (tracksContent.match(/## \[~\]/g) || []).length;
      const pendingTracks = (tracksContent.match(/## \[ \]/g) || []).length;

      quickSummary = `
## Quick Summary

| Status | Count |
|--------|-------|
| ✅ Completed Tracks | ${completedTracks} |
| 🔄 In Progress Tracks | ${inProgressTracks} |
| ⏳ Pending Tracks | ${pendingTracks} |
| **Total Tracks** | **${existingTracks.length}** |

`;
    }

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
    return {
      content: [
        {
          type: "text",
          text: `Error getting status: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
