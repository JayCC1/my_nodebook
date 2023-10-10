import { resolve } from "path";

import gulp from "gulp";
import gulpSass from "gulp-sass";
import gulpFilter from "gulp-filter";
import vuePlugin from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDefineOptions from "unplugin-vue-define-options/rollup";
import esbuild, { minify as minifyPlugin } from "rollup-plugin-esbuild";
import autoPrefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import consola from "consola";
import chalk from "chalk";
import * as dartSass from "sass";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { execa } from "execa";
import { rimraf } from "rimraf";

import {
  componentsLibTsConfig,
  componentsRoot,
  componentsTsConfig,
} from "../utils/paths";
import { generateCjsPaths, generateExternal } from "../utils/rollup-utils";
import { generateTypesPlugin } from "../plugins/generateTypePlugin";

const { src, dest, series, parallel } = gulp;
const { green, cyan, yellow } = chalk;
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
      paths: generateCjsPaths(), // 最终打包后的文件中重写导入路径
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

// ------------------ copy 原始的 scss 文件需要时可直接使用 ------------------
const buildCopyScss = async () => {
  await new Promise((res) => {
    src(`${componentsRoot}/**/*.scss`)
      .pipe(dest(resolve(componentsRoot, "es")))
      .pipe(dest(resolve(componentsRoot, "lib")))
      .on("end", res);
  });
};

// ------------------ 将 scss 文件按模块编译为 css 文件并进行压缩，方便样式文件可单独引入 ------------------
const buildModuleScss = () => {
  const sass = gulpSass(dartSass);
  return src([
    `${componentsRoot}/**/style/*.scss`,
    `!${componentsRoot}/node_modules/**`,
  ])
    .pipe(
      sass.sync({ includePaths: [resolve(componentsRoot, "./node_modules")] })
    )
    .pipe(autoPrefixer({ cascade: false }))
    .pipe(
      cleanCss({}, (details) => {
        consola.success(
          `${green("uiModuleStyle: ")}${cyan(details.name)} => ${yellow(
            details.stats.originalSize / 1000
          )} KB -> ${green(details.stats.minifiedSize / 1000)} KB`
        );
      })
    )
    .pipe(dest(resolve(componentsRoot, "es")))
    .pipe(dest(resolve(componentsRoot, "lib")));
};

// ------------------ 将 scss 文件打包为全量的样式文件，提供给不需要按需引入或浏览器端直接引入 ------------------
const buildFullScss = () => {
  const sass = gulpSass(dartSass);
  return src(resolve(componentsRoot, "styles/*scss"))
    .pipe(
      sass.sync({ includePaths: [resolve(componentsRoot, "./node_modules")] })
    )
    .pipe(autoPrefixer())
    .pipe(
      cleanCss({}, (details) => {
        consola.success(
          `${green("uiModuleStyle: ")}${cyan(details.name)} => ${yellow(
            details.stats.originalSize / 1000
          )} KB -> ${green(details.stats.minifiedSize / 1000)} KB`
        );
      })
    )
    .pipe(dest(resolve(componentsRoot, "dist")));
};

export const buildComponent = () => {
  return series(
    cleanComponents,
    parallel(
      buildEachComponent,
      buildFullComponent,
      buildCopyScss,
      buildModuleScss,
      buildFullScss
    )
  );
};
