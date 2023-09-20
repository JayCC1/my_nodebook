/**
 * 打包样式
 * 安装相关依赖
 * - pnpm --filter @jaycce/gulp-theme-chalk i gulp-sass @types/gulp-sass @types/sass gulp-autoprefixer @types/gulp-autoprefixer @types/gulp-clean-css gulp-clean-css -D
 * gulp-autoprefixer: 添加样式前缀 gulp-clean-css: 压缩css
 */

import gulpSass from "gulp-sass";
import dartSass from "sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import consola from "consola";
import { resolve } from "path";
import { rimraf } from "rimraf";
import chalk from "chalk";

/**
 * gulp 是类似一个管道的方法执行，从入口开始到出口，中间一步步执行
 */
import { series, parallel, src, dest } from "gulp";
import { themeRoot } from "../utils/paths";
import { buildInputIgnore } from "../utils";
import { themeConfig } from "../utils/config";

// cleanCss 优化成功后命令行输出优化信息hook
function cleanCssAfter(details) {
  /**
   * - detail:
   *  - stats: 优化信息
   *    - originalSize: 导入内联后的原始内容大小
   *    - minifiedSize: 优化的内容大小
   *    - timeSpent: 用于优化的时间(以毫秒为单位)
   *    - efficiency: ' (originalSize - minifiedSize) / originalSize '，例如，如果大小从100字节减少到75字节，则为0.25
   *  - errors: 一个错误列表
   *  - warnings: 一个警告列表
   *  - path: 文件路径
   *  - name: 文件名称
   */
  // console.log(chalk.green("test"));

  consola.success(
    "123"
    // chalk.green("test")
    // `${chalk.green("THEME: ")}${chalk.cyan(details.name)} => ${chalk.yellow(
    //   details.stats.originalSize / 1000
    // )} KB -> ${chalk.green(details.stats.minifiedSize)} KB`
  );
}

export const buildTheme = () => {
  // 请空之前打包的文件
  const cleanTheme = async () => {
    rimraf.sync(resolve(themeRoot, "dist"));
  };

  /**
   * 对 sass 文件做处理
   */
  function compile() {
    const sass = gulpSass(dartSass);
    // 从src下的scss文件开始
    //    ==> 编译成css
    //    ==> 添加前缀
    //    ==> 压缩
    //    ==> 最终输出到当前目录下 dist 下的目录
    return src(buildInputIgnore(resolve(themeRoot, "./src/*.scss")))
      .pipe(sass.sync())
      .pipe(autoprefixer())
      .pipe(cleanCss({}, cleanCssAfter))
      .pipe(dest(themeConfig.css.output));
  }

  /**
   * 处理 font 文件
   */
  function copyFont() {
    // 从 src 下fonts文件夹中的所有文件开始
    //  ==> 压缩
    //  ==> 最终输出到当前目录下 dist 下的font目录
    return src(buildInputIgnore(resolve(themeRoot, "./src/fonts/**")))
      .pipe(cleanCss({}, cleanCssAfter))
      .pipe(dest(themeConfig.fonts.output));
  }

  /**
   * 把打包好的css输出到根目录的dist
   */
  function copyFullStyle() {
    const tasks = Object.values(themeConfig).map((config) => {
      const obj = {
        [`copyFull${config.name}`]: () =>
          src(resolve(config.output, "./**")).pipe(
            dest(config.rootOutput.path)
          ),
      };
      return series(obj[`copyFull${config.name}`]);
    });
    return parallel(...tasks);
  }

  return series(cleanTheme, parallel(compile, copyFont), copyFullStyle());
};
