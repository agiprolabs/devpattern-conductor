# Specification: Web Dashboard for DevPattern Documentation

## Overview

Create a web-based dashboard that provides a unified interface for viewing, editing, and managing DevPattern documentation across all projects on the user's machine.

## Problem Statement

Currently, DevPattern documentation lives as markdown files in `conductor/` directories. While this is developer-friendly, it presents challenges:

1. **Discoverability:** Users must navigate file systems to find project documentation
2. **Editing:** Markdown editing requires familiarity with markdown syntax
3. **Preview:** No built-in way to see rendered documentation
4. **Export:** No easy way to generate PDFs or other formats
5. **Cross-Project View:** No unified view of all DevPattern projects

## Goals

1. Provide a beautiful, intuitive interface for DevPattern documentation
2. Enable rich-text editing with live markdown preview
3. Support export to multiple formats (PDF, DOCX, Markdown)
4. Display all DevPattern projects in a unified dashboard
5. Integrate with existing MCP server for consistency

## Non-Goals

1. Cloud synchronization (future phase)
2. Real-time collaboration (future phase)
3. Version control UI (use git directly)
4. Mobile-first design (desktop-focused)

## User Stories

### US-1: View All Projects
**As a** developer using DevPattern
**I want to** see all my DevPattern projects in one place
**So that** I can quickly access any project's documentation

**Acceptance Criteria:**
- Dashboard shows cards for each discovered project
- Each card displays project name, status, and last modified
- Projects are found by scanning configured directories for `conductor/` folders
- Click card to navigate to project details

### US-2: Browse Project Documentation
**As a** developer
**I want to** browse all documentation files for a project
**So that** I can find and view specific documents

**Acceptance Criteria:**
- Tree view of all files in `conductor/` directory
- Clicking file opens it in viewer/editor
- File types distinguished (product.md, tech-stack.md, tracks, etc.)
- Breadcrumb navigation

### US-3: View Documentation with Rich Formatting
**As a** developer or stakeholder
**I want to** view documentation with proper formatting
**So that** I can easily read and understand the content

**Acceptance Criteria:**
- Markdown rendered with syntax highlighting
- Tables, code blocks, and lists formatted correctly
- Links are clickable
- Headers create navigation structure

### US-4: Edit Documentation
**As a** developer
**I want to** edit documentation with a rich text editor
**So that** I don't need to know markdown syntax

**Acceptance Criteria:**
- WYSIWYG editor with formatting toolbar
- Live preview of markdown output
- Keyboard shortcuts (Ctrl+B for bold, etc.)
- Auto-save or explicit save with Ctrl+S
- Changes written back to markdown files

### US-5: Export Documentation
**As a** developer or project manager
**I want to** export documentation to different formats
**So that** I can share it with non-technical stakeholders

**Acceptance Criteria:**
- Export single document or entire project
- Formats: PDF, DOCX, Markdown (zip)
- Styling preserved in exports
- Download triggered in browser

### US-6: View Track Progress
**As a** developer
**I want to** see visual progress of tracks
**So that** I can understand project status at a glance

**Acceptance Criteria:**
- Progress bar for each track
- Phase breakdown showing completed/pending
- Task count and status
- Link to track details

## Technical Requirements

### Architecture

```
devpattern/
├── src/              # MCP Server (existing)
├── server/           # API Server (new)
│   ├── index.ts
│   ├── routes/
│   │   ├── projects.ts
│   │   ├── documents.ts
│   │   └── export.ts
│   └── services/
│       ├── scanner.ts
│       └── exporter.ts
└── web/              # React Dashboard (new)
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   ├── pages/
    │   └── api/
    └── package.json
```

### Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Markdown Editor | Tiptap or MDXEditor |
| API Server | Express.js |
| Export | jsPDF + docx.js |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all discovered projects |
| GET | `/api/projects/:id` | Get project details |
| GET | `/api/projects/:id/documents` | List project documents |
| GET | `/api/projects/:id/documents/:path` | Get document content |
| PUT | `/api/projects/:id/documents/:path` | Update document |
| POST | `/api/export/pdf` | Generate PDF |
| POST | `/api/export/docx` | Generate DOCX |

### Configuration

Projects are discovered by scanning directories specified in a config:

```json
{
  "projectDirectories": [
    "~/Desktop/projects",
    "~/code"
  ],
  "excludePatterns": [
    "node_modules",
    ".git"
  ]
}
```

## UI Mockups

### Dashboard Page
```
┌─────────────────────────────────────────────────────────────┐
│  🎼 DevPattern Dashboard                        ⚙️ Settings │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ devpattern      │  │ my-web-app      │  │ api-server  │ │
│  │ ━━━━━━━━━━━━━━  │  │ ━━━━━━━━━━━━━━  │  │ ━━━━━━━━━━  │ │
│  │ 3 tracks        │  │ 2 tracks        │  │ 1 track     │ │
│  │ Last: 2h ago    │  │ Last: 1d ago    │  │ Last: 3d    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Document Editor
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Project      product.md              💾 ⬇️ Export │
├─────────────────────────────────────────────────────────────┤
│ B I U  H1 H2 H3  • ≡  ``` 🔗  📷                           │
├───────────────────────────┬─────────────────────────────────┤
│ # Product Guide           │ Product Guide                   │
│                           │ ═════════════                   │
│ **DevPattern** is an MCP  │ DevPattern is an MCP server...  │
│ server that brings...     │                                 │
│                           │                                 │
│ ## Problem Statement      │ Problem Statement               │
│                           │ ─────────────────               │
│ AI coding agents often... │ AI coding agents often lack...  │
├───────────────────────────┴─────────────────────────────────┤
│           Markdown Editor         │         Preview          │
└─────────────────────────────────────────────────────────────┘
```

## Security Considerations

1. **Local Only:** Dashboard runs locally, no external access
2. **File Access:** Only reads/writes to conductor/ directories
3. **No Authentication:** Single-user local app (Phase 1)
4. **Path Validation:** Prevent directory traversal attacks

## Success Metrics

1. All DevPattern projects discoverable in dashboard
2. Documents render correctly with full markdown support
3. Edits persist correctly to markdown files
4. Export produces valid PDF/DOCX files
5. Dashboard loads in under 2 seconds

## Dependencies

- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Tiptap or MDXEditor
- Express.js
- jsPDF
- docx
- fs-extra (Node.js)

---

*Spec Version: 1.0*
*Last Updated: December 2025*
