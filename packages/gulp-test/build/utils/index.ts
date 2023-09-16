/**
 * 子进程
 * child_process.spawn(command[, arg][, options])
 * command <string> 要运行的命令。
 * args <string[]> 字符串参数列表
 * options <Object>
 *  - cwd <string> | <URL> 子进程的当前目录
 *  - stdio <Array> | <string> 子进程的标准输入输出配置。'inherit'：通过响应的标准输入输出流/传出父进程
 * - shell <boolean> | <string> 如果是 true，则在 shell 内运行 command。在 Unix 上使用 '/bin/sh'，
 * 在 Windows 上使用    process.env.ComSpec。 可以将不同的 shell 指定为字符串。 请参阅 shell 的要求和默认的 Windows shell。 默认值: false （没有 shell）x
 */

import { spawn } from "child_process";
import { projectRoot } from "./paths";

// 在 node 中开启一个子进程来运行脚本
export const run = async (command: string) => {
  return new Promise((resolve) => {
    // 将命令分割 例如: rm -rf 分割为['rm', '-rf']，进行解构[amd, ...args]
    const [cmd, ...args] = command.split(" ");
    const app = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: "inherit",
      shell: true, // 默认情况下 linux 才支持 rm -rf ，window 可安装 rimraf
    });

    // 在进程已结束并且子进程的标准输入输出流已关闭之后，则触发 'close' 事件
    app.on("close", resolve);
  });
};

// 由于使用的是将 build 文件夹创建软连接的方式存在于需要打包的子工作空间中
// 所以打包时，需要把 build 文件忽略，所以提取方法统一处理
const needIgnoreCommonDir = "common";
export function buildInputIgnore(params: string | string[]) {
  if (typeof params === "string") {
    return [params, `!${needIgnoreCommonDir}/**`];
  } else {
    return [...params, `!${needIgnoreCommonDir}/**`];
  }
}
