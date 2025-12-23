# DevPattern

**Context-Driven Development MCP Server**

DevPattern is an MCP (Model Context Protocol) server that brings the [Conductor](https://github.com/gemini-cli-extensions/conductor) methodology to Cline, Cursor, and other agentic coding platforms.

> *"Measure twice, code once."*

## What is Context-Driven Development?

Instead of just writing code, DevPattern ensures a consistent, high-quality lifecycle for every task:

```
Context → Spec & Plan → Implement
```

By treating context as a managed artifact alongside your code, you transform your repository into a single source of truth that drives every agent interaction with deep, persistent project awareness.

## Features

- **Plan before you build**: Create specs and plans that guide the AI agent
- **Maintain context**: Ensure AI follows style guides, tech stack choices, and product goals
- **Iterate safely**: Review plans before code is written, keeping you in the loop
- **Work as a team**: Set project-level context that becomes a shared foundation
- **Smart revert**: Git-aware undo that understands logical units of work

## Installation

### For Cline

Add to your Cline MCP settings (`~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "devpattern": {
      "command": "node",
      "args": ["/path/to/devpattern/dist/index.js"],
      "disabled": false
    }
  }
}
```

Or install globally:

```bash
npm install -g devpattern-conductor
```

Then add to your MCP settings:

```json
{
  "mcpServers": {
    "devpattern": {
      "command": "devpattern-conductor",
      "disabled": false
    }
  }
}
```

### Using npx (no installation)

```json
{
  "mcpServers": {
    "devpattern": {
      "command": "npx",
      "args": ["-y", "devpattern-conductor"],
      "disabled": false
    }
  }
}
```

### Build from Source

```bash
git clone https://github.com/agiprolabs/devpattern-conductor.git
cd devpattern-conductor
npm install
npm run build
```

## Usage

### 1. Set Up the Project (Run Once)

Call the `devpattern_setup` tool to initialize your project. This guides you through:

- **Product**: Define project context (users, goals, features)
- **Product Guidelines**: Set standards (prose style, brand messaging)
- **Tech Stack**: Configure preferences (language, frameworks, database)
- **Workflow**: Set team preferences (TDD, commit strategy)

**Generated Artifacts:**
```
conductor/
├── product.md
├── product-guidelines.md
├── tech-stack.md
├── workflow.md
├── code_styleguides/
└── tracks.md
```

### 2. Create a New Track

Call `devpattern_newTrack` to start a new feature or bug fix. This:

- Generates a detailed **spec.md** with requirements
- Creates an actionable **plan.md** with phases and tasks
- Tracks status in the master **tracks.md**

**Arguments:**
- `description` (optional): Brief description like "Add dark mode toggle"

### 3. Implement the Track

Call `devpattern_implement` to execute the plan. The AI will:

1. Select the next pending task
2. Follow the defined workflow (TDD: Write Test → Fail → Implement → Pass)
3. Update status as it progresses
4. Guide you through manual verification checkpoints

**Arguments:**
- `trackId` (optional): Specific track to implement

### 4. Check Status

Call `devpattern_status` for a comprehensive progress report.

### 5. Revert Work

Call `devpattern_revert` to undo work at the track, phase, or task level.

**Arguments:**
- `target` (optional): What to revert

## MCP Tools Reference

| Tool | Description |
|------|-------------|
| `devpattern_setup` | Initialize project with product context, tech stack, and workflow |
| `devpattern_newTrack` | Create a new feature or bug track with spec and plan |
| `devpattern_implement` | Execute tasks from the current track's plan |
| `devpattern_status` | Display progress of all tracks and tasks |
| `devpattern_revert` | Git-aware revert of tracks, phases, or tasks |

## MCP Resources

The server exposes project context as readable resources:

| Resource URI | Description |
|-------------|-------------|
| `devpattern://context/product` | Product guide |
| `devpattern://context/tech-stack` | Technology stack |
| `devpattern://context/workflow` | Development workflow |
| `devpattern://tracks` | All tracks overview |
| `devpattern://tracks/{id}/spec` | Track specification |
| `devpattern://tracks/{id}/plan` | Track implementation plan |

## Workflow System

DevPattern follows a strict TDD-based workflow by default:

1. **Select Task** from plan.md
2. **Mark In Progress** `[~]`
3. **Write Failing Tests** (Red Phase)
4. **Implement to Pass** (Green Phase)
5. **Refactor** (optional)
6. **Verify Coverage** (>80% target)
7. **Commit** with semantic message
8. **Add Git Note** for audit trail
9. **Mark Complete** `[x]`

### Phase Checkpoints

At the end of each phase:
- Automated tests run
- Manual verification is presented to user
- Checkpoint commit is created
- Verification report is attached as git note

## Attribution

DevPattern is forked from [Google's Conductor](https://github.com/gemini-cli-extensions/conductor) extension for Gemini CLI.

## License

Apache License 2.0 - See [LICENSE](LICENSE)

---

Made with ❤️ for the agentic coding community
