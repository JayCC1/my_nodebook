## 依赖

#### gulp

它的主要功能是通过定义一系列的任务（使用 JavaScript 或 Node.js 编写），这些任务可以处理文件、编译代码、优化性能、运行测试等，从而帮助开发者更高效地开发和部署 Web 应用程序。

#### gulp-cli

gulp-cli 是一个用于创建和管理 gulp 任务的命令行工具。

#### @types/gulp

@types/gulp 是一个类型定义包，用于提供 Gulp 任务的类型信息，以便在 TypeScript 中使用 Gulp。

#### sucrase

用于将 JavaScript 代码中的 ES6+ 语法转换为 ES5 语法，我们需要使用 ts 以及新的 es6 语法，而 gulp 是不支持的，所以我们需要安装 sucrase 让我们执行 gulp 可以使用最新的语法并且支持 ts

#### @rollup/plugin-sucrase

一个 Rollup 插件，它使用 Sucrase 编译 TypeScript，Flow，JSX 等。

#### gulp-autoprefixer

是一个 Gulp 插件，用于自动添加 CSS 前缀以确保跨浏览器兼容性。它使用 Autoprefixer 库来确定需要添加哪些前缀，并自动将它们添加到您的 CSS 代码中。

#### gulp-clean-css

是一个 Gulp 插件，用于压缩和清理 CSS 文件。它使用 CleanCSS 库来执行这些操作，包括删除空格、注释和未使用的 CSS 规则等。

#### gulp-sass

gulp-sass 是一个 Gulp 插件，用于将 Sass（Syntactically Awesome Style Sheets）文件编译为 CSS 文件。Sass 是一种 CSS 预处理器，提供了一些功能，如变量、嵌套规则、混合和继承等，可以使 CSS 开发更加高效和易于维护。

#### gulp-typescript

gulp-typescript 是一个 Gulp 插件，用于将 TypeScript 代码编译成 JavaScript 代码。它集成了 TypeScript 编译器，可以在 Gulp 任务中直接使用。

#### gulp-sourcemaps

生成 source map

#### gulp-uglify

压缩 JavaScript 代码

#### gulp-concat

合并文件

#### gulp-rename

重命名文件或更改文件名

#### gulp-filter

用于在 Gulp 流中过滤文件,它可以根据指定的条件过滤文件，并将符合条件的文件传递给下一个插件或任务，而不符合条件的文件则会被忽略。

#### rimraf

rimraf 是一个用于删除文件和文件夹的 Node.js 模块。

#### symlink-dir

symlink-dir 是一个 Node.js 模块，用于在目标目录中创建符号链接（symbolic link）到源目录。符号链接是一种特殊类型的文件，它指向另一个文件或目录，而不是实际存储数据。

#### camelcase

将破折号/点/下划线/空格分隔的字符串转换为驼峰大小写或帕斯卡大小写： foo-bar → fooBar

#### chalk

它主要被用来为控制台输出添加颜色和样式。在命令行界面中，chalk 可以帮助开发者以更加直观、友好的方式展示信息。

#### kleur

kleur 是另一个命令行输出库，提供了与 chalk 类似的功能，但有一些额外的样式选项。

#### boxen

boxen 是一个用于创建命令行输出框的库，可以自定义框的样式和内容。

#### figures

figures 是一个用于命令行输出的符号库，提供了各种符号和图标，可以用于装饰输出文本。

#### parse-json

parse-json 是一个用于解析 JSON 数据的库。它可以将 JSON 字符串转换为 JavaScript 对象，以便在代码中使用和操作这些数据。

#### fast-glob

fast-glob 是一个快速、高效的文件和目录匹配库，它使用 Node.js 的 fs.readdir 和 fs.stat 系统调用，以实现高性能的文件和目录匹配。

#### Consola

命令行输出或自定义

#### TypeScript

确保您的项目在构建和运行之前经过 TypeScript 的类型检查，从而帮助您捕获类型错误并提高代码质量。

#### @types/node

为 Node.js 的 API 提供类型声明

#### @rollup/plugin-node-resolve

