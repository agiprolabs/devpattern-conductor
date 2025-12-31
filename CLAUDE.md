# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevPattern is a Context-Driven Development MCP (Model Context Protocol) server forked from Google's Conductor. It enables structured, context-aware development workflows for AI coding assistants like Cline and Cursor by enforcing a "Context → Spec & Plan → Implement" methodology.

The project consists of three main components:
1. **MCP Server** (root `src/`) - The core MCP server that exposes tools and resources
2. **Dashboard API** (`packages/server/`) - Express-based REST API for project discovery
3. **Web Dashboard** (`packages/web/`) - React-based UI for visualizing projects and tracks

## Build Commands

### Main MCP Server
```bash
# Build the MCP server
npm run build

# Build and watch for changes
npm run watch

# Run in development mode
npm run dev

# Start the built server
npm start

# Inspect with MCP Inspector
npm run inspect
```

### Build All Components
```bash
# Build everything (MCP + API + Web)
npm run build:all

# Build MCP server only
npm run build:mcp

# Build API server only
npm run build:server

# Build web dashboard only
npm run build:web
```

### Development Servers
```bash
# Run API server in dev mode (port 4201)
npm run dev:server

# Run web dashboard in dev mode (port 5173)
npm run dev:web

# Run both dashboard components concurrently
npm run dev:dashboard
```

## Architecture

### MCP Server Structure (`src/`)

The MCP server follows a clean separation of concerns:

```
src/
├── index.ts           # Main server entry point, registers handlers
├── tools/             # MCP tool implementations (setup, newTrack, implement, status, revert)
├── resources/         # MCP resources for exposing project context
├── prompts/           # Prompt templates for AI interactions
└── utils/             # Shared utilities (git operations, file I/O)
```

**Key Pattern**: Each tool follows a two-file pattern:
- Tool definition with schema (`export const toolName: Tool`)
- Handler function (`export async function handleToolName()`)

### Workspace Architecture

This is a **monorepo** using npm workspaces:
- Root package manages the MCP server and global dependencies
- `packages/server/` is an Express API server for the web dashboard
- `packages/web/` is a Vite + React SPA

TypeScript is configured with:
- `tsconfig.base.json` - Shared compiler options
- `tsconfig.json` - Root MCP server configuration
- Each workspace has its own `tsconfig.json`

### MCP Protocol Implementation

The server implements three MCP capabilities:

1. **Tools** - Executable functions agents can call:
   - `devpattern_setup` - Initialize project with context files
   - `devpattern_newTrack` - Create feature/bug track with spec + plan
   - `devpattern_implement` - Execute track plan tasks
   - `devpattern_status` - Report on all tracks
   - `devpattern_revert` - Git-aware revert of work

2. **Resources** - URI-addressable project context:
   - `devpattern://context/product` - Product vision and goals
   - `devpattern://context/tech-stack` - Technology stack
   - `devpattern://context/workflow` - Development workflow
   - `devpattern://tracks/{id}/spec` - Track specifications
   - `devpattern://tracks/{id}/plan` - Implementation plans

3. **Prompts** - Reusable prompt templates matching each tool

### Project State Management

DevPattern manages project state in the `conductor/` directory (created by `devpattern_setup`):

```
conductor/
├── product.md              # Product context
├── product-guidelines.md   # Brand and style guidelines
├── tech-stack.md          # Technologies and preferences
├── workflow.md            # Development process (TDD, commit strategy)
├── code_styleguides/      # Language-specific style guides
├── tracks.md              # Master list of all tracks
├── setup_state.json       # Setup wizard progress
└── tracks/                # Individual track directories
    └── {trackId}/
        ├── metadata.json  # Track metadata
        ├── spec.md        # Requirements specification
        └── plan.md        # Implementation plan with tasks
```

**Important**: The `conductor/` directory is gitignored at the template level but individual projects should commit these files as they represent the single source of truth for AI context.

### Dashboard Components

**API Server** (`packages/server/src/index.ts`):
- Express server on port 4201 (configurable via PORT env var)
- Discovers DevPattern projects by scanning for `conductor/` directories
- Reads markdown files and track metadata to build project info
- Config stored in `~/.devpattern/config.json`
- Default search paths: `~/Desktop/projects`, `~/Projects`, `~/Developer`, `~/repos`

**Web Dashboard** (`packages/web/src/`):
- Single-page React app built with Vite
- React Router for navigation
- ReactMarkdown with syntax highlighting for document viewing
- Tailwind CSS for styling
- Communicates with API server via `/api` endpoints

## Development Workflow

### Adding a New MCP Tool

1. Create tool definition in `src/tools/{toolname}.ts`:
   ```typescript
   export const myTool: Tool = {
     name: "devpattern_myTool",
     description: "...",
     inputSchema: { /* Zod-like schema */ }
   };

   export async function handleMyTool(args: Record<string, unknown>) {
     // Implementation
   }
   ```

2. Create corresponding prompt in `src/prompts/{toolname}.ts`

3. Register in `src/index.ts`:
   - Add to `ListToolsRequestSchema` handler
   - Add case to `CallToolRequestSchema` handler
   - Add to prompts index if applicable

4. Update MCP resources if the tool exposes new context

### Modifying the Dashboard

**API changes**:
1. Edit `packages/server/src/index.ts`
2. Run `npm run dev:server` to test
3. Update types if needed (interfaces at top of file)

**UI changes**:
1. Edit `packages/web/src/App.tsx` (single-file SPA)
2. Run `npm run dev:web` to test with hot reload
3. Types should match the server interfaces

**Full dashboard testing**:
```bash
npm run dev:dashboard  # Runs both API and web concurrently
```

### Template System

The `templates/` directory contains initial content for new projects:
- `workflow.md` - Default TDD-based workflow
- `code_styleguides/` - Language-specific style guides (TypeScript, Python, Go, etc.)

These are copied during `devpattern_setup` and customized by the AI.

## Important Patterns

### File System Operations
Use utilities from `src/utils/files.ts`:
- `getContextPaths()` - Get standard conductor file paths
- `exists()` - Check file existence
- `readFileContent()` - Read with error handling
- `writeFileContent()` - Write with directory creation
- `isConductorSetup()` - Check if project is initialized
- `readSetupState()` / `writeSetupState()` - Manage setup wizard state

### Git Operations
Use utilities from `src/utils/git.ts` for git-aware operations when manipulating tracks.

### Error Handling
MCP tool handlers should return:
```typescript
{
  content: [{ type: "text", text: "..." }],
  isError?: boolean
}
```

### Port Configuration
- MCP Server: stdio (no port)
- API Server: 4201 (configurable)
- Web Dev Server: 5173 (Vite default)

If port 4201 is in use, set `PORT` environment variable before running the API server.

## Testing Integration

To test the MCP server with Claude Desktop or Cline:

1. Build: `npm run build`
2. Add to MCP settings:
   ```json
   {
     "mcpServers": {
       "devpattern": {
         "command": "node",
         "args": ["/absolute/path/to/devpattern/dist/index.js"]
       }
     }
   }
   ```
3. Restart the AI client
4. Test with: "Call the devpattern_status tool"

## Key Design Principles

- **Tools are stateless**: Each tool invocation reads current project state from disk
- **Markdown as interface**: All context is stored as human-readable markdown
- **Git-aware**: Operations track git state for smart revert capabilities
- **Workflow enforcement**: The TDD workflow in `workflow.md` guides AI behavior during implementation
- **Context accumulation**: Each track's spec references product/tech-stack/workflow for consistency
