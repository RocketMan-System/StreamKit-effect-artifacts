# StreamKit Effect Template

This repository is a template for creating a custom screen effect for the RocketMan StreamKit application. The built output is loaded by the main application into an iframe when the effect is triggered.

Key files

- [`manifest.json`](manifest.json:1) — main configuration file for the extension. See the example in the repository.
- [`logo.svg`](logo.svg:1) — recommended logo for the effect (SVG preferred). A PNG may be used instead if needed.
- [`public/index.html`](public/index.html:1) — HTML entry that becomes the iframe content.
- [`src/App.tsx`](src/App.tsx:1) — React application entry.
- [`webpack.config.js`](webpack.config.js:1) — build configuration used to produce the bundled assets.

Overview

This template produces a self-contained web bundle (HTML + JS + assets). When packaged and installed into RocketMan StreamKit, the app will load the built `index.html` inside an iframe. The host application communicates with the effect using the declared permissions and a well-known data contract.

Manifest configuration

The [`manifest.json`](manifest.json:1) file contains the effect metadata and runtime settings. Important fields:

- name: localized names for the effect
- author, version
- type: should be "effect" or "screamer"
- permissions: permission flags the effect requires (for example `effectData`)
- settings: default parameters such as `maxSeconds`, `volume`, `defaultSeconds` and other behaviour tuning values

Example (from this template):

```JSON
{
  "name": { "en": "StreamKit Effect Template" },
  "author": "RocketMan",
  "version": "1.0.0",
  "type": "effect",
  "permissions": ["effectData"],
  "settings": {
    "maxSeconds": 120,
    "volume": 70,
    "defaultSeconds": 30
  }
}
```

Iframe and runtime behaviour

- The built `index.html` will be loaded in an iframe inside the host application. Keep the bundle isolated (use relative paths, avoid assuming global variables from the host).
- The host may pass effect data via a structured message or through an API exposed to the iframe. The template includes modules that demonstrate connecting to SSE and token/cookie helpers in [`src/modules/`](src/modules:1).
- Respect `maxSeconds` and other timing-related settings from the manifest — the host may expect the effect to stop or report state when time limits are reached.

Assets and logo

Place a logo named [`logo.svg`](logo.svg:1) (recommended) or `logo.png` at the project root. This file is referenced by installers or the host UI to display the effect icon.

Development

1. Install dependencies

   npm install

2. Run a development build / watcher (project is configured with webpack)

   npm run dev

3. Build production bundle

   npm run build

The resulting files will be output into the `dist/` folder and can be packaged with the `manifest.json` and `logo.svg`.

Code structure and notes

- UI: [`src/App.tsx`](src/App.tsx:1) and styles in [`src/styles/index.less`](src/styles/index.less:1).
- Modules: SSE, token and API helpers are located at [`src/modules/`](src/modules:1). These modules show common integration patterns — adapt them to your host's contract.
- Entry: [`src/index.tsx`](src/index.tsx:1) mounts the React app into the HTML entry.

Packaging and release

To publish an effect, package the following into a zip (or format required by RocketMan StreamKit):

- `manifest.json` (must be present and valid)
- `index.html` and built JS/CSS (from `dist/`)
- `logo.svg` (or `logo.png`)

Follow the host application's release process (CI workflow exists in `.github/workflows/build-and-release.yml` for examples).

Security and best practices

- Do not include sensitive secrets in the bundle.
- Limit requested permissions in `manifest.json` to only those the effect needs.
- Validate and sanitize any data received from the host before using it in the DOM.


License & Author

Author: RocketMan

This template is provided as-is. Adapt the manifest and code to fit your effect's behavior.
