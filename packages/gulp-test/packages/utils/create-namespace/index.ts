export const namespace = "j";
export const statePrefix = "j-is";

const createBEM = (
  common: string,
  element: string,
  modifier: string
): string => {
  const c = `${namespace}-${common}`;
  const e = `__${element}`;
  const m = `--${modifier}`;
  return `${c}${element ? e : ""}${modifier ? m : ""}`;
};

/**
 * 命名规范 BEM规范
 * <div class="j-cell">
 *     <div class="j-cell__label"></div>
 *     <div class="j-cell__value"></div>
 * </div>
 *
 * <div class="j-cell j-cell--show">
 *     <div class="j-cell__label"></div>
 *     <div class="j-cell__value"></div>
 * </div>
 *
 * @example
 * const { bem, is } = useNamespace('example')
 *
 * bem() // 'j-example'
 * bem('alert') // 'j-example__alert'
 * bem('alert', 'primary') // 'j-example__alert--primary'
 * bem('alert__button', 'primary') // 'j-example__alert__button--primary'
 *
 * is({primary:true}) // ['j-is--primary']
 * is('warning') // ['j-is--warning']
 * is({primary:true}, 'warning') // ['j-is--primary', 'j-is--warning']
 * -------------------------- */
export const createNamespace = (common: string) => {
  const bem = (element?: string, modifier?: string): string => {
    const e = element || "";
    const m = modifier || "";
    return createBEM(common, e, m);
  };

  const is = (
    ...args: Array<{ [key: string]: boolean } | string>
  ): string[] => {
    const map: string[] = [];
    args.forEach((item) => {
      if (typeof item === "object") {
        map.push(
          ...Object.entries(item).map(([key, val]) => {
            if (!val) {
              return "";
            }
            return `${statePrefix}--${key}`;
          })
        );
      } else {
        map.push(`${statePrefix}--${item}`);
      }
    });
    return map;
  };

  return {
    prefixedName: bem(),
    bem,
    is,
  };
};
