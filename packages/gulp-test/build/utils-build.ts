// 专门打包 utils指令hook
import { series, parallel, src, dest } from "gulp";
import ts from "gulp-typescript";
import { resolve } from "path";
import { cwd } from "process";
import { buildConfig } from "./utils/config";
import { outDir, projectRoot } from "./utils/paths";
import { buildInputIgnore, run } from "./utils";

// 打包处理
export const buildUtils = (dirname: string, name: string) => {
  // 请空之前打包的文件
  const clean = async () => run(`rimraf ${resolve(cwd(), "./dist")}`);
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const output = resolve(dirname, `dist/${config.output.name}`);

    // task 任务列表
    const seriesTasks: Record<string, any> = {
      [`build:${dirname}`]: () => {
        const tsConfig = resolve(projectRoot, "tsconfig.json");
        const inputs = buildInputIgnore([
          "**/*.ts",
          "!gulpfile.ts",
          "!node_modules",
        ]);
        return src(inputs)
          .pipe(
            ts.createProject(tsConfig, {
              declaration: true, // 需要生成声明文件
              strict: false, // 关闭严格模式
              module: config.module,
            })()
          )
          .pipe(dest(output));
      },
      [`copy:${dirname}`]: () => {
        // 将打包好的文件放到 es ==> utils 和 lib ==> utils
        // 将utils模块拷贝到dist目录下的 es和 lib目录
        return src(`${output}/**`).pipe(
          dest(resolve(outDir, config.output.name, name))
        );
      },
    };

    // 安装依赖 gulp-typescript
    return series(
      // 清空之前的文件
      // 处理 ts 文件
      seriesTasks[`build:${dirname}`],
      seriesTasks[`copy:${dirname}`]
    );
  });
  return series(clean, parallel(...tasks));
};
