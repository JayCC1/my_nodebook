# 贡献代码

如果您热爱贡献，如果您乐于赋能，如果您有很多美妙的 idea 渴望与小伙伴们分享，那么请认真阅读以下内容，以下内容将告诉您如何舒适且标准地为 仓库 做出贡献

## 准备开发环境

| tool   | version |
| ------ | ------- |
| NodeJS | >= 18   |
| pnpm   | >= 8    |
| Git    | >= 2    |

## 克隆存储库

1. 通过点击右上角的 `Fork` 按钮把存储库添加到您的 github
2. 在您的 github 存储库中把项目 clone 到开发环境
3. 执行以下命令初始化项目

### class 命名规范

#### BEM 规范并且前缀增加统一的命名空间 `j`(`namespace-block__element--modifier`)

- `namespace` 统一的命名空间 `j`
- `-block` 代表组件名称
- `__element` 代表元素名称
- `--modifier` 代表状态

🌰 `<div class="j-alert"></div>`

🌰 `<div class="j-alert__bottom"></div>`

🌰 `<div class="j-alert__bottom__icon--show"></div>`

### 相关依赖介绍

如果你对该项目的相关依赖不是那么的了解，可阅读 [依赖介绍](./DEPEND.md)
