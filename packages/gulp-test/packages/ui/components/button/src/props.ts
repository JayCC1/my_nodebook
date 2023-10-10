import type { ExtractPropTypes, PropType } from "vue";
export const buttonProps = {
  type: {
    type: String as PropType<
      "primary" | "success" | "warning" | "danger" | "info"
    >,
  },
};

export const buttonEmits = {
  click: (e: MouseEvent) => e instanceof MouseEvent,
};

export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
export type ButtonEmits = ExtractPropTypes<typeof buttonEmits>;
