## Setup

Install latest LTS `node.js` (16.X).

This project uses [corepack](https://nodejs.org/api/corepack.html).
You can enable it by running `corepack enable`.

Install pnpm by running `corepack prepare` in the root of the repository.

Then install dependencies by running `pnpm install` in the root of the repository.

## Building

Build the library (files under `./src`):

```
pnpm run build
```

Build and watch for changes on the test web app (builds files under `./app`):

```
pnpm run dev
```

Run vitest tests (any file ending in `.test.{ts,tsx}`):

```
pnpm run test
```

Run playwright tests against the test app (files under `./test`):

```
pnpm run test:pw
```
