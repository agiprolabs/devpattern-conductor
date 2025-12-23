# Implementation Plan: Web Dashboard for DevPattern Documentation

**Track ID:** web-dashboard_20251223
**Spec:** [spec.md](./spec.md)
**Status:** In Progress

---

## Phase 1: Project Setup and Infrastructure

### Tasks

- [ ] **1.1** Set up monorepo structure with npm workspaces
  - Create `web/` directory for React dashboard
  - Create `server/` directory for API server
  - Configure root package.json with workspaces
  - Add shared TypeScript configuration

- [ ] **1.2** Initialize React dashboard with Vite
  - Create Vite + React + TypeScript project in `web/`
  - Configure Tailwind CSS
  - Install shadcn/ui components
  - Set up folder structure (components, pages, api)

- [ ] **1.3** Initialize Express API server
  - Create Express + TypeScript project in `server/`
  - Configure CORS for local development
  - Set up route structure
  - Add health check endpoint

- [ ] **1.4** Configure development workflow
  - Add concurrent script to run server + web
  - Configure proxy in Vite for API calls
  - Add build scripts for production
  - Update README with new commands

---

## Phase 2: Project Discovery and API

### Tasks

- [ ] **2.1** Implement project scanner service
  - Create `scanner.ts` service in server
  - Scan configured directories for `conductor/` folders
  - Parse project metadata from conductor files
  - Handle nested directories and symlinks

- [ ] **2.2** Create projects API endpoints
  - `GET /api/projects` - List all discovered projects
  - `GET /api/projects/:id` - Get single project details
  - Add project configuration file for scan directories
  - Implement caching for project list

- [ ] **2.3** Create documents API endpoints
  - `GET /api/projects/:id/documents` - List project documents
  - `GET /api/projects/:id/documents/*` - Get document content
  - `PUT /api/projects/:id/documents/*` - Update document
  - Add path validation to prevent directory traversal

- [ ] **2.4** Write API tests
  - Test project discovery
  - Test document CRUD operations
  - Test error handling
  - Test path validation security

---

## Phase 3: Dashboard UI

### Tasks

- [ ] **3.1** Create layout and navigation
  - Build main layout with header and sidebar
  - Create navigation between pages
  - Add responsive design foundations
  - Set up dark/light theme support

- [ ] **3.2** Build Dashboard page
  - Create project card component
  - Display grid of discovered projects
  - Show project name, status, and last modified
  - Add loading and empty states

- [ ] **3.3** Build Project View page
  - Create document tree component
  - Show project details header
  - Display track progress summary
  - Add breadcrumb navigation

- [ ] **3.4** Connect UI to API
  - Create API client using fetch
  - Add Zustand store for state management
  - Handle loading and error states
  - Implement project refresh

---

## Phase 4: Document Viewer

### Tasks

- [ ] **4.1** Create markdown renderer
  - Install and configure react-markdown
  - Add syntax highlighting for code blocks
  - Style tables, lists, and blockquotes
  - Handle images and links

- [ ] **4.2** Build Document Viewer page
  - Display rendered markdown
  - Add table of contents from headers
  - Implement smooth scroll to sections
  - Add copy button for code blocks

- [ ] **4.3** Add document navigation
  - Previous/Next document buttons
  - Breadcrumb showing document path
  - Back to project link
  - Keyboard navigation (arrow keys)

---

## Phase 5: Document Editor

### Tasks

- [ ] **5.1** Set up markdown editor
  - Install and configure Tiptap or MDXEditor
  - Create editor wrapper component
  - Configure toolbar with formatting options
  - Add keyboard shortcuts

- [ ] **5.2** Implement live preview
  - Create split-pane layout
  - Sync scroll positions
  - Add toggle for preview-only mode
  - Highlight edited sections

- [ ] **5.3** Implement save functionality
  - Add save button and Ctrl+S shortcut
  - Call PUT API to save document
  - Show save status indicator
  - Handle save errors gracefully

- [ ] **5.4** Add auto-save (optional)
  - Debounce changes (2 second delay)
  - Save draft locally before server
  - Show "Saving..." indicator
  - Recover from failed saves

---

## Phase 6: Export Functionality

### Tasks

- [ ] **6.1** Implement PDF export
  - Install jsPDF and html2canvas
  - Create PDF generation service
  - Apply styling to exported document
  - Handle multi-page documents

- [ ] **6.2** Implement DOCX export
  - Install docx.js
  - Convert markdown to DOCX format
  - Preserve formatting (headers, code, tables)
  - Generate downloadable file

- [ ] **6.3** Create Export UI
  - Add export button to document viewer
  - Show format selection dropdown
  - Display export progress
  - Trigger download in browser

- [ ] **6.4** Implement project-wide export
  - Export all documents as ZIP
  - Include folder structure
  - Add PDF/DOCX option for full project
  - Show progress for multi-file export

---

## Phase 7: Track Visualization

### Tasks

- [ ] **7.1** Create track progress component
  - Parse plan.md for task status
  - Calculate completion percentage
  - Display progress bar
  - Show phase breakdown

- [ ] **7.2** Build Track List view
  - List all tracks for a project
  - Show status and progress for each
  - Filter by status (pending, in-progress, complete)
  - Sort by date or name

- [ ] **7.3** Build Track Detail view
  - Display full spec.md content
  - Show plan.md with task checkboxes
  - Highlight current task
  - Link to related commits (if available)

---

## Phase 8: Polish and Documentation

### Tasks

- [ ] **8.1** Add Settings page
  - Configure scan directories
  - Theme preferences (dark/light)
  - Editor preferences
  - Save settings to config file

- [ ] **8.2** Improve error handling
  - User-friendly error messages
  - Error boundaries for React
  - Retry mechanisms for API calls
  - Offline mode indicators

- [ ] **8.3** Performance optimization
  - Lazy load pages
  - Cache API responses
  - Optimize large document rendering
  - Measure and improve load times

- [ ] **8.4** Documentation
  - Update README with web dashboard
  - Add usage guide
  - Document API endpoints
  - Add contribution guidelines

---

## Definition of Done

Each task is complete when:
- [ ] Code implemented and tested
- [ ] Unit tests pass with >80% coverage
- [ ] UI works in Chrome and Firefox
- [ ] No TypeScript errors
- [ ] Code follows style guidelines
- [ ] Changes committed with proper message

---

*Plan Version: 1.0*
*Last Updated: December 2025*
