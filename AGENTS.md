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
