import type { ExtractPropTypes, PropType } from "vue";
export const buttonProps = {
  type: {
    type: String as PropType<
      "primary" | "success" | "warning" | "danger" | "info"
    >,
  },
};

export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
