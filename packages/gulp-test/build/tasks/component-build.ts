import vuePlugin from "@vitejs/plugin-vue";
import { rollup } from "rollup";
import { resolve } from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { componentsRoot } from "../utils/paths";
import gulp from "gulp";

import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDefineOptions from "unplugin-vue-define-options/rollup";
import esbuild from "rollup-plugin-esbuild";
import { generateExternal } from "../utils/rollup-utils";

const { series } = gulp;

const buildEachComponent = async () => {
  const input = resolve(componentsRoot, "index.ts");
  const bundle = await rollup({
    input: input,
    plugins: [
      nodeResolve(),
      vueDefineOptions(),
      // @ts-ignore
      vueJsx(),
      // @ts-ignore
      vuePlugin(),
      esbuild({
        target: "esnext",
        sourceMap: true,
        loaders: {
          ".vue": "ts",
        },
      }),
    ],
    treeshake: false,
    external: generateExternal({ full: true }), // 外部模块，所有依赖都设置为外部模块
  });
  // 把 components 文件夹下的组件存在至 es 及 lib 文件夹下
  // 1. /es
  // 2. /lib
  console.log("bundle", bundle);

  // 输出文件
  // await Promise.all([]);
};

export const buildComponent = () => {
  return series(buildEachComponent);
};
