# 项目管理系统

>DL 项目管理系统

#### 注意事项
1. 在打包的时候，注意修改 `/src/renderer/env.js` 中的`NOW`变量
2. 在`/src/renderer/api` 创建`config.js`配置接口地址
3. 在打包前记得在环境变量中设置`GH_TOKEN`，获取`GH_TOKEN`的具体方法: 访问 https://github.com/settings/tokens 并点击生成新令牌 (Generate new token)，设置环境变量的方法这里不赘述
4. 关于热更新慢的问题，可以尝试升级webpack到4.x版本，我尝试过会发生很多问题3.x和4.x还是有很多不一样的地方，若有精力，可以捣鼓一下~
5. 在`package.json`中找到以下代码，根据个人情况进行修改

    ```
    "publish": [
      {
        "provider": "github",
        "owner": "Shiroyan",     // 你的Github用户名
        "repo": "ProjectManager" // 你的仓库名
      }
    ```


#### 基本的使用方法

``` bash
# 安装项目依赖
npm install

# 运行代码，在生成的时候需要耗费5分钟左右~
npm run dev

# 打包应用，记得把NOW变量设置为CLIENT
export GH_TOKEN="xxxxxxxxxxxxx" //  linux, mac
npm run build

# 打包Web，记得把NOW变量设置为WEB
npm run build:web

# 修复代码的格式问题，在ESLint大量报错时，记得使用这条命令
npm run lint

```

---

本项目使用
- [electron-vue](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html)
- [electron-builder](https://www.electron.build/)

