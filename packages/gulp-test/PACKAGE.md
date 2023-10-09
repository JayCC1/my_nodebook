### main

commonJs 引用路径,默认的入口文件

### module

ESM 规范的入口文件

### types

ts 语法引用类型 路径,类型声明的入口文件

### style

引入 style 路径

### jsdelivr

cdn 服务指定的字段
jsDelivr 是一个开源项目，它的主要目的是为开发者提供一个免费的、开源的 CDN。它的优势在于，它是开源的，开发者可以自由地使用和贡献代码。另外，jsDelivr 在中国大陆有官方的镜像站点，这使得在中国大陆访问 jsDelivr 的资源会比较快

### unpkg

cdn 服务指定的字段
商业 CDN 服务，它的目的是为 npm 包提供快速的 CDN 分发。unpkg 会自动从 npm 缓存中寻找资源并提供 CDN 服务。这使得当你在项目中使用 npm 包的时候，可以直接使用 unpkg 的 URL 来获取到这个 npm 包，而不需要从 npm 的服务器上下载。unpkg 的优势在于它是基于 npm 的，因此它能够很好地和 npm 包一起工作。同时，unpkg 的 CDN 节点部署在 Cloudflare 上，并且在中国香港有节点，所以在一些地区访问速度会比较快

### exports

可以将模块的不同部分导出为不同的路径，这样其他模块在导入时可以选择性地引入需要的部分

```javascript
// 举个例子
// package.json
{
  "name": "my-module",
  "version": "1.0.0",
  "exports": {
    "./myFunction": "./myFunction.js"
  }
}

// 设置之后则可以通过 ``import { myFunction } from 'my-module/myFunction'`` 方式导入 myFunction

```

### files

用于指定当包作为依赖项安装时要包含的文件或目录。

```javascript
// 举例
{
  files: [".js", ".json"]; // 只有这两种文件被包含在安装的包中
  // 或者
  files: ["/dist", "global.d.ts"]; // 意味着当你发布你的 npm 包时，只有 /dist 目录和 global.d.ts 文件会被包含在发布的包中。

  // 注意，在 files 属性中定义的路径是相对于 package.json 文件的路径。
  // /dist 是指项目根目录下的 dist 目录
  // 不是 package.json 文件所在目录下的 dist 目录
  // 如果你希望指定相对于 package.json 文件的路径，你可以使用相对路径，例如 "dist"
  // 在 Monorepo 模式下，package.json 文件的 files 属性指向的是相对于各自 package.json 文件的路径
}
```

- 存在相同作用的有 `.gitignore` 以及 `.npmignore`
- **优先级**：`files` > `.npmignore` > `.gitignore`

### respository

用于指定项目的代码仓库。它包含了项目的源代码托管位置的信息，包括仓库的类型和 URL。
其他开发者可以通过这个信息找到项目的源代码，并且可以直接在代码仓库中查看和下载源代码。同时，也有助于自动化工具识别和操作。

### publishConfig

用于配置发布选项,其中，'access' 属性用于指定包的可见性级别。当设置为 'public' 时，表示包是公开的，可以被任何人查看和下载。
这个配置通常用于控制包在发布到 npm 仓库时的访问权限。除了 'public'，还可以设置为 'restricted' 表示受限制的访问权限，或者 'private' 表示私有包，只能被特定用户或团队访问。
