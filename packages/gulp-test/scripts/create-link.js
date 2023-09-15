const symlinkDir = require("symlink-dir");
const { resolve } = require("path");

const target = [
  {
    src: resolve(__dirname, "../build"),
    dest: "build",
  },
];

target.forEach((item) => {
  symlinkDir(item.src, resolve(__dirname, "../packages/components", item.dest));
  symlinkDir(
    item.src,
    resolve(__dirname, "../packages/theme-chalk", item.dest)
  );
  symlinkDir(item.src, resolve(__dirname, "../packages/utils", item.dest));
});
