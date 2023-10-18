// 改进类型声明,使用 Volar 获取代码提示
export {};

// Helper for Volar
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    // 组件声明
    JButton: typeof import("@jaycce/gulp-components")["JButton"];
    JIcon: typeof import("@jaycce/gulp-components")["JIcon"];
  }
  // interface ComponentCustomProps {
  //   // 指令声明
  // }
  // interface ComponentCustomProperties {
  //   // service声明
  // }
}
