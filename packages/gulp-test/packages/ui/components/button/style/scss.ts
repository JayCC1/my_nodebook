/**
 * 与 /style/index.ts 功能类似
 * 不过 index 时引入 .css
 * 而 本文件是 引入 .scss 文件
 * 看用户需求决定使用
 */

import "element-plus/es/components/button/style/index";
// 公共主题样式
// 每个组件都需要进行引入，保持每个组件的独立
import "@jaycce/gulp-theme-chalk/scss";
