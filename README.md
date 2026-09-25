# Dashboard

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
