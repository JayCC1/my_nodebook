// 专门打包 utils指令hook
import { series, parallel, src, dest } from "gulp";
import ts from "gulp-typescript";
import { resolve } from "path";
import { utilsConfig } from "../utils/config";
import { projectRoot, utilsRoot } from "../utils/paths";
import { rimraf } from "rimraf";

// 打包处理
export const buildUtils = () => {
  // 请空之前打包的文件
  const cleanUtils = async () => rimraf.sync(resolve(utilsRoot, "dist"));
  const tasks = Object.entries(utilsConfig).map(([module, config]) => {
    // task 任务列表
    const seriesTasks: Record<string, any> = {
      [`build:utils-${config.rootOutput.name}`]: () => {
        const tsConfig = resolve(projectRoot, "tsconfig.json");
        const inputs = [resolve(utilsRoot, "**/*.ts"), "!node_modules"];
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
      // 处理 ts 文件
      seriesTasks[`build:utils-${config.rootOutput.name}`],
      seriesTasks[`copy:utils-${config.rootOutput.name}`]
    );
  });
  return series(cleanUtils, parallel(...tasks));
};
