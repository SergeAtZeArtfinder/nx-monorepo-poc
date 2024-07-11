# NxMonorepoPolygon

### Initial install

1. `npx create-nx-workspace@latest --preset=next --packageManager=yarn --defaultBase=main`

✔ Where would you like to create your workspace? · my-project-name
✔ Application name · my-next-app-name
✔ Would you like to use the App Router (recommended)? · Yes
✔ Would you like to use the src/ directory? · Yes
✔ Test runner to use for end to end (E2E) tests · cypress
✔ Default stylesheet format · css
✔ Do you want Nx Cloud to make your CI fast? · github

### TailwindCSS

1. Install and configure Tailwind in an Nx workspace
   `yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest`
2. Go to our Next.js application dir

- `cd apps/nx-react-monorepo/`
- `npx tailwindcss init -p`

That should generate both of the configuration files directly into the root of our Next.js application.

3. Make sure you adjust our `postcss.config.js` to properly point to our tailwind config file.

```js
// apps/nx-react-monorepo/postcss.config.js
const { join } = require('path');

module.exports = {
  plugins: {
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
```

4. Update config `tailwind.config.js`

```js
// apps/nx-react-monorepo/tailwind.config.js
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    extend: {
      gridTemplateColumns: {
        gallery: 'repeat(auto-fit, minmax(250px, 1fr))',
        pages: 'repeat(auto-fit, minmax(350px, 1fr))',
      },
      fontFamily: {
        arOneSans: ['var(--font-ar-one-sans)', 'sans-serif'],
        albertSans: ['var(--font-albert-sans)', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.5rem', '0.75rem'],
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
};
```

5. update `styles.css` as per tw docs.

### How do we handle Tailwind config files in a monorepo at root level

