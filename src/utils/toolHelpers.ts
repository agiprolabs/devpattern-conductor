/**
 * Common utilities for MCP tool handlers
 */

import { isConductorSetup, readFileContent, getContextPaths } from "./files.js";

/**
 * Creates a text response for MCP tools
 */
export function createTextResponse(text: string, isError: boolean = false) {
  return {
    content: [{ type: "text", text }],
    ...(isError && { isError: true }),
  };
}

/**
 * Validates that the project is set up with DevPattern/Conductor
 * Returns an error response if not setup, otherwise returns null
 */
export async function validateSetup(projectPath: string) {
  const isSetup = await isConductorSetup(projectPath);

  if (!isSetup) {
    return createTextResponse(
      `❌ **DevPattern Not Set Up**

This project hasn't been initialized with DevPattern yet.

**To get started:**
1. Run \`devpattern_setup\` to initialize the project
2. Follow the interactive setup wizard
3. Then you can use this tool

**What setup creates:**
- \`conductor/\` directory with project context
- Product vision and guidelines
- Tech stack preferences
- Development workflow
- Initial code style guides`,
      true
    );
  }

  return null;
}

/**
 * Status marker patterns for tracks and tasks
 */
const TRACK_STATUS_PATTERNS = {
  completed: /^##\s+\[x\]/gm,
  inProgress: /^##\s+\[~\]/gm,
  pending: /^##\s+\[\s\]/gm,
};

const TASK_STATUS_PATTERNS = {
  completed: /^-\s+\[x\]/gm,
  inProgress: /^-\s+\[~\]/gm,
  pending: /^-\s+\[\s\]/gm,
};

/**
 * Parses track-level status markers from tracks.md content
 * Only counts ## headings, not task-level markers
 */
export function parseTrackStatus(content: string): {
  completed: number;
  inProgress: number;
  pending: number;
} {
  return {
    completed: (content.match(TRACK_STATUS_PATTERNS.completed) || []).length,
    inProgress: (content.match(TRACK_STATUS_PATTERNS.inProgress) || []).length,
    pending: (content.match(TRACK_STATUS_PATTERNS.pending) || []).length,
  };
}

/**
 * Parses task-level status markers from plan.md content
 * Only counts - list items, not track-level markers
 */
export function parseTaskStatus(content: string): {
  completed: number;
  inProgress: number;
  pending: number;
} {
  return {
    completed: (content.match(TASK_STATUS_PATTERNS.completed) || []).length,
    inProgress: (content.match(TASK_STATUS_PATTERNS.inProgress) || []).length,
    pending: (content.match(TASK_STATUS_PATTERNS.pending) || []).length,
  };
}

/**
 * Gets the current track status summary for display
 */
export async function getTracksSummary(projectPath: string) {
  const paths = getContextPaths(projectPath);
  const tracksContent = await readFileContent(paths.tracks);

  if (!tracksContent) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      content: "",
    };
  }

  const status = parseTrackStatus(tracksContent);
  const total = status.completed + status.inProgress + status.pending;

  return {
    total,
    ...status,
    content: tracksContent,
  };
}
