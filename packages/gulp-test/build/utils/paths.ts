import { resolve } from "path";

// gulp 项目的根目录
export const projectRoot = resolve(__dirname, "../../");

// gulp 打包输出目录
export const outDir = resolve(__dirname, "../../dist");

export const pkgRoot = resolve(projectRoot, "packages");

// **************** theme ****************
export const themeRoot = resolve(pkgRoot, "theme-chalk");

// **************** utils ****************
export const utilsRoot = resolve(pkgRoot, "utils");

// **************** components ****************
export const componentsRoot = resolve(pkgRoot, "components");
export const componentsPkg = resolve(componentsRoot, "package.json");