So far we’ve placed the Tailwind config within our application directory `apps/nx-react-monorepo`. That makes sense as the app probably knows the Tailwind configs to be designed properly. However, you might also want some more global, cross-app configs.
To have a global Nx workspace-wide config we can leverage [Tailwind presets](https://tailwindcss.com/docs/presets). At the Nx workspace root we define a `tailwind-workspace-preset.js`.

example: Let’s add the Tailwind Typography package: `yarn add -D @tailwindcss/typography`;
Next, we add it to our monorepo rootDir - `tailwind-workspace-preset.js`

```js
// tailwind-workspace-preset.js
module.exports = {
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
```

- In order to use the Tailwind preset in our `apps/nx-react-monorepo` specific Tailwind config, we require the file and add it to the presets array of the config.

```js
// apps/nx-react-monorepo/tailwind.config.js

module.exports = {
  presets: [require('../../tailwind-workspace-preset.js')],
  ...
};
```

### Troubleshoot

1. always before commit run

- $ `nx format:write`
- $ `nx affected -t lint test build e2e-ci`

it may show occasionally the failure related to such directories as

- `.nx` => if so run `nx reset` it will flush the old cached files
- `/apps/nx-react-monorepo/.next/...` or `/apps/nx-react-monorepo/out/...` - delete these directories and re-run the tests.

### Setup Testing with Vite

1. remove all jest related packages
2. $ `nx add @nx/vite`
3. $ `npx nx g @nx/vite:vitest --project=fe --testEnvironment=jsdom --uiFramework=react`
4. Install testing dependencies for React, Vite and Canvas

- $ `yarn add -D @testing-library/react @testing-library/jest-dom @vitejs/plugin-react vite-tsconfig-paths vitest-canvas-mock`

That's a lot of dependencies 😄 , so let's break them down:

- `"@testing-library/react"`: A library for testing React components. It provides utilities to simulate user interactions and query elements in a way that's more aligned with how users interact with your app.

- `"@testing-library/jest-dom"`: A set of custom matchers that makes it easier to assert how your components should behave in the DOM.

- `"@vitejs/plugin-react"`: The official Vite plugin to support React. This plugin enables features like Fast Refresh in a Vite + React development setup.

- `"vite-tsconfig-paths"`: A Vite plugin that enables support for TypeScript's paths and baseUrl configuration options. This is useful when you want to set up custom path aliases in a TypeScript project using Vite.

- `"vitest-canvas-mock"`: Mocks the canvas API when running unit tests with vitest.

5. Add a test setup file

```ts
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
// Option for using mocking canvas testing
import 'vitest-canvas-mock';

expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Add Default Functions, for example providers as here:
// https://testing-library.com/docs/react-testing-library/setup/#custom-render

/* eslint-disable @typescript-eslint/no-empty-function */
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
```

6. Update Vite Config to support test setup and reference libraries in MonoRepo

```ts
/// <reference types='vitest' />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/nx-react-monorepo',

  plugins: [react(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    root: __dirname,
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    deps: {
      // Required for vitest-canvas-mock
      inline: ['vitest-canvas-mock'],
    },
    setupFiles: ['./test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/nx-react-monorepo',
      provider: 'v8',
    },
  },
});
```

7. make sure the project.json config reflects the test command:

```json
{
  "name": "nx-react-monorepo",
  // ...
  "targets": {
    "test": {
      "executor": "@nx/vite:test",
      "options": {
        "config": "apps/nx-react-monorepo/vitest.config.ts"
      },
      "configurations": {
        "watch": {
          "watch": true
        }
      }
    }
  }
}
```

8. then you can write unit tests in `nx-react-monorepo/__tests/` directory
9. $ `nx test nx-react-monorepo`

docs:

- https://vitest.dev/guide/migration#migrating-from-jest
- https://vitest.dev/config/#globals

### E2E Cypress

- runs well locally in both dev/prod modes.
- Important to note: in CI pipeline run by gh actions, it randomly fails with visiting the page url, (see below)
  so far - the only remedy found is to clear cache and re-run the gh workflow jobs
- It may worth to consider to run clear cache job prior the workflow; to specify in CI `.yaml`

```yaml
  Running:  app.cy.ts                                                                       (1 of 1)


  my-happy-bunch-e2e
    1) "before each" hook for "should display welcome message"


  0 passing (279ms)
  1 failing

  1) my-happy-bunch-e2e
       "before each" hook for "should display welcome message":
     CypressError: `cy.visit()` failed trying to load:

http://localhost:3000/

The response we received from your web server was:

  > 404: Not Found

This was considered a failure because the status code was not `2xx`.
```

- Ref. above. There is a possible fix to that CI failure by changing:
  `yarn nx affected -t lint test build e2e-ci` to `yarn nx affected -t lint test build e2e`, because it seems that the
  command `e2e-ci` fails to start-up the application build version, so when the cy test tries to visit the page it doesn't find it.
  with the `yarn nx affected -t lint test build e2e` the CI pipeline runs ok.

```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:

permissions:
  actions: read
  contents: read

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - uses: nrwl/nx-set-shas@v4

      - run: yarn nx-cloud record -- nx format:check
      - run: yarn nx affected -t lint test build e2e
```

- still workflow fails at random

### Components library

To add react components library

1. $ `nx g @nx/next:lib --directory=libs/ui-components`
   choose name `"components"` for example ( keep in mind this chosen name u're going to use to run the tests)
   choose plain CSS as styling
2. add testing with vitest

- `libs/ui-components/vite.config.ts`, `libs/ui-components/test-setup.ts`, update the directory paths for caching and coverage reports to reflect the `libs/ui-components`, if you're copying these from `apps/nx-react-monorepo`
- `libs/ui-components/test-setup.ts`
- then `project.json` to update the targets prop

```json
 // ...
 "targets": {
    "test": {
      "executor": "@nx/vite:test",
      "options": {
        "config": "libs/ui-components/vite.config.ts"
      },
      "configurations": {
        "watch": {
          "watch": true
        }
      }
    }
  }
```

- components library extend ts config, to include ts files in `__tests__` directory
  `libs/ui-components/tsconfig.lib.json`

```json
{
  // ...
  "include": ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx", "__tests__/**/*.tsx", "__tests__/**/*.ts"]
}
```

- run $`nx test components`

### Setup ChadCN library

Need to follow the manual installation described here [chadCN manual install docs](https://ui.shadcn.com/docs/installation/manual)
with some additional tweaks

#### let us imagine this is our monorepo file structure:

```yaml
# other stuff...

- apps/
  - nx-react-monorepo/

- libs/
  - ui-components/
# other stuff...
```

1. add components library `nx g @nx/next:library ui-components`
2. go to this new `libs/ui-components` directory and delete `lib/` directory, and `server.ts` file
3. go to monorepo root dir and install packages:
   `yarn add clsx @radix-ui/react-icons && yarn add -D tailwindcss-animate class-variance-authority tailwind-merge`
4. in monorepo root dir, create tailwind preset file `tailwind-workspace-preset.js`, and add the chadCN settings that could be shared across the projects ( setting are from the [chadCN manual install docs](https://ui.shadcn.com/docs/installation/manual) )

```js
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

5. go to both projects and update the local `tailwind.config.js` file to have the preset:

```js
// apps/nx-react-monorepo/tailwind.config.js
// libs/ui-components/tailwind.config.js

module.exports = {
  presets: [require('../../tailwind-workspace-preset.js')],
  ...
};
```

6. go to your UI consumer application `apps/nx-react-monorepo`, and extend the CSS file to accommodate all these
   styles from chadCN:

`apps/nx-react-monorepo/src/styles/global.css`

<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer base {
      :root {
        --background: 0 0% 100%;
        --foreground: 222.2 47.4% 11.2%;
       /* ... rest */
      }

      .dark {
        --background: 224 71% 4%;
        --foreground: 213 31% 91%;

       /* ... rest */
      }
    }

    @layer base {
      * {
        @apply border-border;
      }
      body {
        @apply bg-background text-foreground;
        font-feature-settings: 'rlig' 1, 'calt' 1;
      }
    }
</style>

7. Add to `libs/ui-components/src/utils.ts`

```js
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

8. Go to monorepo root dir and ( stupid as it is 😄 ), you need to add `tsconfig.json`
   that is necessary for for shadcn cli to pick it up, unfortunately it doesn't read our `tsconfig.base.json`
   `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@my-project/ui-components": ["libs/ui-components/src/index.ts"],
      "@my-project/ui-components/*": ["libs/ui-components/src/*"]
    }
  }
}
```

9. In same monorepo root, create the `components.json`, and add:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tailwind": {
    "config": "apps/web/tailwind.config.js",
    "css": "apps/web/app/global.css",
    "baseColor": "stone",
    "cssVariables": true
  },
  "aliases": {
    "components": "@my-project/ui-components/components",
    "utils": "@my-project/ui-components/utils"
  }
}
```

10. It is set, now in monorepo root directory, run:

`npx shadcn-ui@latest add button`

- it will add `libs/ui-components/src/components/ui/` directory with `button.tsx` file
- go to `libs/ui-components/src/components/ui/button.tsx` and update the import utils
  to `import { cn } from '../../utils';` - still need to tweak this import each time you add a shadcn component,
  later you can move this into libs/utils library, then update utils alias in `components.json`
- when you generate the `npx shadcn-ui@latest add...` don't forget to add `'use client'` into the component, if not the next build will fail.;

##### 😜 it is pretty much set:

- the shadcn components will be in `libs/ui-components/src/components/ui/`,
- all components are barrel exported from `libs/ui-components/src/index.ts`
- unit tests for lib components are in `libs/ui-components/__tests__/` directory,
  😜 keep in mind shadcn components don't need to test, if not updated, just test your own code.

### Generate a utils library

Here is the funny part if I generate a library using either `@nx:node` or `@nx:js` - it does generate ok, BUT when I import these
modules into my next.js application AND try to build - the build fails with weird errors `"Error occurred pre-rendering page"`.

- so the only way I have managed to have a workable and importable utils library is to generate it with `@nx:next`

1. `nx g @nx/next:lib utils --directory=libs/utils`
2. then replace the `.tsx` modules by `.ts`

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

## Integrate with editors

Enhance your Nx experience by installing [Nx Console](https://nx.dev/nx-console) for your favourite editor. Nx Console
provides an interactive UI to view your projects, run tasks, generate code, and more! Available for VSCode, IntelliJ and
comes with a LSP for Vim users.

## Start the application

Run `npx nx dev fe` to start the development server. Happy coding!

## Build for production

Run `npx nx build fe` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
