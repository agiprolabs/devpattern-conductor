/**
 * Context Resources - MCP resources for exposing project context
 */

import {
  exists,
  readFileContent,
  getContextPaths,
  getTrackDirectories,
} from "../utils/files.js";
import { join } from "path";

interface Resource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

/**
 * Get list of available resources based on current project state
 */
export async function getResources(
  projectPath: string = process.cwd()
): Promise<{ resources: Resource[] }> {
  const resources: Resource[] = [];
  const paths = getContextPaths(projectPath);

  // Check which context files exist and add them as resources
  if (await exists(paths.product)) {
    resources.push({
      uri: `devpattern://context/product`,
      name: "Product Guide",
      description: "Product vision, goals, target users, and features",
      mimeType: "text/markdown",
    });
  }

  if (await exists(paths.productGuidelines)) {
    resources.push({
      uri: `devpattern://context/product-guidelines`,
      name: "Product Guidelines",
      description: "Prose style, brand messaging, and visual identity guidelines",
      mimeType: "text/markdown",
    });
  }

  if (await exists(paths.techStack)) {
    resources.push({
      uri: `devpattern://context/tech-stack`,
      name: "Tech Stack",
      description: "Programming languages, frameworks, databases, and tools",
      mimeType: "text/markdown",
    });
  }

  if (await exists(paths.workflow)) {
    resources.push({
      uri: `devpattern://context/workflow`,
      name: "Workflow",
      description: "Development methodology, TDD practices, commit guidelines",
      mimeType: "text/markdown",
    });
  }

  if (await exists(paths.tracks)) {
    resources.push({
      uri: `devpattern://tracks`,
      name: "Tracks Overview",
      description: "Master list of all feature and bug tracks",
      mimeType: "text/markdown",
    });
  }

  // Add individual track resources
  const trackDirs = await getTrackDirectories(projectPath);
  for (const trackId of trackDirs) {
    resources.push({
      uri: `devpattern://tracks/${trackId}/spec`,
      name: `Track Spec: ${trackId}`,
      description: `Specification for track ${trackId}`,
      mimeType: "text/markdown",
    });

    resources.push({
      uri: `devpattern://tracks/${trackId}/plan`,
      name: `Track Plan: ${trackId}`,
      description: `Implementation plan for track ${trackId}`,
      mimeType: "text/markdown",
    });
  }

  return { resources };
}

/**
 * Read a specific resource by URI
 */
export async function readResource(
  uri: string,
  projectPath: string = process.cwd()
): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }> {
  const paths = getContextPaths(projectPath);

  // Parse the URI
  const uriParts = uri.replace("devpattern://", "").split("/");

  let content: string | null = null;
  let mimeType = "text/markdown";

  if (uriParts[0] === "context") {
    // Context files
    switch (uriParts[1]) {
      case "product":
        content = await readFileContent(paths.product);
        break;
      case "product-guidelines":
        content = await readFileContent(paths.productGuidelines);
        break;
      case "tech-stack":
        content = await readFileContent(paths.techStack);
        break;
      case "workflow":
        content = await readFileContent(paths.workflow);
        break;
    }
  } else if (uriParts[0] === "tracks") {
    if (uriParts.length === 1) {
      // Main tracks file
      content = await readFileContent(paths.tracks);
    } else {
      // Individual track files
      const trackId = uriParts[1];
      const fileType = uriParts[2];

      if (fileType === "spec") {
        content = await readFileContent(
          join(paths.tracksDir, trackId, "spec.md")
        );
      } else if (fileType === "plan") {
        content = await readFileContent(
          join(paths.tracksDir, trackId, "plan.md")
        );
      } else if (fileType === "metadata") {
        content = await readFileContent(
          join(paths.tracksDir, trackId, "metadata.json")
        );
        mimeType = "application/json";
      }
    }
  }

  if (content === null) {
    throw new Error(`Resource not found: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType,
        text: content,
      },
    ],
  };
}

/**
 * Get all context as a single combined resource
 */
export async function getAllContext(
  projectPath: string = process.cwd()
): Promise<string> {
  const paths = getContextPaths(projectPath);
  const sections: string[] = [];

  const product = await readFileContent(paths.product);
  if (product) {
    sections.push("# Product Context\n\n" + product);
  }

  const guidelines = await readFileContent(paths.productGuidelines);
  if (guidelines) {
    sections.push("# Product Guidelines\n\n" + guidelines);
  }

  const techStack = await readFileContent(paths.techStack);
  if (techStack) {
    sections.push("# Tech Stack\n\n" + techStack);
  }

  const workflow = await readFileContent(paths.workflow);
  if (workflow) {
    sections.push("# Workflow\n\n" + workflow);
  }

  const tracks = await readFileContent(paths.tracks);
  if (tracks) {
    sections.push("# Tracks\n\n" + tracks);
  }

  return sections.join("\n\n---\n\n");
}
