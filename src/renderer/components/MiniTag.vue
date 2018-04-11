<template>
  <div class="tag__wrapper">
    <div class="tag__icon" :style="style"></div>
    <div class="tag__name">{{tagName}}</div>
  </div>
</template>

<script>
/**
 *  根据传入的tagId 进行相应的着色
 */
const colors = [
  '#212121', //..管理员
  '#673ab7', //..Web
  '#f44336', //..JAVA
  '#1b5e20', //..Test
  '#e91e63', //..PM
  '#009688', //..Android
  '#2196f3', //..IOS
  '#f50057', //..UX
  '#f50057', //..UI
  '#ff9800', //..MKT
  '#1a237e', //..OPR
];

export default {
  name: 'MiniTag',
  props: {
    tagName: {
      type: String,
      default: '',
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    style() {
      return {
        backgroundColor: colors[(this.id % 11)],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.tag__wrapper {
  display: inline-block;
}
.tag__icon {
  @include setSize(8px, 8px);
  box-sizing: border-box;
  border-radius: 4px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
.tag__name {
  font-size: 12px;
  line-height: 14px;
  color: $black;
  display: inline-block;
  vertical-align: middle;
}
</style>
