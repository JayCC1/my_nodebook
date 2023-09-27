// rollup.config.js
import { readFileSync } from "node:fs";

import typescript from "rollup-plugin-typescript2";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import parseJson from "parse-json";

const pkg = parseJson(readFileSync("./package.json", "utf-8"));

export default {
  input: "./gulpfile.ts",
  plugins: [
    nodeResolve(),
    typescript({ tsconfig: "./tsconfig.json" }),
    commonjs(),
  ],
  output: {
    format: "esm",
    dir: "./dist",
    preserveModules: true,
  },
  external: [
    ...Object.keys(pkg.devDependencies),
    "parse-json",
    "unplugin-vue-define-options/rollup",
  ],
  watch: {
    exclude: ["./node_modules/**", "./dist/**"],
  },
};
