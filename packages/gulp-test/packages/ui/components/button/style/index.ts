/**
 * 如果不写该 ts 文件，则可能会存在一下场景，举例：
 *      假设条件：
 *          1.当前组件库中的ui组件 button内部中依赖了 icon组件
 *          2.用户想要以 按需引入 的方式引入 button 组件
 *      这时候用户使用时是不清楚 button 内部依赖了什么组件，
 *      可能只知道需要引入 button组件以及 button 组件的样式
 *      但是事实在button 组件开发时，内部依赖了icon组件，这是就会导致button组件内部的 icon组件 样式丢失
 *
 *      所以创建该 .ts 文件的目的：
 *          1. 在这个文件中引入所有依赖的组件的样式文件
 *          2. 可以直接使用由打包工具提供的路径解析功能
 *          3. 生成声明文件有代码提示
 *          4. 配合其他工具使用
 */

import "element-plus/es/components/button/style/css";
// 公共主题样式
// 每个组件都需要进行引入，保持每个组件的独立
import "@jaycce/gulp-theme-chalk/index";
