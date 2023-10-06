import { withInstall } from "@jaycce/gulp-utils";
import Icon from "./src/icon.vue";

const JIcon = withInstall(Icon);

export * from "./src/props";
export { JIcon };
export default JIcon;
