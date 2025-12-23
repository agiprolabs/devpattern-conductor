/**
 * Revert Tool - MCP tool handler for git-aware revert operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { revertPrompt } from "../prompts/revert.js";
import {
  isConductorSetup,
  getTrackDirectories,
  readFileContent,
  getContextPaths,
} from "../utils/files.js";
import { isGitRepo } from "../utils/git.js";

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
): Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}> {
  const projectPath = (args?.projectPath as string) || process.cwd();
  const target = args?.target as string | undefined;

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

    // Check if this is a git repository
    const hasGit = await isGitRepo(projectPath);
    if (!hasGit) {
      return {
        content: [
          {
            type: "text",
            text: `❌ **Not a Git Repository**

The revert operation requires a git repository. Please initialize git first:
\`\`\`bash
git init
\`\`\`

**Project Path:** \`${projectPath}\``,
          },
        ],
        isError: true,
      };
    }

    // Get existing tracks for context
    const existingTracks = await getTrackDirectories(projectPath);
    const paths = getContextPaths(projectPath);
    const tracksContent = await readFileContent(paths.tracks);

    let trackInfo = "";
    if (existingTracks.length > 0) {
      // Find in-progress and recently completed items
      const inProgressMatches = tracksContent?.match(/## \[~\] Track: .+/g) || [];
      const completedMatches = tracksContent?.match(/## \[x\] Track: .+/g) || [];

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
    return {
      content: [
        {
          type: "text",
          text: `Error initiating revert: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
