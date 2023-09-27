/**
 * 打包样式
 * 安装相关依赖
 * - pnpm --filter @jaycce/gulp-theme-chalk i gulp-sass @types/gulp-sass @types/sass gulp-autoprefixer @types/gulp-autoprefixer @types/gulp-clean-css gulp-clean-css -D
 * gulp-autoprefixer: 添加样式前缀 gulp-clean-css: 压缩css
 */

import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import gulpFilter from "gulp-filter";
import * as dartSass from "sass";
import consola from "consola";
import { resolve } from "path";
import { rimraf } from "rimraf";
import chalk from "chalk";

/**
 * gulp 是类似一个管道的方法执行，从入口开始到出口，中间一步步执行
 */
import gulp from "gulp";
import { themeRoot } from "../utils/paths";

const { series, src, dest, parallel } = gulp;
const { green, cyan, yellow } = chalk;

const buildThemePath = resolve(themeRoot, "./scss/*.scss");
const buildThemeOutDir = resolve(themeRoot, "dist");
// 清空之前打包的文件
async function cleanTheme() {
  rimraf.sync(resolve(themeRoot, "dist"));
}

// --------------- 打包 样式 相关文件编译为css并压缩 ---------------
function buildStyle() {
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
    const excludeFilter = gulpFilter([buildThemePath, "!mixin.scss"], {
      restore: true,
    });

    return src(buildThemePath)
      .pipe(excludeFilter)
      .pipe(sass.sync())
      .pipe(
        autoprefixer({
          cascade: false, // 为 true 时会对 CSS 规则进行重新排序，使得属性的连写更加优雅
        })
      )
      .pipe(
        cleanCss({}, (details) => {
          consola.success(
            `${green("CHALK: ")}${cyan(details.name)} => ${yellow(
              details.stats.originalSize / 1000
            )} KB -> ${green(details.stats.minifiedSize / 1000)} KB`
          );
        })
      )
      .pipe(dest(buildThemeOutDir));
  }

  return compile;
}

// --------------- 拷贝 scss，提供原始scss文件，有需求的用户可以直接引用 ---------------
function buildScssCopy() {
  return src(`${themeRoot}/**/*.scss`).pipe(dest(buildThemeOutDir));
}

export function buildTheme() {
  return series(cleanTheme, parallel(buildStyle(), buildScssCopy));
}
