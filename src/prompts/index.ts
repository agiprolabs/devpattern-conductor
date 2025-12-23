/**
 * DevPattern Prompts Module
 * 
 * Exposes the Conductor methodology prompts as MCP prompts
 * that can be used by AI agents.
 */

import { setupPrompt } from "./setup.js";
import { newTrackPrompt } from "./newTrack.js";
import { implementPrompt } from "./implement.js";
import { statusPrompt } from "./status.js";
import { revertPrompt } from "./revert.js";

export interface PromptDefinition {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
}

const prompts: PromptDefinition[] = [
  {
    name: "devpattern_setup",
    description: "Interactive project setup wizard - defines product context, tech stack, workflow, and guidelines",
    arguments: [
      {
        name: "projectPath",
        description: "Path to the project directory (defaults to current directory)",
        required: false,
      },
    ],
  },
  {
    name: "devpattern_newTrack",
    description: "Create a new feature or bug track with spec and plan generation",
    arguments: [
      {
        name: "description",
        description: "Brief description of the track (feature, bug fix, etc.)",
        required: false,
      },
      {
        name: "projectPath",
        description: "Path to the project directory",
        required: false,
      },
    ],
  },
  {
    name: "devpattern_implement",
    description: "Execute tasks from the current track's plan following the defined workflow",
    arguments: [
      {
        name: "trackId",
        description: "Specific track ID to implement (defaults to next incomplete track)",
        required: false,
      },
      {
        name: "projectPath",
        description: "Path to the project directory",
        required: false,
      },
    ],
  },
  {
    name: "devpattern_status",
    description: "Display the current progress of all tracks and active tasks",
    arguments: [
      {
        name: "projectPath",
        description: "Path to the project directory",
        required: false,
      },
    ],
  },
  {
    name: "devpattern_revert",
    description: "Git-aware revert of tracks, phases, or tasks",
    arguments: [
      {
        name: "target",
        description: "Target to revert (track, phase, or task identifier)",
        required: false,
      },
      {
        name: "projectPath",
        description: "Path to the project directory",
        required: false,
      },
    ],
  },
];

/**
 * Get list of available prompts
 */
export async function getPrompts() {
  return { prompts };
}

/**
 * Get a specific prompt with its content
 */
export async function getPrompt(
  name: string,
  args?: Record<string, string>
): Promise<{
  description?: string;
  messages: Array<{ role: string; content: { type: string; text: string } }>;
}> {
  const projectPath = args?.projectPath || process.cwd();

  switch (name) {
    case "devpattern_setup":
      return {
        description: "Interactive project setup wizard",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: setupPrompt(projectPath),
            },
          },
        ],
      };

    case "devpattern_newTrack":
      return {
        description: "Create a new feature or bug track",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: newTrackPrompt(projectPath, args?.description),
            },
          },
        ],
      };

    case "devpattern_implement":
      return {
        description: "Execute tasks from the track plan",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: implementPrompt(projectPath, args?.trackId),
            },
          },
        ],
      };

    case "devpattern_status":
      return {
        description: "Display project progress",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: statusPrompt(projectPath),
            },
          },
        ],
      };

    case "devpattern_revert":
      return {
        description: "Git-aware revert operation",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: revertPrompt(projectPath, args?.target),
            },
          },
        ],
      };

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
}
