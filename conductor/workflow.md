# Project Workflow

## Guiding Principles

1. **The Plan is the Source of Truth:** All work must be tracked in `plan.md`
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` *before* implementation
3. **Test-Driven Development:** Write unit tests before implementing functionality
4. **High Code Coverage:** Aim for >80% code coverage for all modules
5. **User Experience First:** Every decision should prioritize user experience
6. **Non-Interactive & CI-Aware:** Prefer non-interactive commands. Use `CI=true` for watch-mode tools (tests, linters) to ensure single execution.

## Task Workflow

All tasks follow a strict lifecycle:

### Standard Task Workflow

1. **Select Task:** Choose the next available task from `plan.md` in sequential order

2. **Mark In Progress:** Before beginning work, edit `plan.md` and change the task from `[ ]` to `[~]`

3. **Write Failing Tests (Red Phase):**
   - Create a new test file for the feature or bug fix.
   - Write one or more unit tests that clearly define the expected behavior and acceptance criteria for the task.
   - **CRITICAL:** Run the tests and confirm that they fail as expected. This is the "Red" phase of TDD. Do not proceed until you have failing tests.

4. **Implement to Pass Tests (Green Phase):**
   - Write the minimum amount of application code necessary to make the failing tests pass.
   - Run the test suite again and confirm that all tests now pass. This is the "Green" phase.

5. **Refactor (Optional but Recommended):**
   - With the safety of passing tests, refactor the implementation code and the test code to improve clarity, remove duplication, and enhance performance without changing the external behavior.
   - Rerun tests to ensure they still pass after refactoring.

6. **Verify Coverage:** Run coverage reports using the project's chosen tools:
   ```bash
   npm test -- --coverage
   ```
   Target: >80% coverage for new code.

7. **Document Deviations:** If implementation differs from tech stack:
   - **STOP** implementation
   - Update `tech-stack.md` with new design
   - Add dated note explaining the change
   - Resume implementation

8. **Commit Code Changes:**
   - Stage all code changes related to the task.
   - Propose a clear, concise commit message e.g, `feat(web): Add project scanner`.
   - Perform the commit.

9. **Attach Task Summary with Git Notes:**
   - **Step 9.1: Get Commit Hash:** Obtain the hash of the *just-completed commit* (`git log -1 --format="%H"`).
   - **Step 9.2: Draft Note Content:** Create a detailed summary for the completed task.
   - **Step 9.3: Attach Note:** Use the `git notes` command to attach the summary to the commit.

10. **Get and Record Task Commit SHA:**
    - **Step 10.1: Update Plan:** Read `plan.md`, find the line for the completed task, update its status from `[~]` to `[x]`, and append the first 7 characters of the commit hash.
    - **Step 10.2: Write Plan:** Write the updated content back to `plan.md`.

11. **Commit Plan Update:**
    - Stage the modified `plan.md` file.
    - Commit with a descriptive message (e.g., `conductor(plan): Mark task complete`).

### Phase Completion Protocol

**Trigger:** Executed immediately after completing the last task in a phase.

1. **Announce Protocol Start:** Inform the user that the phase is complete.

2. **Ensure Test Coverage for Phase Changes:**
   - Identify files changed in this phase
   - Verify corresponding test files exist
   - Create missing tests

3. **Execute Automated Tests:**
   ```bash
   CI=true npm test
   ```

4. **Propose Manual Verification Plan:**
   Generate step-by-step instructions for the user to verify the phase.

5. **Await User Feedback:**
   Ask: "Does this meet your expectations? Please confirm with yes or provide feedback."

6. **Create Checkpoint Commit:**
   ```bash
   git commit -m "conductor(checkpoint): Checkpoint end of Phase X"
   ```

7. **Attach Verification Report using Git Notes**

8. **Update Plan with Checkpoint SHA**

### Quality Gates

Before marking any task complete, verify:

- [ ] All tests pass
- [ ] Code coverage meets requirements (>80%)
- [ ] Code follows project's code style guidelines
- [ ] All public functions/methods are documented
- [ ] Type safety is enforced
- [ ] No linting or static analysis errors
- [ ] Works correctly on mobile (if applicable)
- [ ] Documentation updated if needed
- [ ] No security vulnerabilities introduced

## Development Commands

### Setup
```bash
npm install                    # Install dependencies
npm run build                  # Build TypeScript
```

### Daily Development
```bash
npm run dev                    # Start MCP server in dev mode
npm run watch                  # Watch for TypeScript changes
npm run inspect                # Debug with MCP Inspector
```

### Web Dashboard (when implemented)
```bash
npm run dev:web                # Start web dashboard
npm run build:web              # Build web for production
```

### Before Committing
```bash
npm run lint                   # Run linter
npm run typecheck              # Check types
npm test                       # Run all tests
```

## Commit Guidelines

### Message Format
```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks
- `conductor`: DevPattern-specific changes

### Scope Examples
- `mcp`: MCP server changes
- `web`: Web dashboard changes
- `api`: API server changes
- `export`: Export functionality
- `plan`: Plan/track updates

## Definition of Done

A task is complete when:

1. All code implemented to specification
2. Unit tests written and passing
3. Code coverage meets project requirements (>80%)
4. Documentation complete (if applicable)
5. Code passes all linting and type checks
6. Implementation notes added to `plan.md`
7. Changes committed with proper message
8. Git note with task summary attached

---

*Last updated: December 2025*
