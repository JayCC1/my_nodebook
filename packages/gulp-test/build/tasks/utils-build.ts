// 专门打包 utils指令hook
import { series, parallel, src, dest } from "gulp";
import ts from "gulp-typescript";
import { resolve } from "path";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import babel from "gulp-babel";
import esbuild, { minify as minifyPlugin } from "rollup-plugin-esbuild";
import nodeResolve from "@rollup/plugin-node-resolve";
import { rimraf } from "rimraf";
import { rollup } from "rollup";
import { utilsConfig } from "../utils/config";
import { utilsRoot } from "../utils/paths";

// 模块打包处理
export const buildUtils = () => {
  const tsConfig = resolve(utilsRoot, "tsconfig.json");
  const inputs = [
    resolve(utilsRoot, "**/*.ts"),
    "!node_modules",
    "!es",
    "!lib",
    "!dist",
  ];
  const tasks = Object.entries(utilsConfig).map(([module, config]) => {
    // task 任务列表
    const seriesTasks: Record<string, any> = {
      [`clean:utils-${config.rootOutput.name}`]: async () =>
        rimraf.sync(resolve(utilsRoot, config.rootOutput.name)),
      [`build:utils-${config.rootOutput.name}`]: () => {
        return src(inputs)
          .pipe(
            ts.createProject(tsConfig, {
              declaration: true, // 需要生成声明文件
              strict: false, // 关闭严格模式
              module: config.module,
            })()
          )
          .pipe(dest(config.output));
      },
      [`copy:utils-${config.rootOutput.name}`]: () => {
        // 将打包好的文件放到 es ==> utils 和 lib ==> utils
        // 将utils模块拷贝到dist目录下的 es和 lib目录
        return src(resolve(config.output, "**")).pipe(
          dest(config.rootOutput.path)
        );
      },
    };

    // 安装依赖 gulp-typescript
    return series(
      // 清空之前的文件
      seriesTasks[`clean:utils-${config.rootOutput.name}`],
      // 处理 ts 文件
      seriesTasks[`build:utils-${config.rootOutput.name}`],
      seriesTasks[`copy:utils-${config.rootOutput.name}`]
    );
  });
  return parallel(...tasks);
};

export const buildFullUtils = () => {
  const inputs = [resolve(utilsRoot, "index.ts")];
  const tsConfig = resolve(utilsRoot, "tsconfig.json");
  // 清空 dist 目录
  const cleanUtilsFull = async () => rimraf.sync(resolve(utilsRoot, "dist"));

  return series(
    cleanUtilsFull,
    parallel(buildFullUtilsForCjs, buildFullUtilsForEjs)
  );
};

function buildFullUtilsForCjs() {
  const inputs = [resolve(utilsRoot, "index.ts")];
  const tsConfig = resolve(utilsRoot, "tsconfig.json");
  return src(inputs)
    .pipe(
      ts.createProject(tsConfig, {
        declaration: true, // 需要生成声明文件
        strict: false, // 关闭严格模式
        module: utilsConfig.cjs.module,
      })()
    )
    .pipe(
      babel({
        presets: ["@babel/preset-env", "@babel/preset-typescript"],
      })
    )
    .pipe(concat(`utils.${utilsConfig.cjs.format}.js`)) // 将编译后的文件合并为一个名为utils.es.js的文件
    .pipe(uglify()) // 压缩utils.es.js文件
    .pipe(rename(`index.min.js`))
    .pipe(dest(resolve(utilsRoot, "dist")));
}

async function buildFullUtilsForEjs() {
  const input = resolve(utilsRoot, "index.ts");
  const target = "esnext";
  const hasSourceMap = true;
  const bundle = await rollup({
    input,
    plugins: [
      nodeResolve(),
      esbuild({
        target,
        sourceMap: hasSourceMap,
      }),
      minifyPlugin({
        target,
        sourceMap: hasSourceMap,
      }),
    ],
    treeshake: true,
  });

  await Promise.resolve(
    bundle.write({
      format: "esm", // 模块格式
      file: resolve(utilsRoot, "dist", `index.min.mjs`), // 输出目录
      exports: undefined, // 导出模式
      sourcemap: hasSourceMap, // 生成 sourcemap
    })
  );
}