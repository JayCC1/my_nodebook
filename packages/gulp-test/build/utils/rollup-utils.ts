import { componentsPkg } from "./paths";
import { readFileSync } from "node:fs";
import parseJson from "parse-json";

// 获取 components 目录下的 package.json 中的信息
export const getCompPackage = () => {
  const { version, dependencies, peerDependencies } = parseJson(
    readFileSync(componentsPkg, "utf-8")
  );
  return {
    version,
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  };
};

// 设为外部依赖包
export const generateExternal = (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getCompPackage();

  const packages: string[] = peerDependencies;

  if (options.full) {
    packages.push(...dependencies);
  }

  return (id: string) => {
    return packages.some(
      (pkg) => id === pkg || (options.full && id.startsWith(`${pkg}`))
    );
  };
};

// 部分包直接使用引入 es 模块路径，在编译为 cjs 模块时时并不会自动处理
// 例: import xxx from 'lodash-es' 转换后为 var xxx = require('lodash-es)
// 这种情况则需要借助 rollup output 中的 path 属性进行处理
export const generateCjsPaths = () => {
  const paths: Array<string[]> = [
    ["lodash-es", "lodash"], // 目前暂时没有用到类似场景，所以不需要
    ["element-plus/es", "element-plus/lib"], // 目前暂时没有用到类似场景，所以不需要
  ];
  return (id: string) => {
    for (const [oldPath, newPath] of paths) {
      if (id.startsWith(oldPath)) {
        return id.replace(oldPath, newPath);
      }
    }
    return "";
  };
};
