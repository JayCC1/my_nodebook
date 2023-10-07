import { resolve } from "path";

import vuePlugin from "@vitejs/plugin-vue";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import gulp from "gulp";
import { execa } from "execa";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDefineOptions from "unplugin-vue-define-options/rollup";
import esbuild, { minify as minifyPlugin } from "rollup-plugin-esbuild";
import { rimraf } from "rimraf";

import {
  componentsLibTsConfig,
  componentsRoot,
  componentsTsConfig,
} from "../utils/paths";
import { generateExternal } from "../utils/rollup-utils";
import { generateTypesPlugin } from "../plugins/generateTypePlugin";

const { src, dest, series, parallel } = gulp;
// 入口文件
const input = resolve(componentsRoot, "index.ts");
const esbuildTarget = "esnext";

// 清空之前打包的文件
const cleanComponents = async () => {
  const buildDir = ["dist", "es", "lib"];
  buildDir.forEach((dir) => {
    rimraf.sync(resolve(componentsRoot, dir));
  });
};

// ------------------ 打包成 模块 组件 ------------------
const buildEachComponent = async () => {
  const bundle = await rollup({
    input: input,
    plugins: [
      nodeResolve(),
      vueDefineOptions(),
      // @ts-ignore
      vueJsx(),
      // @ts-ignore
      vuePlugin(),
      esbuild({
        target: esbuildTarget,
        sourceMap: true,
      }),
      generateTypesPlugin({
        // 生成 es目录 类型声明文件
        compilerOptions: {
          emitDeclarationOnly: true,
          preserveSymlinks: true,
          skipLibCheck: true,
          noImplicitAny: false,
        },
        tsConfigFilePath: componentsTsConfig,
        injectFiles: [resolve(componentsRoot, "components/env.d.ts")],
      }),
      generateTypesPlugin({
        // 生成 lib目录 类型声明文件
        compilerOptions: {
          emitDeclarationOnly: true,
          preserveSymlinks: true,
          skipLibCheck: true,
          noImplicitAny: false,
        },
        tsConfigFilePath: componentsLibTsConfig,
        injectFiles: [resolve(componentsRoot, "components/env.d.ts")],
      }),
    ],
    treeshake: false,
    external: generateExternal({ full: true }), // 外部模块，所有依赖都设置为外部模块
  });
  // 把 components 文件夹下的组件存在至 es 及 lib 文件夹下
  // 1. /es
  // 2. /lib
  // 输出文件
  await Promise.all([
    bundle.write({
      format: "esm", // 模块格式
      dir: resolve(componentsRoot, "es"), // 输出目录
      exports: undefined, // 导出模式
      preserveModules: true, // 与原始模块创建相同的文件结构
      preserveModulesRoot: "components", // 默认情况下会将模块路径压缩为相对路径，设置之后则路径会以root路径为基础设置路径
      sourcemap: true, // 是否生成 sourcemap
      entryFileNames: `[name].mjs`, // 生成的文件名
    }),
    bundle.write({
      format: "cjs",
      dir: resolve(componentsRoot, "lib"),
      exports: "named",
      preserveModules: true,
      preserveModulesRoot: "components",
      sourcemap: true,
      entryFileNames: `[name].js`,
    }),
  ]);
};

// ------------------ 打包为 全量 组件 ------------------
const buildFullComponent = async () => {
  const bundle = await rollup({
    input,
    plugins: [
      nodeResolve(),
      vueDefineOptions(),
      vueJsx(),
      vuePlugin(),
      esbuild({
        target: esbuildTarget,
        sourceMap: true,
        treeShaking: true,
      }),
      minifyPlugin({
        target: esbuildTarget,
        sourceMap: true,
      }),
    ],
    treeshake: true,
    external: generateExternal({ full: false }), // 外部模块，只提取前置依赖为外部模块
  });

  // 输出文件
  await Promise.all([
    bundle.write({
      format: "esm",
      file: resolve(componentsRoot, "dist", "index.min.mjs"),
      exports: undefined,
      sourcemap: true,
    }),
    bundle.write({
      format: "umd",
      file: resolve(componentsRoot, "dist", "index.min.js"),
      exports: "named",
      sourcemap: true,
      name: "JComponent", // UMD 模块命名，在其他js文件中可以通过 const jc = require('JComponent') 访问
      globals: {
        vue: "Vue",
        "element-plus": "ElementPlus",
        "@jaycce/gulp-utils": "gulpUtils",
      },
    }),
  ]);
};

// ------------------ 为组件生成声明文件（es模块方法一，方法二为自己写的rollup插件generateTypePlugin ） ------------------
const generateTypes = async () => {
  await execa("vue-tsc", ["-p", componentsTsConfig], {
    cwd: componentsRoot,
  });
  return src(resolve(componentsRoot, "es/**/*.d.ts")).pipe(
    dest(resolve(componentsRoot, "lib"))
  );
};

export const buildComponent = () => {
  return series(
    cleanComponents,
    parallel(buildEachComponent, buildFullComponent)
  );
};
