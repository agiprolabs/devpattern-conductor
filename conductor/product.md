# Product Guide: DevPattern Conductor

## Overview

**DevPattern** is an MCP (Model Context Protocol) server that brings Context-Driven Development methodology to agentic coding platforms like Cline, Cursor, and Copilot.

> *"Measure twice, code once."*

## Problem Statement

AI coding agents often lack persistent project context, leading to:
- Inconsistent code that doesn't follow project conventions
- Repeated explanations of architecture and design decisions
- Code that works but doesn't fit the broader system
- Lost context between conversations

**DevPattern solves this** by maintaining persistent project context that travels with every AI interaction, ensuring consistent, high-quality code generation.

## Target Users

**Primary Users:** Individual developers using AI coding assistants
- Developers using Cline (VS Code / Cursor extension)
- Developers using Cursor AI
- Developers using GitHub Copilot
- Any developer working with LLM-powered coding tools

**User Needs:**
- Better context management for AI assistants
- Consistent code output that follows project standards
- Planning before implementation to reduce rework
- Safe iteration with the ability to revert changes

## Key Features

### 1. Persistent Project Context
- Product guide defining vision and goals
- Tech stack documentation
- Code style guides
- All context accessible to AI via MCP resources

### 2. Spec-First Planning
- Create detailed specifications before coding
- Generate implementation plans with phases and tasks
- Review and approve plans before execution
- Track-based organization for features and fixes

### 3. Git-Aware Operations
- Semantic commits tied to tasks
- Git notes for audit trails
- Smart revert at track, phase, or task level
- Phase checkpoint commits for verification

## Core Workflow

```
Context → Spec & Plan → Implement
```

1. **Setup:** Initialize project with product context, tech stack, and workflow preferences
2. **New Track:** Create a feature or bug track with spec and plan
3. **Implement:** Execute tasks following TDD workflow
4. **Verify:** Phase checkpoints with manual verification
5. **Iterate:** Revert and adjust as needed

## Success Metrics

- **GitHub Stars:** Community recognition and interest
- **npm Downloads:** Active usage tracking
- **Community Adoption:** Forks, contributions, and discussions
- **User Testimonials:** Qualitative feedback on improved workflows

## Future Vision

DevPattern aims to become more than a context manager:

### Phase 1: Core Functionality (Current)
- MCP server for Cline/Cursor integration
- Track-based development workflow
- Git-aware operations

### Phase 2: Team Collaboration
- Shared context across team members
- Collaborative track management
- Context synchronization

### Phase 3: Ecosystem Integration
- **CI/CD Integration:** Automated verification in pipelines
- **Project Management:** Sync with Jira, Linear, GitHub Projects
- **Analytics:** Track productivity and code quality metrics

## Non-Goals

- Not a replacement for version control
- Not a project management tool (complements existing tools)
- Not an AI model itself (works with any LLM via MCP)

---

*Last updated: December 2025*
