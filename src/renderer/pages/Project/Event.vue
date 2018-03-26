<template>
  <div class="event__wrapper">
    <div class="event__process" :style="progress">
    </div>
    <div class="event__header">
      <div class="event__checkbox">
        <el-checkbox v-model="isFinished"></el-checkbox>
      </div>
      <div class="event__desc">アアああああ、きみさささささ</div>
      <user-avatar :username="event.members[0].username" :job="event.members[0].jobId" class="event__avatar"></user-avatar>
    </div>
    <div class="event__footer">
      <mini-tag :id="event.tags[0].id" :tagName="event.tags[0].name" class="event__tag"></mini-tag>
      <div class="event__time-label">03-12截止</div>
    </div>
  </div>
</template>

<script>
import UserAvatar from '@/components/UserAvatar';
import MiniTag from '@/components/MiniTag';

export default {
  components: {
    'user-avatar': UserAvatar,
    'mini-tag': MiniTag,
  },
  props: {
    event: {
      type: Object,
      default() {
        return {
          desc: '原型图绘制',
          members: [{ id: 13, jobId: 2, username: '小白' }],
          tags: [{ id: 1, name: 'Web' }],
          isFinished: false,
          process: 40,
          startTime: '2018-03-12 12:00:00',
          endTime: '2018-03-16 12:00:00',
          planTime: 40,
          approval: 0,
          ratio: 0,
        };
      },
    },
  },
  data() {
    return {
      isFinished: false,
    };
  },
  computed: {
    progress() {
      return {
        height: `${this.event.process * 0.01 * 7.3206}vw`,
      };
    },
  },
};
</script>

<style lang="scss">
.event__wrapper {
  @include setSize(232px, 100px);
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 5px;
  margin: 10px auto;
  padding: 5px;
  position: relative;
}
.event__process {
  @include absTL(0, 0);
  width: 5px;
  background-color: $success;
}
.event__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
}
.event__desc {
  @include setSize(128px, 70px);
  color: $black;
  font-size: 12px;
  line-height: 20px;
  margin-left: 8px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
.event__avatar {
  @include setSize(28px, 28px);
  line-height: 28px;
  font-size: 12px;
  float: right;
}
.event__footer {
  @include flex(space-between);
}
.event__time-label {
  font-size: 12px;
}
</style>

<style lang="scss">
.el-checkbox__inner::after {
  border: 2px solid $black;
  border-top-color: transparent;
  border-left-color: transparent;
  @include setSize(7px, 20px);
  left: 9px;
  top: -9px;
}
.el-checkbox__inner {
  @include setSize(20px, 20px);
}
.el-checkbox__input.is-checked .el-checkbox__inner {
  border: 2px solid $black;
  background-color: #fff;
}
</style>

