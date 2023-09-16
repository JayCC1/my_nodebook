// 专门打包 utils指令hook
import { series, parallel, src, dest } from "gulp";
import { buildConfig } from "./utils/config";
import { resolve } from "path";
import { outDir, projectRoot } from "./utils/paths";
import ts from "gulp-typescript";
import { run } from "./utils";
import { cwd } from "process";

// 打包处理
export const buildPackages = (dirname: string, name: string) => {
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const output = resolve(dirname, `dist/${config.output.name}`);

    // task 任务列表
    const seriesTasks = {
      clean: async () => run(`rimraf ${resolve(cwd(), "./dist")}`),
      [`build:${dirname}`]: () => {
        const tsConfig = resolve(projectRoot, "tsconfig.json");
        const inputs = ["**/*.ts", "!gulpfile.ts", "!node_modules"];
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
      seriesTasks.clean,
      // 处理 ts 文件
      seriesTasks[`build:${dirname}`],
      seriesTasks[`copy:${dirname}`]
    );
  });
  return parallel(...tasks);
};