/**
 * Git utilities for DevPattern
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface ExecResult {
  stdout: string;
  stderr: string;
}

/**
 * Execute a git command
 */
export async function git(
  command: string,
  cwd: string = process.cwd()
): Promise<ExecResult> {
  try {
    const result = await execAsync(`git ${command}`, { cwd });
    return {
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
    };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "stdout" in error) {
      const execError = error as { stdout: string; stderr: string };
      return {
        stdout: execError.stdout?.trim() || "",
        stderr: execError.stderr?.trim() || "",
      };
    }
    throw error;
  }
}

/**
 * Check if current directory is a git repository
 */
export async function isGitRepo(cwd: string = process.cwd()): Promise<boolean> {
  try {
    await git("rev-parse --is-inside-work-tree", cwd);
    return true;
  } catch {
    return false;
  }
}

/**
 * Initialize a new git repository
 */
export async function initRepo(cwd: string = process.cwd()): Promise<void> {
  await git("init", cwd);
}

/**
 * Check if there are uncommitted changes
 */
export async function hasUncommittedChanges(
  cwd: string = process.cwd()
): Promise<boolean> {
  const result = await git("status --porcelain", cwd);
  return result.stdout.length > 0;
}

/**
 * Get the current commit hash
 */
export async function getCurrentCommitHash(
  cwd: string = process.cwd()
): Promise<string | null> {
  try {
    const result = await git("log -1 --format=%H", cwd);
    return result.stdout || null;
  } catch {
    return null;
  }
}

/**
 * Get short commit hash (7 characters)
 */
export async function getShortCommitHash(
  cwd: string = process.cwd()
): Promise<string | null> {
  try {
    const result = await git("log -1 --format=%h", cwd);
    return result.stdout || null;
  } catch {
    return null;
  }
}

/**
 * Stage files
 */
export async function stageFiles(
  files: string | string[],
  cwd: string = process.cwd()
): Promise<void> {
  const fileList = Array.isArray(files) ? files.join(" ") : files;
  await git(`add ${fileList}`, cwd);
}

/**
 * Stage all changes
 */
export async function stageAll(cwd: string = process.cwd()): Promise<void> {
  await git("add -A", cwd);
}

/**
 * Commit with a message
 */
export async function commit(
  message: string,
  cwd: string = process.cwd()
): Promise<void> {
  // Escape quotes in the message
  const escapedMessage = message.replace(/"/g, '\\"');
  await git(`commit -m "${escapedMessage}"`, cwd);
}

/**
 * Add a git note to a commit
 */
export async function addNote(
  commitHash: string,
  note: string,
  cwd: string = process.cwd()
): Promise<void> {
  const escapedNote = note.replace(/"/g, '\\"');
  await git(`notes add -m "${escapedNote}" ${commitHash}`, cwd);
}

/**
 * Revert a commit
 */
export async function revertCommit(
  commitHash: string,
  noEdit: boolean = true,
  cwd: string = process.cwd()
): Promise<void> {
  const noEditFlag = noEdit ? "--no-edit" : "";
  await git(`revert ${noEditFlag} ${commitHash}`, cwd);
}

/**
 * Get the diff of changed files between two commits
 */
export async function getDiffFiles(
  fromCommit: string,
  toCommit: string = "HEAD",
  cwd: string = process.cwd()
): Promise<string[]> {
  const result = await git(`diff --name-only ${fromCommit} ${toCommit}`, cwd);
  return result.stdout.split("\n").filter((f) => f.length > 0);
}

/**
 * Get git log for a specific file
 */
export async function getFileLog(
  filePath: string,
  cwd: string = process.cwd()
): Promise<string> {
  const result = await git(`log --oneline -- ${filePath}`, cwd);
  return result.stdout;
}
