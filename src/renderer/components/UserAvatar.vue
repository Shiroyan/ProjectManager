<template>
  <div class="user__avatar" ref="userAvatar">
    {{_username}}
    <slot name="mask"></slot>
  </div>
</template>
<script>
/**
 * User Avatar用户头像， 根据jobId进行着色， 一共有16个岗位，每个岗位对应一个颜色
 */

const colors = [
  '#212121', //..管理员
  '#009688', //..Android
  '#2196f3', //..IOS
  '#f44336', //..JAVA
  '#ff9800', //..MKT
  '#e91e63', //..PM
  '#1b5e20', //..Test
  '#f50057', //..UX
  '#f50057', //..UI
  '#673ab7', //..Web
  '#1a237e', //..OPR
  '#673ab7', //..WEB PD
  '#f44336', //..JAVA PD
  '#f50057', //..UI PD
  '#f50057', //..UX PD
];

export default {
  props: {
    username: {
      type: String,
      required: true,
    },
    job: {
      type: Number,
      required: true,
    },
  },
  computed: {
    _username() {
      return this.username.length > 2 ? this.username.substr(1) : this.username;
    },
    bgColor() {
      let bgColor = colors[this.job];
      this.$refs.userAvatar && (this.$refs.userAvatar.style.backgroundColor = bgColor);
      return bgColor;
    },
  },
  updated() {
    this.$refs.userAvatar.style.backgroundColor = this.bgColor;
  },
  mounted() {
    this.$refs.userAvatar.style.backgroundColor = this.bgColor;
  },
};
</script>
<style lang="scss">
.user__avatar {
  @include setSize(36px, 36px);
  box-sizing: border-box;
  background-color: $default;
  border-radius: 18px;
  color: #fff;
  text-align: center;
  line-height: 36px;
  overflow: hidden;
}
</style>
