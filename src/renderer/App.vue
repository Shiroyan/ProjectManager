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
        <div class="item">
          <span class="label">大小</span>
          <span class="value">{{size}} MB</span>
        </div>
        <div class="item">
          <span class="label">速度</span>
          <span class="value">{{speed}} kb/s</span>
        </div>
        <div class="item">
          <span class="label">进度</span>
          <el-progress id="progress" :text-inside="true" :stroke-width="18" :percentage="percent"></el-progress>
        </div>
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
    if (this.$electron) {
      const ipcRenderer = this.$electron.ipcRenderer;
      //  输出更新日志
      ipcRenderer.on('UPDATE_LOG', (event, arg) => {
        console.log(arg); //  eslint-disable-line
      });

      //  展示更新日志
      ipcRenderer.once('VERSION_INFO', (event, info) => {
        this.$msgbox({
          title: `V${info.version} 更新日志`,
          message: info.releaseNotes,
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          showClose: false,
          confirmButtonText: '立即下载',
          cancelButtonText: '不了',
        }).then(() => {
          ipcRenderer.send('DOWNLOAD');
          this.isVisible = true;
        }).catch(() => {
          ipcRenderer.send('CANCEL_UPDATE');
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
          showClose: false,
        }).then(() => {
          ipcRenderer.send('QUIT_AND_INSTALL');
        }).catch(() => {
          ipcRenderer.send('INSTALL_AFTER_QUIT');
        });
      });
    }
  },
};
</script>

<style lang="scss" scoped>
#download__info {
  @include setSize(300px, 200px);
  @include fixedBR(0, 0);
  @include flex(center);
  background-color: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  color: #fff;
  font-size: 14px;
  & > div {
    width: 80%;
  }
  .item {
    margin-bottom: 2vh;
  }
  .label {
    display: inline-block;
    margin-right: 10px;
  }
  .value {
    display: inline-block;
  }
  #progress {
    background-color: $default;
    width: 60%;
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
