# vite-plugin-shadow-on-dev

A vite plugin for shadowing folders and files (in folder) in dev mode to the specified output directory.

## Example

```
// vite.config.js
import { defineConfig } from "vite";
import syncFolderDev from "vite-plugin-sync-folder-dev";

export default defineConfig({
    plugins: [
        syncFolderDev({
        src: "public",
        dest: "../assets/public/",
        }),
    ],
    root: "_assets",
});

```

## Options

| | type | default | description
| src | string | | relative path (to root) of source folder |
| dest | string | | relative path (to root) of destination folder |
| log | boolean | false | if page reloads should be logged |
| root | string | ViteDevServer.root | relative path to projekt |

## Motivation

In the beginning was the problem with the inconsisting links between the dev and build due to a php backend.
This plugin shadows a folder with e.g. images, so it is possible to make src links as if in build mode.
The folders/files are just copied at the moment, but of course there could also be made modifications to them, before/after copying.

Another solution would have been a plugin for the php backend which injects the right path depending on dev and build.

## Why just a vite plugin (and not a roll up, too)?

It is just used for the development server, so plugin fires on a vite only hook: (configure Server)[https://vitejs.dev/guide/api-plugin.html#configureserver].
