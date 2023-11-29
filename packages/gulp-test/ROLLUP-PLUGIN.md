# 前言

记录rollup如何开发一个插件。参考文档： [官方文档](https://link.juejin.cn/?target=https%3A%2F%2Frollupjs.org%2Fguide%2Fen%2F%23plugins-overview "https://rollupjs.org/guide/en/#plugins-overview")。

# rollup

Rollup是一款优秀的模块化打包器，它的作用与Webpack类似，可以将项目中的散落模块打包为整块代码，使得这些模块更好地运行在浏览器环境或nodeJs环境。Rollup主要用来整合和打包前端资源，如JavaScript、CSS等，它尤其适合处理ES6的模块化代码。

个人在尝试搭建组件库练习时，碰到了相关需要开发自定义rollup插件的场景，因此记录一下，希望对大家有所帮助。 如想要了解组件库搭建的相关代码可查看[组件库搭建](https://github.com/JayCC1/my_nodebook)（还未写完在持续更新）。

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

## Build Hooks

build hooks 是 roolup 开放的在构建阶段不同触发时机钩子的统称，在构建过程中的不同阶段执行的函数，可以让你在打包过程中执行一些自定义的操作。

rollup 官网中有 build hooks 中存在的钩子的详细介绍-- [rollup build hooks 官网详细介绍地址](https://rollupjs.org/plugin-development/#build-hooks)，下方也会简单的对 build hooks 阶段中的各个钩子进行一个简单的介绍总结。

**Build Hooks 执行钩子：**

| 执行钩子       | 描述                                                   | 类型                                                         | 入参                                                         |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **options**    | 在加载配置选项之前调用，可以用来修改配置选项           | ``(options: InputOptions) =>guan InputOptions | null ``      | `options`: 包含配置选项的对象，可以在这里修改配置选项。      |
| **buildStart** | 在开始构建过程之前调用，可以用于执行一些初始化操作     | ``(options: InputOptions) => void``                          | `inputOptions`: 包含输入选项的对象。                         |
| **resolveId**  | 在解析模块标识符时调用，可以用来指定如何解析依赖的模块 | [ResolveIdHook](https://rollupjs.org/plugin-development/#resolveid) | `source`: 要解析的模块标识符。 `importer`: 导入模块的模块标识符。 |
| **load**       | 在加载模块时调用，可以用来自定义模块加载的过程         | ``(id: string) => LoadResult``                               | `id`: 要加载的模块标识符。 <br />**注意：** <br />1.如果这时候执行 `readFile(id, 'utf-8')` 类似操作，那么 `id` 将是相对于当前正在加载的模块的路径<br /> 2.如果你想相对于项目根目录来读取文件，你可能需要使用 `path` 模块将相对路径转换为绝对路径。 |
| **transform**  | 在转换代码之前调用，可以用于对代码进行自定义的转换     | ``(code: string, id: string) => TransformResult``            | `code`: 要转换的代码字符串。 `id`: 模块的标识符。            |
| **buildEnd**   | 在构建过程结束时调用，可以用于执行一些清理操作         | ``(error?: Error) => void``                                  | 无                                                           |



官网中提供的 ``build hooks`` 阶段钩子执行流程图参考：

![](E:\resources\practice_test\docs\packages\gulp-test\static\rollup__build-hooks插件执行流程.png)



## Output Generation Hooks

output generation hooks 在输出生成阶段执行一些自定义逻辑，和  [build hooks](#Build Hooks) 的工作方式和类型大致相同，但是按我个人的浅薄理解(还希望各位比较懂大神能够详细的给我狠狠的补习一下相关的知识)，``build hooks`` 阶段更多的是对 依赖关系以及代码内容的相关编译处理，而 ``output hooks`` 阶段更多是对编译完成后的补充操作（如添加注释信息、压缩等操作），roolup 官网入口--[rollup output generation hooks 官网详细介绍地址](https://rollupjs.org/plugin-development/#output-generation-hooks)，下方也会简单的对 output hooks 阶段中的各个钩子进行一个简单的介绍总结。

**Output Generation Hooks 执行钩子：**

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

官网中提供的 ``output generation hooks`` 阶段钩子执行流程图参考：

![](E:\resources\practice_test\docs\packages\gulp-test\static\rollup__output-generation-hooks插件执行流程.png)



## rollup-plugin-esbuild 源码解析分析

``rollup-plugin-esbuild`` 是一个 Rollup 插件，核心是使用 esbuild 来执行 JavaScript 代码转换和打包，其中实现了对编译后代码进行 压缩 的功能，我们就拿这段代码进行入手：

````javascript
import { Plugin, InternalModuleFormat } from 'rollup'
import { transform, TransformOptions, Format } from 'esbuild'
import { warn } from './warn'

/**
*
* getEsbuildFormat 函数：这个函数根据 Rollup 的模块格式（'es'、'cjs' 等）返回对应的 esbuild 格式。
* 如果 Rollup 格式是 'es'，则返回 esbuild 的 'esm' 格式；如果 Rollup 格式是 'cjs'，则返回 'cjs' 格式。
*
*/
const getEsbuildFormat = (
  rollupFormat: InternalModuleFormat,
): Format | undefined => {
  if (rollupFormat === 'es') {
    return 'esm'
  }
  if (rollupFormat === 'cjs') {
    return rollupFormat
  }
}

export type Options = Omit<TransformOptions, 'sourcemap'> & {
  sourceMap?: boolean
}

/**
*
* getRenderChunk 函数：这个函数返回一个用于处理渲染 chunk 的函数。这个函数接收源代码 code、一些参数以及 Rollup 配置。
* 它检查是否需要进行代码压缩，如果需要则使用 esbuild 对代码进行转换，并处理生成的警告信息。
* 如果成功转换，它返回一个包含转换后的代码和 sourcemap 的对象。
*
*/
export const getRenderChunk = ({
  sourceMap = true,
  ...options
}: Options): Plugin['renderChunk'] =>
  async function (code, _, rollupOptions) {
    if (
      options.minify ||
      options.minifyWhitespace ||
      options.minifyIdentifiers ||
      options.minifySyntax
    ) {
      const format = getEsbuildFormat(rollupOptions.format)
      const result = await transform(code, {
        format,
        loader: 'js',
        sourcemap: sourceMap,
        ...options,
      })
      await warn(this, result.warnings)
      if (result.code) {
        return {
          code: result.code,
          map: result.map || null,
        }
      }
    }
    return null
  }

// minify 函数对象：这个函数返回一个 Rollup 插件对象，这个插件将在渲染 chunk 时进行代码压缩。
// 它使用了 getRenderChunk 函数来创建一个针对代码压缩的 renderChunk 方法。
// 主要使用的是 rollup 中 output generation hooks 中 renderChunk钩子
export const minify = ({
  sourceMap = true,
  ...options
}: Options = {}): Plugin => {
  return {
    name: 'esbuild-minify',

    renderChunk: getRenderChunk({
      minify: true,
      ...options,
      sourceMap,
    }),
  }
}
````

可以看出主要就是用了 ``renderChunk`` 钩子处理代码，其中的逻辑主要是调用 ``esbuild`` 中的功能，实现了代码的压缩功能。Rollup 的压缩功能插件也就完成了。



## 自定义插件开发

下面我们就自己开发一个自己的rollup插件，这也是我在使用 rollup 打包过程中发现了 esbuild 打包时并不会生成 ts的类型声明文件，所以也就一时兴起想了解 rollup 自定义插件开发练习的一个场景练习，该插件主要也就是想实现想针对(``.vue``、``.ts``)文件创建生成相应的类型声明文件。

使用到的依赖有：

- ``vue/compiler-sfc``：是 Vue.js 的官方编译器，用于将 .vue 文件中的模板、脚本和样式编译成可执行的 JavaScript 代码 或者 AST 抽象语法树。它使用 Vue.js 的模板编译器和运行时库来解析和编译 .vue 文件，并生成可在浏览器中运行的 JavaScript 文件。

- ``ts-morph``：

  1. 解析 TypeScript 代码并生成 AST（抽象语法树）；
  2. 在代码中进行搜索和导航，找到符合特定要求的部分；
  3. 通过操作树来修改代码;
  4. 生成类型定义文件;
  5. 格式化代码;

  

先说说插件接口入参的设计思路：

1. 首先由于是需要生成相应的类型声明文件，则 tsconfig 文件中的配置信息则肯定是需要获取到的，所以需要 tsconfig 路径属性 --  ``tsConfigFilePath``。
2. 其次在有了 tsconfig 路径后，但项目中的 tsconfig 主要还是用于全局的，可能有些配置项在某些场景打包时需要配置配置为和当前 tsconfig 中不同的值，所以需要能够拓展 tsconfig 属性 -- ``compilerOptions`` 。
3. 其次存在环境配置文件在 rollup 依赖中并不能收集到所以也需要开放出一个属性能够提供一个数组类型属性能够接收到需要额外注入的文件的路径 -- ``injectFile``

所以自定义插件的入参类型 Options 为：

````javascript
export interface Options {
  compilerOptions: CompilerOptions; // 扩展 tsconfig
  tsConfigFilePath: string; // 指定 tsconfig.josn 文件的绝对路径
  injectFiles?: string[]; // 注入额外的文件
}
````

确定了入参后则就是开始写插件内部的处理逻辑了，首先结合场景需求，我们可以使用 rollup ``build hooks`` 阶段中的 ``load`` 钩子，在加载模块时调用，可以用来自定义模块加载的过程，``load`` 钩子中会传入要加载的模块标识符 id，要加载的模块标识符 简单理解就是 **正在加载文件的绝对路径** 

````javascript
import { CompilerOptions } from "ts-morph";

import type { Plugin } from "rollup";

/**
 * 创建声明文件
 *
 * @param { Options } options 插件配置
 *
 * @options
 * `compilerOptions` 扩展 tsconfig
 *
 * `tsConfigFilePath` 指定 tsconfig.josn 文件的绝对路径
 *
 * `injectFiles` 注入额外的文件
 *
 */

export interface Options {
  compilerOptions: CompilerOptions;
  tsConfigFilePath: string;
  injectFiles?: string[];
  path?: {
    [key: string]: string;
  };
}

export const generateTypesPlugin = (options: Options): Plugin => {

  return {
    name: "generateTypes",
    async load(id) {
	  // .....
      return null;
    },
  };
};

````

确定了需要使用 rollup 处理逻辑的钩子之后则是处理进行处理其中需要执行的代码处理逻辑，由于我们需要额外注入的文件``injectFiles`` 是我们按需求自定义的并不在 rollup 可处理的依赖收集逻辑中，所以我们需要先将这一步进行处理，使用了 ``ts-morph`` 的 ``Project`` 类中 ``addSourceFileAtPath`` 可以通过传入 需要注入的文件夹路径获取到文件信息：

````javascript
import { CompilerOptions, Project } from "ts-morph";

import type { Plugin } from "rollup";

export const generateTypesPlugin = (options: Options): Plugin => {
    // 实例化 Project
  const tsProject = new Project({
    compilerOptions: options.compilerOptions, // 可以通过提供 compilerOptions 对象来覆盖任何 tsconfig.json 选项
    tsConfigFilePath: options.tsConfigFilePath, // 手动指定 tsconfig.json 文件的路径
    skipAddingFilesFromTsConfig: true, // 自动从 tsconfig.json 添加所有关联的源文件,如果您不想这样做则设置为 true
  });

  if (options.injectFiles?.length) {
    options.injectFiles.forEach((filterPath) => {
      // addSourceFileAtPath 根据需要指定任意数量的文件球或文件路径
      tsProject.addSourceFileAtPath(filterPath);
    });
  }
  return {
    name: "generateTypes",
    async load(id) {
	  // .....
      return null;
    },
  };
};
````

需要额外加载的文件处理逻辑大致完成了，下面则是需要处理 rollup 加载到的模块代码处理，由于需要处理的文件内容存在两种类型 ``.vue`` 文件和 ``.ts`` 文件，所以需要做逻辑判断分别处理：

- vue 文件需要先通过 ``vue/compiler-sfc`` 将vue代码 转换为类似 AST抽象语法树的结构，然后取出其中的script代码。
- 而 ts 文件则只需要取文件的内容则可

相关的代码如下：

````javascript
import { readFile } from "node:fs/promises";

import * as sfc from "vue/compiler-sfc";
import { Project } from "ts-morph";
import { CompilerOptions, SourceFile } from "ts-morph";
import consola from "consola";
import chalk from "chalk";

import type { Plugin } from "rollup";

// parse 作用是将 SFC（Vue单文件组件） 的源代码转换为 AST，以便在后续编译的过程中进行处理和优化
// compileScript 作用是将 SFC中的 <script> 部分编译为可执行的 javascript 代码
const { compileScript, parse } = sfc;

// 
	******
// 

export const generateTypesPlugin = (options: Options): Plugin => {
    // 
        ******
    // 
  const sourceFiles: SourceFile[] = [];
  return {
    name: "generateTypes",
    async load(id) {
      let sourceFile;
      if (id.endsWith(".vue")) {
        const content = await readFile(id, "utf-8");
        const hasTsNoCheck = content.includes("@ts-nocheck");
        const sfc = parse(content);
        const { script, scriptSetup } = sfc.descriptor;
        if (script || scriptSetup) {
          let content =
            (hasTsNoCheck ? "// @ts-nocheck \n" : "") + (script?.content ?? "");
          if (scriptSetup) {
            const compiler = compileScript(sfc.descriptor, {
              id,
            });
            content += compiler.content;
          }
          const lang = scriptSetup?.lang || script?.lang || "js";
          // createSourceFile 基于看起来像源文件的 AST 的对象创建源文件
          sourceFile = tsProject.createSourceFile(`${id}.${lang}`, content);
          sourceFiles.push(sourceFile);
        }
      } else if (id.endsWith(".ts")) {
        sourceFile = tsProject.addSourceFileAtPath(id);
        sourceFiles.push(sourceFile);
      }

      // 单个源文件调用emit或者使用项目级别上调用 使用tsProject.emit() 在buildEnd 注释中可见相关代码,本文采用单个源文件调用
      const diagnostics = sourceFile!.getPreEmitDiagnostics();
      if (diagnostics.length > 0) {
        consola.error(
          tsProject.formatDiagnosticsWithColorAndContext(diagnostics)
        );

        const err = new Error("代码中包含错误的类型声明，终止创建声明文件");
        consola.error(err);
        throw err;
      }
      await sourceFile?.emit();
      return null;
    },
  };
};

````

最后我们处理 **自动生成创建类型声明文件** 功能的 rollup 自定义插件就完成了，完整代码查看可[点击进入仓库查看](https://github.com/JayCC1/my_nodebook/blob/main/packages/gulp-test/build/plugins/generateTypePlugin.ts)

 

## 最后

本文是我在学习开发rollup插件的学习笔记，到此也就结束了，希望可以对大家有所帮助。

如果还有什么疑问或者建议，可以多多交流，才疏学浅，文中若有不正之处，万望告知。
