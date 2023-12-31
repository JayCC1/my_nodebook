import { resolve } from "path";
import { outDir, utilsRoot } from "./paths";

//
export const utilsConfig = {
  esm: {
    module: "ESNext", // tsconfig 输出的结果 es6 模块
    format: "esm", // 需要配置格式化后 的模块规范
    output: resolve(utilsRoot, "es"),
    rootOutput: {
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
    output: resolve(utilsRoot, "lib"),
    rootOutput: {
      name: "lib",
      path: resolve(outDir, "lib"),
    },
    bundle: {
      path: "@jaycce/gulp-utils/lib",
    },
  },
};

export type UtilsConfig = typeof utilsConfig;
