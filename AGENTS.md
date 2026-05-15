# AGENTS.md

## Purpose
- This repository is a Vite + React single-page wedding invitation site.
- The UI is built in plain JSX with Tailwind CSS utility classes and a small amount of custom CSS.
- RSVP submissions go to Supabase when configured, otherwise they fall back to `localStorage`.
- Keep changes lightweight, visual quality high, and behavior safe for unauthenticated public visitors.

## Project Layout
- `src/main.jsx` mounts the React app and imports global styles.
- `src/App.jsx` contains the main page, most UI sections, local helpers, and RSVP form logic.
- `src/lib/supabase.js` encapsulates Supabase client setup and RSVP persistence.
- `src/index.css` contains Tailwind directives plus custom component and utility classes.
- `tailwind.config.js` defines the site design tokens, fonts, colors, shadows, and animations.
- `supabase/schema.sql` defines the `wedding_rsvp` table and insert policy.
- `scripts/deploy.sh` builds, commits, pushes, and triggers a Vercel production deploy.

## Agent Rules Sources
- No `.cursor/rules/` directory is present.
- No `.cursorrules` file is present.
- No `.github/copilot-instructions.md` file is present.
- Follow this file plus the existing repository conventions visible in source files.

## Environment
- Package manager in use: `npm`.
- Runtime/tooling: Vite 6, React 19, Tailwind CSS 3, Framer Motion, Lucide React.
- Node version is not pinned in the repo; use a modern Node 20+ environment if possible.
- Env vars are read through Vite `import.meta.env`.

## Setup Commands
- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Start preview server for built assets: `npm run preview`
- Start preview server on fixed port 4173: `npm run serve:dist`
- Create local env file from template: `cp .env.example .env`

## Build, Lint, and Test Commands
- Production build: `npm run build`
- Lint: no lint script or ESLint config exists today.
- Format: no formatter script or Prettier config exists today.
- Unit tests: no test runner is configured today.
- E2E tests: no browser test runner is configured today.
- Deployment helper: `npm run deploy -- "Commit message"`

## Single-Test Guidance
- There is currently no test framework or `npm test` script in this repository.
- There are no `*.test.*` or `*.spec.*` files checked in.
- Because no runner is configured, there is no supported command for running a single test.
- For now, the closest verification loop is:
- `npm run build`
- manual browser testing via `npm run dev`
- If a future PR adds Vitest, prefer commands like `npx vitest run path/to/test-file.test.jsx`.
- If a future PR adds Jest, prefer commands like `npx jest path/to/test-file.test.js`.

## Current Verification Expectations
- Run `npm run build` after meaningful code changes.
- For UI work, also open the site in the browser and check desktop and mobile layouts.
- For RSVP changes, test both configured and unconfigured Supabase paths when practical.
- If touching deploy behavior, read `scripts/deploy.sh` before changing release assumptions.

