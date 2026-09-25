# Dashboard Starter

Angular 22 application with Angular Material.

## Adding a page

Each page lives in its own folder under `src/features/` and is lazy-loaded, so its code only downloads when someone opens it. Example for a "Reports" page:

1. **Create the component:**

   ```bash
   ng g c reports --path src/features
   ```

   This creates `src/features/reports/` with `reports.ts`, `.html`, `.scss` and `.spec.ts`. Without the Angular CLI installed globally, use `npx ng g c …`.

2. **Add a route** in `src/app/app.routes.ts`:

   ```ts
   export const routes: Routes = [
     {
       path: 'reports',
       title: 'Reports', // browser tab title
       loadComponent: () => import('../features/reports/reports').then((m) => m.Reports),
     },
   ];
   ```

   `loadComponent` with `import()` makes the page **lazy-loaded**: the build puts it in its own file, which the browser downloads only when the page is first opened. This keeps the initial download small as pages are added. Don't import the component at the top of the file and use `component: Reports` instead, as that bundles it into the initial download.

3. **Add it to the sidenav** in the `navItems` array in `src/core/layout/sidenav/sidenav.ts`:

   ```ts
   { label: 'Reports', icon: 'bar_chart', route: '/reports' },
   ```

   `icon` is a Material Symbols name. Browse them at [fonts.google.com/icons](https://fonts.google.com/icons) and use the name shown there in lowercase, e.g. `bar_chart`.

`route` must match the route's `path` with a leading `/`. The link is highlighted when that page is open.

### Good to know

- **Home has no page yet.** Its nav link goes to `/`, but no route has `path: ''`, so the content area is empty. Add one with the steps above.
- **Links only highlight on an exact URL match.** A page with sub-pages, e.g. `/reports/123`, won't keep "Reports" highlighted. To change that, edit `[routerLinkActiveOptions]` in `sidenav.html`.

## Not Included But Nice To Have

1. A loading/spinner interceptor that tracks in-flight requests globally.
2. A user-facing notification service so errors surface consistently rather than through ad hoc alert() calls.
3. Error handling
   - httpErrorInterceptor handles failed API calls. It turns them into an ApiError, shows one clear notification (including the reference id for server errors), and re-throws so the calling code can still react.
   - GlobalErrorHandler handles everything else: template errors, bugs in effects, unhandled promises. It logs the error and shows a generic message, and skips errors layer 1 already reported, so you never get two messages for one failure.

## Code quality: ESLint, Prettier, Husky and lint-staged

| Tool        | Job                                                       | Changes files?       |
| ----------- | --------------------------------------------------------- | -------------------- |
| Prettier    | Formats code (`.prettierrc`)                              | Yes, formatting only |
| ESLint      | Reports likely bugs in `.ts` files (`eslint.config.js`)   | No, report only      |
| Husky       | Runs `.husky/pre-commit` on every `git commit`            | No                   |
| lint-staged | Runs the checks on staged files (`lint-staged.config.js`) | No                   |

Husky is installed automatically by `npm install` (via the `prepare` script).

### What happens on `git commit`

If any `.ts` or `.html` file is staged, these run in order and the first failure stops the commit:

1. **Prettier** formats the staged `.ts` / `.html` files. The formatted version is committed.
2. **ESLint** checks the staged `.ts` files (including `*.spec.ts`).
3. **Type check (app)**: `ngc -p tsconfig.app.json --noEmit` checks the whole app, including component templates.
4. **Type check (tests)**: `tsc -p tsconfig.spec.json --noEmit` checks the spec files.

If only `.scss`, `.css`, `.json` or `.md` files are staged, only Prettier runs. Other file types are not checked.

If a step fails, the commit is cancelled, the errors are printed and your files are restored exactly as they were. Fix the errors, `git add` and commit again.

### ESLint rules

Only the JavaScript and TypeScript recommended rule sets are used, plus `no-unreachable`. They are aimed at real bugs, not style. Every rule is an error, so any problem blocks the commit. Examples:

- unused variables, imports, parameters and `catch` variables (`_` prefix does not exempt)
- any use of `any` (use `unknown` or a real type)
- unreachable code after `return`, `throw`, `break` or `continue`
- `let` that is never reassigned (`prefer-const`)

Not checked: code style beyond Prettier formatting, Angular best practices, template accessibility.

### Ignoring a rule

Put a comment on the line above. Always name the rule (it is shown in the commit error). A bare `eslint-disable-next-line` turns off every rule for that line.

- These comments only silence ESLint, not the type check. For a TypeScript error use `// @ts-expect-error <reason>` on the line above. `// @ts-ignore` is blocked by ESLint.
- If a disable comment is no longer needed, ESLint shows a warning. It does not block the commit, but `npm run lint` shows it so you can remove it.

### Good to know

- The type check covers the **whole project as it is on disk**, not just staged files. A broken unstaged or untracked `.ts` file will still block the commit.
- Tests do not run on commit. Run `npm test` yourself.
- Warnings are not shown on commit (lint-staged only prints failing output). There are currently no warning-level rules.
- `git commit --no-verify` skips the hook for one commit. Use sparingly.
