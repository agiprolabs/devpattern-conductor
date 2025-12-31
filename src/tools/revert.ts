/**
 * Revert Tool - MCP tool handler for git-aware revert operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { revertPrompt } from "../prompts/revert.js";
import { getTrackDirectories } from "../utils/files.js";
import { isGitRepo } from "../utils/git.js";
import { validateOptionalString } from "../utils/validation.js";
import {
  createTextResponse,
  validateSetup,
  getTracksSummary,
} from "../utils/toolHelpers.js";

export const revertTool: Tool = {
  name: "devpattern_revert",
  description:
    "Git-aware revert of tracks, phases, or tasks. " +
    "Analyzes git history to find commits associated with the target work and reverts them safely.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description:
          "Target to revert - can be a track ID, phase name, or task description",
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

export async function handleRevert(
  args: Record<string, unknown> | undefined
) {
  try {
    // Validate arguments
    const projectPath =
      validateOptionalString(args?.projectPath, "projectPath") || process.cwd();
    const target = validateOptionalString(args?.target, "target");

    // Check if conductor is set up
    const setupError = await validateSetup(projectPath);
    if (setupError) {
      return setupError;
    }

    // Check if this is a git repository
    const hasGit = await isGitRepo(projectPath);
    if (!hasGit) {
      return createTextResponse(
        `❌ **Not a Git Repository**

The revert operation requires a git repository. Please initialize git first:
\`\`\`bash
git init
\`\`\`

**Project Path:** \`${projectPath}\``,
        true
      );
    }

    // Get existing tracks for context
    const existingTracks = await getTrackDirectories(projectPath);
    const summary = await getTracksSummary(projectPath);

    let trackInfo = "";
    if (existingTracks.length > 0) {
      // Find in-progress and recently completed items
      const inProgressMatches =
        summary.content?.match(/## \[~\] Track: .+/g) || [];
      const completedMatches = summary.content?.match(/## \[x\] Track: .+/g) || [];

      trackInfo = `
## Revert Candidates

**In Progress:**
${inProgressMatches.length > 0 ? inProgressMatches.map((m) => `- ${m.replace("## [~] ", "🔄 ")}`).join("\n") : "- None"}

**Recently Completed:**
${completedMatches.slice(-5).map((m) => `- ${m.replace("## [x] ", "✅ ")}`).join("\n") || "- None"}

`;
    }

    // Get the revert prompt
    const prompt = revertPrompt(projectPath, target);

    return {
      content: [
        {
          type: "text",
          text: `# DevPattern Revert

**Project Path:** \`${projectPath}\`
${target ? `**Target:** "${target}"` : "**Target:** Not specified - will guide selection"}

⚠️ **Warning:** This operation will modify git history. Make sure you have no uncommitted changes.

${trackInfo}---

The following instructions guide the AI agent through the revert process. Follow them step by step to safely undo work.

---

${prompt}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return createTextResponse(`Error initiating revert: ${errorMessage}`, true);
  }
}
