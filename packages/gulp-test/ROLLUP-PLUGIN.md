# 前言

记录rollup如何开发一个插件。参考文档： [官方文档](https://link.juejin.cn/?target=https%3A%2F%2Frollupjs.org%2Fguide%2Fen%2F%23plugins-overview "https://rollupjs.org/guide/en/#plugins-overview")。

# rollup

Rollup是一款优秀的模块化打包器，它的作用与Webpack类似，可以将项目中的散落模块打包为整块代码，使得这些模块更好地运行在浏览器环境或nodeJs环境。Rollup主要用来整合和打包前端资源，如JavaScript、CSS等，它尤其适合处理ES6的模块化代码。

个人在尝试搭建组件库练习时，碰到了相关需要开发自定义rollup插件的场景，因此记录一下，希望对大家有所帮助。 如想要了解组件库搭建的相关代码可查看[组件库搭建](https://github.com/JayCC1/my_nodebook)（还未写完在持续更新）

# rollup 插件概述

rollup插件实际上是返回一个Object对象，其中的属性在官方文档中总结为三大类

-   **Properties**
-   **Build Hook**
-   **output generation hooks**

下面会分别介绍


## Properties

对于 `Properties` 官方文档中介绍了两个属性分别是：

| 属性    | 类型     | 描述                           |
| ------- | -------- | ------------------------------ |
| name    | `string` | 插件的名称，用于错误消息和日志 |
| version | `string` | 插件的版本，用于插件间通信场景 |

## Build Hook

在构建过程中的不同阶段执行的函数，可以让你在打包过程中执行一些自定义的操作。



| 执行钩子       | 描述                                                   | 类型                                                         | 入参                                                         |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **options**    | 在加载配置选项之前调用，可以用来修改配置选项           | ``(options: InputOptions) => InputOptions | null ``          | `options`: 包含配置选项的对象，可以在这里修改配置选项。      |
| **buildStart** | 在开始构建过程之前调用，可以用于执行一些初始化操作     | ``(options: InputOptions) => void``                          | `inputOptions`: 包含输入选项的对象。                         |
| **resolveId**  | 在解析模块标识符时调用，可以用来指定如何解析依赖的模块 | [ResolveIdHook](https://rollupjs.org/plugin-development/#resolveid) | `source`: 要解析的模块标识符。 `importer`: 导入模块的模块标识符。 |
| **load**       | 在加载模块时调用，可以用来自定义模块加载的过程         | ``(id: string) => LoadResult``                               | `id`: 要加载的模块标识符。 <br />**注意：** <br />1.如果这时候执行 `readFile(id, 'utf-8')` 类似操作，那么那么 `id` 将是相对于当前正在加载的模块的路径<br /> 2.如果你想相对于项目根目录来读取文件，你可能需要使用 `path` 模块将相对路径转换为绝对路径。 |
| **transform**  | 在转换代码之前调用，可以用于对代码进行自定义的转换     | ``(code: string, id: string) => TransformResult``            | `code`: 要转换的代码字符串。 `id`: 模块的标识符。            |
| **buildEnd**   | 在构建过程结束时调用，可以用于执行一些清理操作         | ``(error?: Error) => void``                                  | 无                                                           |



## output generation hooks

在输出生成阶段执行一些自定义逻辑。



| rollup插件执行钩子 | 描述                                                       | 类型                                                         | 入参                                                         |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **renderStart**    | 在开始渲染输出文件之前调用，可以用于执行一些初始化操作     | ``(outputOptions: OutputOptions, inputOptions: InputOptions) => void`` | `outputOptions`: 输出选项的对象。                            |
| **generateBundle** | 在生成输出文件束（bundle）时调用，可以用于自定义生成的文件 | [类型链接](https://rollupjs.org/plugin-development/#generatebundle) | `outputOptions`: 输出选项的对象。 `bundle`: 包含生成的文件的对象，可以在这里对生成的文件进行自定义处理。 |
| **banner**         | 在生成的输出文件的开头添加一个注释或者头部信息             | ``string | ((chunk: ChunkInfo) => string)``                  | 无                                                           |
| **footer**         | 在生成的输出文件的末尾添加一个注释或者尾部信息             | ``string |((chunk: ChunkInfo) => string)``                   | 无                                                           |
| **intro**          | 在输出文件的模块之前插入一段代码                           | ``string |((chunk: ChunkInfo) => string)``                   | 无                                                           |
| **outro**          | 在输出文件的模块之后插入一段代码                           | ``string |((chunk: ChunkInfo) => string)``                   | 无                                                           |
| **watchChange**    | 在监听模式下，当文件发生变化时调用                         |                                                              | `id`: 发生变化的模块的标识符。                               |
| **moduleParsed**   | 在解析模块完成后调用                                       |                                                              | `module`: 解析完成的模块对象。                               |
| **renderChunk**    | 在渲染单个 chunk 时调用                                    | [RenderChunkHook](https://rollupjs.org/plugin-development/#renderchunk) | `code`: 渲染后的代码字符串。 `chunk`: 当前渲染的 chunk 对象。 |
| **writeBundle**    | 在将 bundle 写入文件系统时调用                             | [类型链接](https://rollupjs.org/plugin-development/#writebundle) | `outputOptions`: 输出选项的对象。 `bundle`: 包含生成的文件的对象。 |
