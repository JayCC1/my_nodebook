## 依赖

#### gulp

它的主要功能是通过定义一系列的任务（使用 JavaScript 或 Node.js 编写），这些任务可以处理文件、编译代码、优化性能、运行测试等，从而帮助开发者更高效地开发和部署 Web 应用程序。

#### gulp-cli

gulp-cli 是一个用于创建和管理 gulp 任务的命令行工具。

#### @types/gulp

@types/gulp 是一个类型定义包，用于提供 Gulp 任务的类型信息，以便在 TypeScript 中使用 Gulp。

#### sucrase

用于将 JavaScript 代码中的 ES6+ 语法转换为 ES5 语法，我们需要使用 ts 以及新的 es6 语法，而 gulp 是不支持的，所以我们需要安装 sucrase 让我们执行 gulp 可以使用最新的语法并且支持 ts

#### gulp-autoprefixer

是一个 Gulp 插件，用于自动添加 CSS 前缀以确保跨浏览器兼容性。它使用 Autoprefixer 库来确定需要添加哪些前缀，并自动将它们添加到您的 CSS 代码中。

#### gulp-clean-css

是一个 Gulp 插件，用于压缩和清理 CSS 文件。它使用 CleanCSS 库来执行这些操作，包括删除空格、注释和未使用的 CSS 规则等。

#### gulp-sass

gulp-sass 是一个 Gulp 插件，用于将 Sass（Syntactically Awesome Style Sheets）文件编译为 CSS 文件。Sass 是一种 CSS 预处理器，提供了一些功能，如变量、嵌套规则、混合和继承等，可以使 CSS 开发更加高效和易于维护。

#### gulp-typescript

gulp-typescript 是一个 Gulp 插件，用于将 TypeScript 代码编译成 JavaScript 代码。它集成了 TypeScript 编译器，可以在 Gulp 任务中直接使用。

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
