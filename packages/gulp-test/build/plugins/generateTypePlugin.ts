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
 * `paths` 重写路径
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
    async buildEnd() {
      // *********** 项目级别上调用编译 TypeScript 操作 ***********
      // // getPreEmitDiagnostics 预发出诊断包括语法、语义、全局、选项、配置文件分析，如果启用，则声明诊断。
      // const diagnostics = tsProject.getPreEmitDiagnostics();
      // if (diagnostics.length > 0) {
      //   consola.error(
      //     tsProject.formatDiagnosticsWithColorAndContext(diagnostics)
      //   );
      //   const err = new Error("代码中包含错误的类型声明，终止创建声明文件");
      //   consola.error(err);
      //   throw err;
      // }
      // // emitting 获取原始 TypeScript 文件并将它们输出为 JavaScript （ .js ） 和/或声明文件 （ .d.ts ） 的过程。
      // // 由于我们只需要生成 .d.ts 类型声明文件，所以可以指定 emitOnlyDtsFiles 标志为 true
      // await tsProject.emit({
      //   emitOnlyDtsFiles: true,
      // });
      // 路径改写逻辑
      // sourceFiles.length > 0 &&
      //   sourceFiles.forEach(async (sourceFile) => {
      //     /**
      //      * const emitOutput = sourceFile.getEmitOutput();
      //      * const emitFiles = emitOutput.getOutputFiles();
      //      * if (emitFiles.length === 0) {
      //      *  throw new Error(
      //      *     `创建失败： ${chalk.bold(sourceFile.getFilePath())}`
      //      *   );
      //      * }
      //      *
      //      * emitFiles.forEach(async (outputFile) => {
      //      *  const filePath = outputFile.getFilePath();
      //      *  const text = outputFile.getText();
      //      * }
      //      *
      //      * getEmitOutput
      //      * 方法用于获取 TypeScript 文件的发射输出（emitted output）。
      //      * 在 TypeScript 中，"发射" 是指将 TypeScript 代码转换成 JavaScript 代码的过程。
      //      * 这可能涉及到对模块、语法等进行转换，以便它们可以在浏览器或者 Node.js 环境中执行。
      //      *
      //      * getOutputFiles 返回一个数组
      //      * 方法用于获取发射输出中的所有文件。
      //      * 每个输出文件都将是一个字符串，其中包含了相应的代码内容。
      //      *
      //      * getFilePath
      //      * 用于获取文件的路径。对于一个源文件（SourceFile）来说，这通常会返回文件在磁盘上的绝对路径。
      //      *
      //      * getText
      //      * 用于获取文件的文本内容。对于一个源文件（SourceFile），这将返回文件中的所有文本，包括 TypeScript 代码、注释等
      //      */
      //     const emitOutput = sourceFile.getEmitOutput();
      //     const emitFiles = emitOutput.getOutputFiles();
      //     if (emitFiles.length === 0) {
      //       throw new Error(
      //         `创建失败： ${chalk.bold(sourceFile.getFilePath())}`
      //       );
      //     }
      //   });
    },
  };
};
