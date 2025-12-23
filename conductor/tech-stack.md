# Tech Stack: DevPattern Conductor

## Overview

DevPattern is built as a **Node.js MCP server** using TypeScript for type safety and modern ES module syntax.

## Core Technologies

### Language & Runtime

| Technology | Version | Purpose |
|------------|---------|---------|
| TypeScript | 5.3+ | Primary language with static typing |
| Node.js | 18+ | Runtime environment |
| ES Modules | ESM | Module system (`"type": "module"`) |

### Framework & Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| @modelcontextprotocol/sdk | ^1.0.0 | MCP server implementation |

### Development Tools

| Tool | Purpose |
|------|---------|
| tsc | TypeScript compiler for production builds |
| tsx | TypeScript execution for development |
| npm | Package management |

## Architecture

### Project Structure

```
devpattern/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── tools/            # Tool handlers
│   │   ├── setup.ts
│   │   ├── newTrack.ts
│   │   ├── implement.ts
│   │   ├── status.ts
│   │   └── revert.ts
│   ├── prompts/          # Mega-prompt definitions
│   │   └── *.ts
│   ├── resources/        # MCP resource handlers
│   │   └── context.ts
│   └── utils/            # Shared utilities
│       ├── files.ts
│       └── git.ts
├── templates/            # Default configuration templates
│   ├── workflow.md
│   └── code_styleguides/
├── dist/                 # Compiled output
└── conductor/            # Project-specific conductor files
```

### MCP Integration

DevPattern implements the Model Context Protocol:

- **Tools:** Exposed via `tools/list` and `tools/call`
- **Resources:** Project context via `resources/list` and `resources/read`
- **Transport:** stdio for CLI integration

## Build & Run

### Development
```bash
npm run dev          # Run with tsx (hot reload)
npm run watch        # Watch mode compilation
```

### Production
```bash
npm run build        # Compile TypeScript
npm start            # Run compiled version
```

### Testing
```bash
npm run inspect      # MCP Inspector for debugging
```

## Deployment

### npm Package
```bash
npm publish          # Publishes to npm registry
```

### Direct Installation
```bash
npm install -g devpattern-conductor
```

## Conventions

### TypeScript
- Strict mode enabled
- ES2022 target
- Node16 module resolution
- Source maps for debugging

### File Naming
- `kebab-case` for files
- `PascalCase` for types/interfaces
- `camelCase` for functions/variables

### Imports
- Explicit `.js` extensions in imports (required for ESM)
- Relative paths within package
- Type-only imports where applicable

---

*Last updated: December 2025*
