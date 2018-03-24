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
  </div>
</template>

<script>
export default {
  name: 'projectManager',
};
</script>

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
