import type { Options } from "tsup"

const env = process.env.NODE_ENV

export const tsup: Options = {
  splitting: true,
  sourcemap: true,
  clean: true, // rimraf dist
  dts: true, // generate dts file for main module
  format: ["cjs", "esm"], // generate cjs and esm files
  minify: env === "production",
  bundle: env === "production",
  skipNodeModulesBundle: true,
  watch: env === "development",
  target: "es2020",
  outDir: env === "production" ? "dist" : "lib",
  entry: ["src/index.ts"],
}
