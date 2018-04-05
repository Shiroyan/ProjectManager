<template>
  <div id="app">
    <transition mode="out-in" name="el-fade-in" :duration="250">
      <router-view></router-view>
    </transition>
    <transition mode="out-in" name="el-fade-in" :duration="250">
      <keep-alive>
        <router-view name="alive"></router-view>
      </keep-alive>
    </transition>
    <div id="download__info" v-if="isVisible">
      <div>
        <span class="label">大小</span>
        <span class="value">{{size}}</span>
      </div>
      <div>
        <span class="label">速度</span>
        <span class="value">{{speed}}</span>
      </div>
      <div>
        <span class="label">进度</span>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="percent"></el-progress>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'projectManager',
  data() {
    return {
      isVisible: false,
      speed: 0,
      percent: 0,
      size: 0,
    };
  },
  mounted() {
    const ipcRenderer = this.$electron.ipcRenderer;
    //  输出更新日志
    ipcRenderer.on('UPDATE_LOG', (event, arg) => {
      console.log(arg); //  eslint-disable-line
    });

    //  展示更新日志
    ipcRenderer.on('VERSION_INFO', (event, info) => {
      this.$msgbox({
        title: `V${info.version} 更新日志`,
        message: info.releaseNotes,
        dangerouslyUseHTMLString: true,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: '立即下载',
        cancelButtonText: '推迟',
      }).then(() => {
        ipcRenderer.send('DOWNLOAD');
        this.isVisible = true;
      });
    });

    //  展示下载信息
    ipcRenderer.on('DOWNLOAD_MESSAGE', (event, info) => {
      this.speed = info.speed;
      this.percent = info.percent;
      this.size = info.size;
    });

    //  提示下载完成
    ipcRenderer.on('DOWNLOADED', (event, info) => {
      this.isVisible = false;
      this.$confirm('新的安装包已下载好了, 请重启以更新 (≧∇≦)', '更新提示', {
        confirmButtonText: '重启更新',
        cancelButtonText: '等一下',
        type: 'info',
      }).then(() => {
        ipcRenderer.send('QUIT_AND_INSTALL');
      });
    });
  },
};
</script>

<style lang="scss" scoped>
#download__info {
  @include setSize(200px, 200px);
  @include fixedBR(10px 10px);
  background-color: $mask;
  box-sizing: border-box;
  font-size: 14px;
  & > div {
    margin: 0 auto 1vh auto;
  }
  .label {
    display: inline-block;
    margin-right: 10px;
  }
  .value {
    display: inline-block;
  }
}
</style>

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
}

html,
body {
  overflow: hidden;
}

body {
  margin: 0;
}
</style>
