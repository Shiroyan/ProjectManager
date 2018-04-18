<template>
  <div class="event__wrapper" :style="wrapperColor">
    <div class="event__warn" v-show="isLeader && event.isFinished && (event.ratio === 0 || event.realTime === 0 || event.approval === 0)"></div>
    <div class="event__process" :style="progress">
    </div>
    <div class="event__header">
      <div class="event__checkbox">
        <el-checkbox v-model="isFinished" v-if="isShowCheck" @change="checkChange"></el-checkbox>
      </div>
      <div class="event__desc" @click="showMask">{{event.desc}}</div>
      <user-avatar :username="event.members[0].username" :job="event.members[0].jobId" class="event__avatar"></user-avatar>
    </div>
    <div class="event__footer">
      <div>
        <mini-tag v-if="event.tags.length > 0" :id="event.tags[0].id" :tagName="event.tags[0].name" class="event__tag"></mini-tag>
      </div>
      <div class="event__time-label" :style="bgColor">{{label}}</div>
    </div>
    <div class="event__mask" v-show="isShowMenu">
      <el-button icon="el-icon-edit" type="text" id="edit" @click="isShowMenu=false; $emit('updateEvent')"></el-button>
      <el-button icon="el-icon-delete" type="text" id="delete" @click="isShowMenu=false; $emit('deleteEvent')"></el-button>
      <el-button icon="el-icon-close" type="text" id="cancel" @click="isShowMenu=false"></el-button>
    </div>
  </div>
</template>

<script>
import UserAvatar from '@/components/UserAvatar';
import MiniTag from '@/components/MiniTag';
import { date } from '@/utils';
import { mapState } from 'vuex';

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
          realTime: 0,
          approval: 0,
          ratio: 0,
        };
      },
    },
    isLeader: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isShowMenu: false,
    };
  },
  computed: {
    ...mapState(['profile']),
    progress() {
      return {
        height: `${this.event.process * 0.01 * 7.3206}vw`,
      };
    },
    wrapperColor() {
      if (this.event.isFinished) {
        return {
          backgroundColor: '#eee',
        };
      }
      return {};
    },
    isFinished: {
      get() {
        return this.event.isFinished;
      },
      set(v) {
      },
    },
    label() {
      const twoDay = 1000 * 60 * 60 * 24 * 2; // 2天
      let startTime = new Date(this.event.startTime);
      let endTime = new Date(this.event.endTime);
      let now = new Date();
      let label;
      if (this.isFinished) {
        label = '已完成';
      } else if (now < startTime) {
        label = `${date.format(startTime, 'yyyy-MM-dd')}开始`;
      } else if (now >= startTime && now <= endTime) {
        label = '进行中';
        if (endTime - now < twoDay && endTime - now > 0) { // 离截止不足2天, 但未结束
          label = `${date.format(endTime, 'yyyy-MM-dd')}截止`;
        }
      } else if (now >= endTime) {
        label = '已逾期';
      }
      return label;
    },
    bgColor() {
      const twoDay = 1000 * 60 * 60 * 24 * 2; // 2天
      let startTime = new Date(this.event.startTime);
      let endTime = new Date(this.event.endTime);
      let now = new Date();
      let bgColor = '#fff';
      if (this.isFinished) {
        bgColor = '#3f51b5';
      } else if (now < startTime) {
        bgColor = '#20a0ff';
      } else if (now >= startTime && now <= endTime) {
        bgColor = '#3f51b5';
        if (endTime - now < twoDay && endTime - now > 0) { // 离截止不足2天, 但未结束
          bgColor = '#E6434C';
        }
      } else if (now >= endTime) {
        bgColor = '#9e9e9e';
      }
      return {
        backgroundColor: bgColor,
      };
    },
    /**
     * 只有事件的参与者才可以勾选checkbox
     */
    isShowCheck() {
      let members = this.event.members.map(m => m.id); //  获取事件参与者所有id
      let isJoinIn = members.indexOf(this.profile.userId) !== -1; // 是否被包含
      return this.isLeader || isJoinIn;
    },
  },
  methods: {
    showMask() {
      this.isLeader ?
        (this.isShowMenu = true) : this.$emit('updateEvent');
    },
    checkChange(value) {
      this.$emit('finishEvent', this.event.id, +value);
    },
  },
  mounted() {
    // this.getLabel();
  },
};
</script>

<style lang="scss">
.event__wrapper {
  @include setSize(232px, 100px);
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 10px auto;
  padding: 5px;
  position: relative;
}
.event__warn {
  @include setSize(12px, 12px);
  @include absTR(-6px, -6px);
  border-radius: 6px;
  background-color: $danger;
}
.event__process {
  @include absTL(0, 0);
  width: 5px;
  border-radius: 5px;
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
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  margin-left: 8px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.event__avatar {
  height: 28px;
  min-width: 28px;
  line-height: 28px;
  font-size: 12px;
  float: right;
}
.event__footer {
  @include flex(space-between);
  padding: 0 5px;
}
.event__time-label {
  display: inline-block;
  font-size: 12px;
  line-height: 1.5;
  height: 16px;
  padding: 0 5px;
  color: #fff;
}
.event__mask {
  @include setSize(100%, 100%);
  @include absTL(0,0);
  @include flex(space-between);
  border-radius: 5px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0 30px;
  text-align: center;
  transition: all 0.3s ease-in-out;
  #edit,
  #cancel,
  #delete {
    color: #fff;
    font-size: 24px;
  }
}
</style>

<style lang="scss">
.el-checkbox {
  z-index: 0;
}
// .el-checkbox__inner::after {
//   border: 2px solid $black;
//   border-top-color: transparent;
//   border-left-color: transparent;
//   @include setSize(7px, 20px);
//   left: 9px;
//   top: -9px;
// }
// .el-checkbox__inner {
//   @include setSize(20px, 20px);
// }
// .el-checkbox__input.is-checked .el-checkbox__inner {
//   border: 2px solid $black;
//   background-color: #fff;
// }
</style>

