# Product Guidelines: DevPattern Conductor

## Communication Style

### Tone
**Friendly and approachable** - DevPattern welcomes developers of all skill levels.

- Use clear, jargon-free language when possible
- Explain technical concepts when introducing them
- Be encouraging and supportive in feedback
- Avoid condescending or overly casual language

### Voice Examples

✅ **Do:**
> "Let's create a new track for this feature. I'll guide you through defining the requirements."

❌ **Don't:**
> "Initiating track creation sequence. Provide requirements specification."

✅ **Do:**
> "The product guide helps me understand your project better. What are you building?"

❌ **Don't:**
> "Missing required context. Configure product.md before proceeding."

## Brand Identity

### Theme: Pattern & Weaving

DevPattern uses the metaphor of **weaving patterns** in code:

- **Threads** → Individual pieces of context (product, tech stack, style guides)
- **Patterns** → Consistent code that follows established conventions
- **Weaving** → The process of combining context with AI assistance
- **Fabric** → The cohesive codebase that results from consistent patterns

### Tagline
> *"Measure twice, code once."*

### Key Messaging

1. **Context is King** - Your project knowledge should persist across AI conversations
2. **Plan Before You Build** - Specifications prevent costly rework
3. **Consistency Matters** - Patterns create maintainable code
4. **Stay in Control** - Review plans before code is written

## Visual Communication

### Message Formatting

Use **structured format** with clear headings and bullet points:

```markdown
## Section Title

**Key Point:** Brief explanation

- Detail 1
- Detail 2
- Detail 3
```

### Status Indicators

Use clear, consistent status markers:

| Status | Marker | Usage |
|--------|--------|-------|
| Complete | `[x]` | Task finished |
| In Progress | `[~]` | Currently working |
| Pending | `[ ]` | Not started |
| Blocked | `[!]` | Needs attention |

### Error Messages

Format errors with:
1. Clear title stating the problem
2. Explanation of why it occurred
3. Actionable next steps

**Example:**
```markdown
## Error: Product Guide Not Found

The product.md file is missing from the conductor directory.

**Why this matters:**
DevPattern needs product context to generate appropriate specs and plans.

**Next steps:**
1. Run `devpattern_setup` to create the product guide
2. Or manually create `conductor/product.md`
```

## Documentation Standards

### Code Examples
- Always provide runnable examples
- Include expected output when helpful
- Use syntax highlighting

### File Paths
- Use relative paths when possible
- Prefix absolute paths with project root indicator

### Versioning
- Include "Last updated" dates on documentation
- Note breaking changes prominently

## Accessibility

- Provide text alternatives for any visual elements
- Use semantic structure (headings, lists)
- Ensure sufficient contrast in any UI elements
- Support screen readers in CLI output

---

*Last updated: December 2025*
