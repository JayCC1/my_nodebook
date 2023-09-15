import { resolve } from "path";
import { outDir } from "./paths";

export const buildConfig = {
  esm: {
    module: "ESNext", // tsconfig 输出的结果 es6 模块
    format: "esm", // 需要配置格式化后 的模块规范
    output: {
      name: "es", // 打包到 dist 目录下的哪个目录
      path: resolve(outDir, "es"),
    },
    bundle: {
      path: "@jaycce/gulp-utils/es",
    },
  },
  cjs: {
    module: "CommonJS",
    format: "cjs",
    output: {
      name: "lib",
      path: resolve(outDir, "lib"),
    },
    bundle: {
      path: "@jaycce/gulp-utils/lib",
    },
  },
};

export type BuildConfig = typeof buildConfig;
