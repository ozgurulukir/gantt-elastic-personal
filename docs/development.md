# Development and Cypress

This page documents the build and end-to-end workflow declared by the repository's package scripts, webpack
configurations, and Cypress configuration. Return to the [README](../README.md) for installation and usage.

## Environment

The package does not declare a supported Node.js or npm version range.

TODO: Maintainers should set the supported Node.js and npm versions in `package.json` before documenting a version
requirement here.

## Install and build

Install dependencies and build the distribution bundles:

```bash
npm install
npm run build
```

`npm run build` runs the production webpack configurations and writes bundles to `dist/`. `npm run dev` starts a webpack
watch build using `webpack.dev.js`.

## Run the end-to-end suite

The Cypress pages load bundles from `dist/`, so build first. The suite also needs the repository root served over HTTP
and a matching `baseUrl`. Run the server in one terminal:

```bash
npx http-server -p 8085 -c-1 .
```

Then run Cypress in another terminal:

```bash
npx cypress run --browser chrome --config baseUrl=http://localhost:8085
```

For interactive mode, use:

```bash
npx cypress open --config baseUrl=http://localhost:8085
```

The `npm test` script calls Cypress without starting a server or setting `baseUrl`; use the explicit commands above for
the configured end-to-end run. Cypress is configured to discover specs under `tests/integration/`.

Related: [Contributing](../CONTRIBUTING.md), [documentation index](index.md), [README](../README.md).
