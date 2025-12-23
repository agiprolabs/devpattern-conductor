/**
 * Setup Tool - MCP tool handler for project setup
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { setupPrompt } from "../prompts/setup.js";
import {
  isConductorSetup,
  readSetupState,
  getContextPaths,
} from "../utils/files.js";

export const setupTool: Tool = {
  name: "devpattern_setup",
  description:
    "Interactive project setup wizard for DevPattern/Conductor methodology. " +
    "Guides you through defining product context, tech stack, workflow, and creates the initial track. " +
    "Run this once per project to initialize the conductor directory structure.",
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

export async function handleSetup(
  args: Record<string, unknown> | undefined
): Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}> {
  const projectPath = (args?.projectPath as string) || process.cwd();

  try {
    // Check current setup state
    const isSetup = await isConductorSetup(projectPath);
    const state = await readSetupState(projectPath);

    let statusInfo = "";
    if (isSetup && state?.last_successful_step === "3.3_initial_track_generated") {
      statusInfo = `
⚠️ **Project Already Initialized**

The DevPattern setup has already been completed for this project.
- Setup state: \`${state.last_successful_step}\`

You can:
- Use \`devpattern_newTrack\` to create a new feature or bug track
- Use \`devpattern_implement\` to start working on existing tracks
- Use \`devpattern_status\` to see project progress

If you want to re-run setup, delete the \`conductor\` directory first.

---

`;
    } else if (state?.last_successful_step) {
      statusInfo = `
🔄 **Resuming Setup**

Previous setup was interrupted at step: \`${state.last_successful_step}\`
The setup will resume from where it left off.

---

`;
    }

    // Get the setup prompt
    const prompt = setupPrompt(projectPath);

    return {
      content: [
        {
          type: "text",
          text: `${statusInfo}# DevPattern Setup

**Project Path:** \`${projectPath}\`

The following instructions guide the AI agent through the setup process. Follow them step by step.

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
          text: `Error initializing setup: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
