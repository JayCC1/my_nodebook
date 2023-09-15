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
import { resolve } from "path";

/**
 * gulp 是类似一个管道的方法执行，从入口开始到出口，中间一步步执行
 */
import { series, parallel, src, dest } from "gulp";

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
  return src(resolve(__dirname, "./src/*.scss"))
    .pipe(sass.sync())
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(dest("./dist/css"));
}

/**
 * 处理 font 文件
 */
function copyFont() {
  // 从 src 下fonts文件夹中的所有文件开始
  //  ==> 压缩
  //  ==> 最终输出到当前目录下 dist 下的font目录
  return src(resolve(__dirname, "./src/fonts/**"))
    .pipe(cleanCss())
    .pipe(dest("./dist/fonts"));
}

/**
 * 把打包好的css输出到根目录的dist
 */
function copyFullStyle() {
  const rootDistPath = resolve(__dirname, "../../dist/theme-chalk");
  return src(resolve(__dirname, "./dist/**")).pipe(dest(rootDistPath));
}

export default series(parallel(compile, copyFont), copyFullStyle);
