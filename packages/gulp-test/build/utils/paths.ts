import { resolve } from "path";
import { cwd } from "process";

// gulp 项目的根目录
export const projectRoot = resolve(cwd(), "../../");

// gulp 打包输出目录
export const outDir = resolve(cwd(), "../../dist");

export const pkgRoot = resolve(projectRoot, "packages");

// **************** theme ****************
export const themeRoot = resolve(pkgRoot, "theme-chalk");

// **************** utils ****************
export const utilsRoot = resolve(pkgRoot, "utils");

// **************** components ****************
export const componentsRoot = resolve(pkgRoot, "ui");
export const componentsPkg = resolve(componentsRoot, "package.json");
export const componentsTsConfig = resolve(componentsRoot, "tsconfig.json");
