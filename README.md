# Sample Turborepo

This repository is a small **Turborepo** managed with **pnpm workspaces**.

pnpm handles workspace package discovery and local linking. Turbo runs tasks
across those packages, understands the dependency graph, and caches build
outputs so repeated commands stay fast.

## Why Turbo Instead of Only npm Workspaces?

Turbo and npm workspaces solve different parts of the monorepo problem.

**npm workspaces** are mainly a package management feature. They let one root
project install dependencies for many packages, link local packages together,
and run scripts across workspaces.

**Turborepo** is a task runner and build system for monorepos. It sits on top of
a workspace manager such as npm, pnpm, or Yarn and decides how tasks like
`build`, `dev`, `lint`, or `test` should run across packages.

Use Turbo when the monorepo needs:

- Dependency-aware task ordering, such as building `@local/utils` before apps
  that depend on it.
- Local and remote caching, so unchanged packages do not rebuild every time.
- Faster CI pipelines by skipping work that has already been computed.
- A clear task pipeline in `turbo.json` instead of many custom shell scripts.
- Better scaling as the number of apps and packages grows.
- Consistent commands for developers, such as `pnpm build` and `pnpm dev`,
  while Turbo handles orchestration behind the scenes.

Using only npm workspaces can be enough when:

- The repo has only a few packages.
- Builds are fast enough that caching is not important.
- There are few cross-package dependencies.
- The team only needs dependency installation and simple script execution.

In short: workspaces organize and link packages; Turbo coordinates, orders, and
caches work across those packages. For this repo, Turbo is useful because the
React app, Next.js app, Express server, and shared utility package are developed
together and can benefit from dependency-aware builds and cached outputs.

## What Is in This Repo?

This monorepo contains multiple related apps and one shared package:

- `apps/client` - React + Vite frontend app
- `apps/blog` - Next.js blog app
- `apps/server` - Express API server
- `packages/utils` - shared TypeScript utility package

The apps use the shared package through this workspace dependency:

```json
"@local/utils": "workspace:*"
```

That tells pnpm to link the local `packages/utils` package directly into each
app instead of downloading it from npm.

## Project Structure

```text
sample-turborepo/
├── apps/
│   ├── blog/          # Next.js app
│   ├── client/        # React + Vite app
│   └── server/        # Express API server
├── packages/
│   └── utils/         # Shared TypeScript utilities
├── package.json       # Root scripts, package manager, and Turbo dependency
├── pnpm-lock.yaml     # Locked dependency versions
├── pnpm-workspace.yaml
└── turbo.json         # Turbo task pipeline
```

## Workspace Configuration

Workspace packages are discovered by `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Any folder under `apps/` or `packages/` that contains a `package.json` becomes
part of the workspace.

The root `package.json` uses Turbo for the main commands:

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build"
  },
  "devDependencies": {
    "turbo": "^2.9.15"
  }
}
```

## Turbo Pipeline

Turbo is configured in `turbo.json`:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    }
  }
}
```

Key behavior:

- `build` runs dependency builds first, so `@local/utils` is built before apps
  that depend on it.
- `build` caches app and package outputs from `.next/**` and `dist/**`.
- `dev` is persistent and uncached because development servers keep running.
- `check-types` is ready for packages that add a matching script.

## Prerequisites

Install:

- Node.js
- pnpm

This repo declares pnpm as its package manager:

```json
"packageManager": "pnpm@11.4.0"
```

If you use Corepack, enable pnpm with:

```bash
corepack enable
corepack prepare pnpm@11.4.0 --activate
```

## Setup

Install all dependencies from the root:

```bash
pnpm install
```

This installs dependencies for every workspace package and links local
workspace dependencies such as `@local/utils`.

## Run the Apps

Run every workspace development server through Turbo:

```bash
pnpm dev
```

This runs `turbo dev`, which starts each workspace package that has a `dev`
script.

Run one app at a time with Turbo filters:

```bash
pnpm turbo dev --filter=client
pnpm turbo dev --filter=blog
pnpm turbo dev --filter=server
```

You can also run workspace scripts directly with pnpm filters:

```bash
pnpm --filter client dev
pnpm --filter blog dev
pnpm --filter server dev
```

The Express server uses port `3001` by default and exposes:

```text
GET /
GET /rates/today
```

## Build

Build every package and app through Turbo:

```bash
pnpm build
```

This runs `turbo build`, which follows the workspace dependency graph and
caches configured outputs.

Build a specific workspace:

```bash
pnpm turbo build --filter=@local/utils
pnpm turbo build --filter=client
pnpm turbo build --filter=blog
pnpm turbo build --filter=server
```

## Available Workspaces

| Workspace | Purpose | Main scripts |
| --- | --- | --- |
| `client` | React + Vite frontend | `dev`, `build`, `lint`, `preview` |
| `blog` | Next.js blog app | `dev`, `build`, `start`, `lint` |
| `server` | Express API server | `dev`, `build`, `start` |
| `@local/utils` | Shared TypeScript utilities | `build`, `clean` |

## Shared Utilities

`@local/utils` currently provides currency formatting and timezone date/time
helpers. The React client, Next.js blog, and Express server all import from the
same package.

Example:

```ts
import { formatCurrencyFromInr } from '@local/utils'

const price = formatCurrencyFromInr(98750, 'INR')
```

## Add a New App or Package

To add a new app, create it inside `apps/`:

```text
apps/admin
```

To add a new shared package, create it inside `packages/`:

```text
packages/ui
```

Once the new folder contains a `package.json`, pnpm will include it in the
workspace. Add `dev`, `build`, or other scripts as needed so Turbo can run them.
