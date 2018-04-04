<template>
  <div class="event__wrapper" :style="wrapperColor">
    <div class="event__warn" v-show="profile.isPM && event.isFinished && (event.ratio === 0 || event.realTime === 0 || event.approval === 0)"></div>
    <div class="event__process" :style="progress">
    </div>
    <div class="event__header">
      <div class="event__checkbox">
        <el-checkbox v-model="tempEvent.isFinished" v-if="isShowCheck" @change="checkChange"></el-checkbox>
      </div>
      <div class="event__desc" @click="showMask">{{event.desc}}</div>
      <user-avatar :username="event.members[0].username" :job="event.members[0].jobId" class="event__avatar"></user-avatar>
    </div>
    <div class="event__footer">
      <mini-tag :id="event.tags[0].id" :tagName="event.tags[0].name" class="event__tag"></mini-tag>
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
  },
  data() {
    return {
      bgColor: {},
      label: '',
      isShowMenu: false,
      tempEvent: this.event,
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
      if (this.tempEvent.isFinished) {
        return {
          backgroundColor: '#eee',
        };
      }
      return {};
    },
    /**
     * 只有事件的参与者才可以勾选checkbox
     */
    isShowCheck() {
      let members = this.event.members.map(m => m.id); //  获取事件参与者所有id
      let isJoinIn = members.indexOf(this.profile.userId) !== -1; // 是否被包含
      return this.profile.isPM || isJoinIn;
    },
  },
  methods: {
    showMask() {
      this.profile.isPM ?
        (this.isShowMenu = true) : this.$emit('updateEvent');
    },
    checkChange(value) {
      this.$emit('finishEvent', this.tempEvent.id, +value);
      this.getLabel();
    },
    getLabel() {
      const twoDay = 1000 * 60 * 60 * 24 * 2; // 2天
      let startTime = new Date(this.event.startTime);
      let endTime = new Date(this.event.endTime);
      let now = new Date();
      let bgColor = '#fff';
      if (this.tempEvent.isFinished) {
        this.label = '已完成';
        bgColor = '#3f51b5';
      } else if (now < startTime) {
        this.label = `${date.format(startTime, 'yyyy-MM-dd')}开始`;
        bgColor = '#20a0ff';
      } else if (now >= startTime && now <= endTime) {
        this.label = '进行中';
        bgColor = '#3f51b5';
        if (endTime - now < twoDay && endTime - now > 0) { // 离截止不足2天, 但未结束
          this.label = `${date.format(endTime, 'yyyy-MM-dd')}截止`;
          bgColor = '#E6434C';
        }
      } else if (now >= endTime) {
        this.label = '已逾期';
        bgColor = '#9e9e9e';
      }
      this.bgColor = {
        backgroundColor: bgColor,
      };
    },
  },
  mounted() {
    this.getLabel();
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
}
.event__avatar {
  @include setSize(28px, 28px);
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