## Data and Environment Notes
- Required env vars for Supabase mode:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_ANON_KEY` is also accepted as a fallback key name.
- If env vars are missing, RSVP submissions intentionally fall back to `localStorage`.
- Do not hardcode secrets or project-specific credentials into source files.

## Style Overview
- Match the existing style before introducing new abstractions.
- Prefer small, direct changes over large architectural rewrites.
- Preserve the polished editorial wedding aesthetic already established in the UI.
- Keep public-facing copy consistent in tone and language with surrounding content.

## Imports
- Use ES modules only; the package uses `"type": "module"`.
- Group imports in this order when possible:
- React imports
- third-party library imports
- local module imports
- local asset and stylesheet imports
- Keep import specifiers alphabetized when it is easy to do so.
- Use relative imports for local modules; no path alias is configured.

## Formatting Conventions
- Follow the existing Prettier-like formatting already present in `src/App.jsx`.
- Use 2-space indentation.
- Use double quotes, not single quotes.
- Keep semicolons enabled.
- Use trailing commas where multiline formatting introduces them.
- Prefer multiline wrapping instead of long dense one-line JSX expressions.
- Keep object literals and arrays vertically formatted when they become visually dense.

## React Conventions
- Use function components, not class components.
- Prefer hooks and local helpers over component inheritance.
- Keep simple section-specific helpers in the same file when they are not reused elsewhere.
- Extract a component only when reuse or readability clearly improves.
- Use controlled form inputs for user-entered data.
- Use `useMemo` and `useEffect` only when they provide actual value; do not overuse them.

## JSX and UI Patterns
- Prefer clear section boundaries and descriptive constants for content-heavy pages.
- Reuse existing visual primitives such as `Field`, `DetailRow`, and decorative SVG helpers when appropriate.
- Maintain accessibility basics: semantic elements, useful `alt` text, button labels, and alert roles.
- Keep motion tasteful and consistent with current Framer Motion usage.
- Respect mobile-first responsiveness; most layout classes are written from small to large breakpoints.

## Tailwind and CSS
- Prefer Tailwind utilities for layout, spacing, sizing, and most visual styling.
- Use `src/index.css` for shared component classes, utility classes, or global tokens.
- Reuse theme tokens from `tailwind.config.js` instead of introducing ad hoc colors.
- Favor the existing `champagne`, `ivory`, `blush`, and `ink` palette.
- Reuse existing font families: `display`, `serif`, and `sans`.
- Keep custom CSS minimal and purposeful.

## Types and Data Shapes
- The codebase is JavaScript, not TypeScript.
- Write code that is type-conscious even without static typing.
- Preserve current RSVP payload keys: `name`, `phone`, `attendance`, `guests`, `message`.
- Keep `attendance` values aligned with the database constraint: `attend` or `absent`.
- When adding new fields, update UI, persistence logic, and `supabase/schema.sql` together.

## Naming Conventions
- Use `PascalCase` for React components.
- Use `camelCase` for variables, functions, hooks, and non-component helpers.
- Use `UPPER_SNAKE_CASE` for top-level constants that represent fixed content or config.
- Choose descriptive names over short abbreviations, except for common UI terms like `bgm`.
- Keep naming consistent with nearby code instead of mixing styles.

## Error Handling
- Fail gracefully in user-facing flows.
- Convert raw backend errors into friendly messages before showing them in the UI.
- Guard against missing browser APIs or missing DOM nodes when relevant.
- Use early returns to keep handlers easy to read.
- Throw or rethrow errors only when the caller can handle them meaningfully.
- Avoid swallowing unexpected errors silently; log when useful for debugging.

## Async and Network Behavior
- Keep async flows explicit with `async`/`await`.
- Wrap network writes in `try`/`catch` and always clear loading state in `finally`.
- Avoid duplicate client initialization; follow the cached client pattern in `src/lib/supabase.js`.
- Treat anonymous public writes carefully and preserve the current RLS assumptions.

## Database and Supabase Notes
- The public table is `public.wedding_rsvp`.
- RLS is enabled and an insert policy for `anon` already exists in `supabase/schema.sql`.
- Do not change schema or policy names casually; coordinate UI and database updates.
- If Supabase is unavailable, preserve the existing local fallback unless the task explicitly changes product behavior.

## Git and Deployment Notes
- `npm run deploy` is not a harmless preview command.
- It runs a build, commits all local changes, pushes the current branch, and deploys to Vercel production.
- Do not invoke the deploy script unless the user explicitly wants deployment behavior.
- Be careful not to commit unrelated work if asked to modify deployment automation.

## When Editing This Repo
- Check whether a requested change belongs in `src/App.jsx` versus shared styling files.
- Keep the page visually intentional; do not flatten the existing art direction into generic components.
- Preserve Chinese copy, wedding details, and venue/date data unless the task requires changing them.
- When adding logic, keep the happy path simple and the fallback path explicit.
- Prefer verifying with `npm run build` before finishing.

## Suggested Agent Workflow
- Read `package.json`, `src/App.jsx`, and any touched support files before editing.
- Make the smallest coherent change that solves the request.
- Run `npm run build` for verification whenever code changes could affect runtime behavior.
- Report clearly when linting or automated tests are unavailable instead of implying they passed.

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>algorithmic-art</name>
<description>Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating art using code, generative art, algorithmic art, flow fields, or particle systems. Create original algorithmic art rather than copying existing artists' work to avoid copyright violations.</description>
<location>project</location>
</skill>

<skill>
<name>brand-guidelines</name>
<description>Applies Anthropic's official brand colors and typography to any sort of artifact that may benefit from having Anthropic's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.</description>
<location>project</location>
</skill>

<skill>
<name>canvas-design</name>
<description>Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists' work to avoid copyright violations.</description>
<location>project</location>
</skill>

<skill>
<name>claude-api</name>
<description>"Build, debug, and optimize Claude API / Anthropic SDK apps. Apps built with this skill should include prompt caching. Also handles migrating existing Claude API code between Claude model versions (4.5 → 4.6, 4.6 → 4.7, retired-model replacements). TRIGGER when: code imports `anthropic`/`@anthropic-ai/sdk`; user asks for the Claude API, Anthropic SDK, or Managed Agents; user adds/modifies/tunes a Claude feature (caching, thinking, compaction, tool use, batch, files, citations, memory) or model (Opus/Sonnet/Haiku) in a file; questions about prompt caching / cache hit rate in an Anthropic SDK project. SKIP: file imports `openai`/other-provider SDK, filename like `*-openai.py`/`*-generic.py`, provider-neutral code, general programming/ML."</description>
<location>project</location>
</skill>

<skill>
<name>doc-coauthoring</name>
<description>Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar structured content. This workflow helps users efficiently transfer context, refine content through iteration, and verify the doc works for readers. Trigger when user mentions writing docs, creating proposals, drafting specs, or similar documentation tasks.</description>
<location>project</location>
</skill>

<skill>
<name>docx</name>
<description>"Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files). Triggers include: any mention of 'Word doc', 'word document', '.docx', or requests to produce professional documents with formatting like tables of contents, headings, page numbers, or letterheads. Also use when extracting or reorganizing content from .docx files, inserting or replacing images in documents, performing find-and-replace in Word files, working with tracked changes or comments, or converting content into a polished Word document. If the user asks for a 'report', 'memo', 'letter', 'template', or similar deliverable as a Word or .docx file, use this skill. Do NOT use for PDFs, spreadsheets, Google Docs, or general coding tasks unrelated to document generation."</description>
<location>project</location>
</skill>

<skill>
<name>frontend-design</name>
<description>Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.</description>
<location>project</location>
</skill>

<skill>
<name>internal-comms</name>
<description>A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill whenever asked to write some sort of internal communications (status reports, leadership updates, 3P updates, company newsletters, FAQs, incident reports, project updates, etc.).</description>
<location>project</location>
</skill>

<skill>
<name>mcp-builder</name>
<description>Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating new PDFs, filling PDF forms, encrypting/decrypting PDFs, extracting images, and OCR on scanned PDFs to make them searchable. If the user mentions a .pdf file or asks to produce one, use this skill.</description>
<location>project</location>
</skill>

<skill>
<name>pptx</name>
<description>"Use this skill any time a .pptx file is involved in any way — as input, output, or both. This includes: creating slide decks, pitch decks, or presentations; reading, parsing, or extracting text from any .pptx file (even if the extracted content will be used elsewhere, like in an email or summary); editing, modifying, or updating existing presentations; combining or splitting slide files; working with templates, layouts, speaker notes, or comments. Trigger whenever the user mentions \"deck,\" \"slides,\" \"presentation,\" or references a .pptx filename, regardless of what they plan to do with the content afterward. If a .pptx file needs to be opened, created, or touched, use this skill."</description>
<location>project</location>
</skill>

<skill>
<name>skill-creator</name>
<description>Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.</description>
<location>project</location>
</skill>

<skill>
<name>slack-gif-creator</name>
<description>Knowledge and utilities for creating animated GIFs optimized for Slack. Provides constraints, validation tools, and animation concepts. Use when users request animated GIFs for Slack like "make me a GIF of X doing Y for Slack."</description>
<location>project</location>
</skill>

<skill>
<name>template</name>
<description>Replace with description of the skill and when Claude should use it.</description>
<location>project</location>
</skill>

<skill>
<name>theme-factory</name>
<description>Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.</description>
<location>project</location>
</skill>

<skill>
<name>web-artifacts-builder</name>
<description>Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.</description>
<location>project</location>
</skill>

<skill>
<name>webapp-testing</name>
<description>Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.</description>
<location>project</location>
</skill>

<skill>
<name>xlsx</name>
<description>"Use this skill any time a spreadsheet file is the primary input or output. This means any task where the user wants to: open, read, edit, or fix an existing .xlsx, .xlsm, .csv, or .tsv file (e.g., adding columns, computing formulas, formatting, charting, cleaning messy data); create a new spreadsheet from scratch or from other data sources; or convert between tabular file formats. Trigger especially when the user references a spreadsheet file by name or path — even casually (like \"the xlsx in my downloads\") — and wants something done to it or produced from it. Also trigger for cleaning or restructuring messy tabular data files (malformed rows, misplaced headers, junk data) into proper spreadsheets. The deliverable must be a spreadsheet file. Do NOT trigger when the primary deliverable is a Word document, HTML report, standalone Python script, database pipeline, or Google Sheets API integration, even if tabular data is involved."</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
