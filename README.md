# 项目管理系统

> DL 项目管理系统

#### 注意事项
-  web端和desktop端不同的地方在于 `utils/index.js` 和 `api/index.js`这2个文件
- 在打包的时候需要进行一些注释和修改
  1. 在`utils/index.js` 使用对应端的`getCookie`方法
  2. 在`api/index.js`中， 使用对应的端口地址

#### 基本的使用方法

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

本项目使用 [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[7c4e3e9](https://github.com/SimulatedGREG/electron-vue/tree/7c4e3e90a772bd4c27d2dd4790f61f09bae0fcef) using [vue-cli](https://github.com/vuejs/vue-cli). 
[文档地址](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