帮助 Rollup 处理 Node.js 模块。具体来说，该插件会在 Rollup 打包过程中解析 Node.js 模块的导入语句（例如 require() 或 import 语句），然后查找并打包这些依赖的 Node.js 模块。

#### rollup-plugin-typescript2

rollup-plugin-typescript 的重写

- 将 TypeScript 文件编译为 JavaScript；
- 自动处理 TypeScript 中的 import 和 export 语句；
- 为 Rollup 提供捆绑支持，以创建最终的捆绑包。

#### @vue/compiler-sfc

是 Vue.js 的官方编译器，用于将 .vue 文件中的模板、脚本和样式编译成可执行的 JavaScript 代码。它使用 Vue.js 的模板编译器和运行时库来解析和编译 .vue 文件，并生成可在浏览器中运行的 JavaScript 文件。

#### rollup-plugin-vue

- 将 Vue 组件编译成 JavaScript 模块；
- 自动处理 Vue 组件中的模板、样式和交互；
- (重点)为 Rollup 提供捆绑支持，以创建最终的捆绑包。

#### @vitejs/plugin-vue

插件允许你在 Vite 应用程序中使用 Vue.js。它提供了对 Vue 组件、Vue 单文件组件（.vue 文件）以及 Vue 特性（如 Vue Router 和 Vuex）的支持,可以将 Vue 单文件组件转换为 JavaScript 模块，以便在浏览器中使用。

#### @vitejs/plugin-vue-jsx

是一个用于支持在 Vue.js 项目中使用 JSX/TSX 语法的插件,主要作用就是将 JSX/TSX 模板解析并编译成 Vue 模板。

#### unplugin-vue-define-options

选项 API 可以使用＜ script setup ＞中的 defineOptions 声明，特别是可以在一个函数内设置 name, props, emits, and render

#### @rollup/plugin-commonjs

CommonJs 是一种用于在浏览器之外执行 JavaScript 代码的模块规范，Rollup 默认只支持 ES 模块。这个插件的作用就是将 CommonJS 模块转换为 ES 模块，以便在 Rollup 中进行打包。

#### @esbuild-kit/cjs-loader

将 ESM 和 TypeScript 模块转换为 CommonJS 格式

#### @esbuild-kit/esm-loader

将 TypeScript 模块转换为 ESM 格式的加载器

#### esbuild

Esbuild 是一个快速的 JavaScript 打包器,主要的特点是极速和简洁。Esbuild 可以自动识别和处理 JSX 和 CSS 等文件，同时也支持通过命令行进行调用和配置,Esbuild 从零开始造轮子，没有任何第三方库的黑盒逻辑，保证极致的代码性能，同时高效利用内存。
对于.ts 和.tsx 文件是默认启用 ts 或者 tsx-loader,内置了对 TypeScript 语法的解析和丢弃类型注释的支持,需要注意的是，esbuild 在编译时不会进行类型检查，这应该在编译之前使用 ide 去检查。

#### rollup-plugin-esbuild

是一个 Rollup 插件，用于使用 esbuild 来执行 JavaScript 代码转换和打包。

#### ts-morph

- 解析 TypeScript 代码并生成 AST（抽象语法树）；
- 在代码中进行搜索和导航，找到符合特定要求的部分；
- 通过操作树来修改代码;
- 生成类型定义文件;
- 格式化代码.

#### @babel/core

Babel 是一个工具链，用于将最新的 ECMAScript 语法转换为较旧的 JavaScript 版本
@babel/core 是 Babel 工具链的核心包，提供了一些基础的函数和工具，用于解析、转换和生成 JavaScript 代码

#### @babel\preset-env

是一个 Babel 预设，它可以根据指定的目标环境自动确定需要的 Babel 插件和 polyfill，以将 ECMAScript 2015+ 代码转换为向后兼容的 JavaScript 版本
可以根据目标环境自动确定需要的插件和 polyfill

#### gulp-babel

是一个 gulp 插件，用于将 JavaScript 代码转换为向后兼容的 JavaScript 版本，以便在不同的环境中运行。它的主要作用是利用 Babel 工具链对 JavaScript 代码进行转码和编译
