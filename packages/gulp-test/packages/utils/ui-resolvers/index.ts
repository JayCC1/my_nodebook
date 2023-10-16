import { kebabCase } from "unplugin-vue-components";
import type {
  ComponentResolver,
  SideEffectsInfo,
} from "unplugin-vue-components/types";

// 判断是否为 服务端渲染
const isSSR = Boolean(
  process?.env.SSR ||
    process?.env.SSG ||
    process?.env.VITE_SSR ||
    process?.env.VITE_SSG
);

// 服务端渲染使用 cjs 模块规范，反之使用 esm 模块
const moduleType = isSSR ? "lib" : "es";

// 解析器参数配置 类型
export interface UiResolverOptions {
  // 执行加载 css 还是 scss，默认加载 css
  importStyles?: boolean | "css" | "sass";
  // use commonjs lib & source css or scss for ssr
  // 默认为 false
  isSSR?: boolean;
}

// 解析器获取副作用函数
function getSideEffects(
  dirName: string,
  options: UiResolverOptions
): SideEffectsInfo | undefined {
  // 是否加载 样式文件
  const { importStyles = true } = options;
  if (!importStyles) return;

  const prefixPath = `@jaycce/gulp-components/${moduleType}/components/${dirName}/style`;
  console.log(`${prefixPath}/scss`);

  if (importStyles === "sass") {
    return `${prefixPath}/scss`;
  } else {
    return `${prefixPath}/index`;
  }
}

export const uiResolver = (
  options: UiResolverOptions = {}
): ComponentResolver => {
  return {
    type: "component", // 解析类型为组件
    resolve: (name: string) => {
      // 判断解析的组件名称是不是当前组件
      if (name.match(/^(J[A-Z]|j-[a-z])/)) {
        // kebabCase 用法举例： TableColumn -> table-column
        const partialName = kebabCase(
          name.startsWith("J") ? name.slice(1) : name.slice(2)
        );
        return {
          // 组件名称
          name,
          // 从那个路径中导入
          from: `@jaycce/gulp-components/${moduleType}`,
          // 导入组件的时候额外导入一些资源,拼接 import 的源码逻辑(https://github.com/unplugin/unplugin-vue-components/blob/main/src/core/utils.ts#L101)
          // 本库中我们用来根据组件名称获取到对于的 css 导入路径。
          sideEffects: getSideEffects(partialName, options),
        };
      }
    },
  };
};
