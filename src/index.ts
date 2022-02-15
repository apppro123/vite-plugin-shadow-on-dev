import type { Plugin, ViteDevServer } from "vite";
import chokidar, { WatchOptions } from "chokidar";
import chalk from "chalk";
import { copyFile, mkdir, rmdir, unlink } from "fs/promises";
import pathTools from "path";

interface Options extends WatchOptions {
  /**
   * source directory which
   */
  src: string;

  /**
   * Directory to sync files to (from src)
   */
  dest: string;

  /**
   * if page reloads should be logged
   */
  log?: boolean;

  /**
   * File paths will be resolved against this directory.
   *
   * @default ViteDevServer.root
   * @internal
   */
  root?: string;
}

/**
 * @param {Options} options options object for more custamization OR just the watch path as string
 * @returns vite plugin
 */
export default function syncFolderDevPlugin(options: Options): Plugin {
  return {
    name: "vite-plugin-copy-public",
    apply: "serve",

    configureServer({ ws, config: { root: viteRoot, logger } }: ViteDevServer) {
      const root = options.root || viteRoot;

      const reloadAndMakeChange = async (event: string, path: string) => {
        const source = root + "/" + path;

        const pathFromWatch = pathTools.relative(options.src, path);

        const destination = root + "/" + options.dest + pathFromWatch;

        switch (event) {
          case "add":
          case "change":
            await copyFile(source, destination);
            break;
          case "unlink":
            await unlink(destination);
            break;
          case "addDir":
            await mkdir(destination);
            break;
          case "unlinkDir":
            await rmdir(destination);
            break;
          default:
            return;
        }

        ws.send({ type: "full-reload" });

        if (options.log ?? false)
          logger.info(
            chalk.green("page reload because " + event + " at " + path),
            {
              clear: true,
              timestamp: true,
            }
          );
      };

      chokidar
        .watch(options.src, { cwd: root, ignoreInitial: true })
        .on("all", reloadAndMakeChange);
    },
  };
}
