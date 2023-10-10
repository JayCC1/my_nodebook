// 这里放组件的props及公共方法
import type { ExtractPropTypes, Component, PropType } from "vue";
//  as const，会让对象的每个属性变成只读（readonly）
export const iconProps = {
  size: {
    type: Number,
  },
  color: {
    type: String,
  },
  component: {
    type: Object as PropType<Component>,
    default: null,
  },
};

export type IconProps = ExtractPropTypes<typeof iconProps>;
