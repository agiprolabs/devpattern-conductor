/**
 * File system utilities for DevPattern
 */

import { readFile, writeFile, mkdir, access, readdir, stat } from "fs/promises";
import { join, dirname } from "path";
import { constants } from "fs";

/**
 * Check if a file or directory exists
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a file and return its contents
 */
export async function readFileContent(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Write content to a file, creating directories if needed
 */
export async function writeFileContent(
  path: string,
  content: string
): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf-8");
}

/**
 * List files in a directory
 */
export async function listDirectory(path: string): Promise<string[]> {
  try {
    return await readdir(path);
  } catch {
    return [];
  }
}

/**
 * Check if path is a directory
 */
export async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Get the conductor directory path for a project
 */
export function getConductorPath(projectPath: string = process.cwd()): string {
  return join(projectPath, "conductor");
}

/**
 * Get paths to all conductor context files
 */
export function getContextPaths(projectPath: string = process.cwd()) {
  const conductorPath = getConductorPath(projectPath);
  return {
    product: join(conductorPath, "product.md"),
    productGuidelines: join(conductorPath, "product-guidelines.md"),
    techStack: join(conductorPath, "tech-stack.md"),
    workflow: join(conductorPath, "workflow.md"),
    tracks: join(conductorPath, "tracks.md"),
    setupState: join(conductorPath, "setup_state.json"),
    codeStyleguides: join(conductorPath, "code_styleguides"),
    tracksDir: join(conductorPath, "tracks"),
  };
}

/**
 * Check if conductor is set up in a project
 */
export async function isConductorSetup(
  projectPath: string = process.cwd()
): Promise<boolean> {
  const paths = getContextPaths(projectPath);
  const requiredFiles = [paths.product, paths.techStack, paths.workflow];

  for (const file of requiredFiles) {
    if (!(await exists(file))) {
      return false;
    }
  }
  return true;
}

/**
 * Read the setup state
 */
export async function readSetupState(
  projectPath: string = process.cwd()
): Promise<{ last_successful_step: string } | null> {
  const paths = getContextPaths(projectPath);
  const content = await readFileContent(paths.setupState);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Write the setup state
 */
export async function writeSetupState(
  step: string,
  projectPath: string = process.cwd()
): Promise<void> {
  const paths = getContextPaths(projectPath);
  await writeFileContent(
    paths.setupState,
    JSON.stringify({ last_successful_step: step }, null, 2)
  );
}

/**
 * Generate a track ID from a description
 */
export function generateTrackId(description: string): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const shortName = description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30);
  return `${shortName}_${dateStr}`;
}

/**
 * Get all track directories
 */
export async function getTrackDirectories(
  projectPath: string = process.cwd()
): Promise<string[]> {
  const paths = getContextPaths(projectPath);
  const tracksDir = paths.tracksDir;

  if (!(await exists(tracksDir))) {
    return [];
  }

  const entries = await listDirectory(tracksDir);
  const tracks: string[] = [];

  for (const entry of entries) {
    const entryPath = join(tracksDir, entry);
    if (await isDirectory(entryPath)) {
      tracks.push(entry);
    }
  }

  return tracks;
}
