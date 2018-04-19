<template>
  <div class="daily-item__wrapper">
    <div class="timeline__point"></div>
    <el-button icon="el-icon-edit" type="text" class="daily-item__edit" v-if="isMenuVisible && mode === READ" @click="editMode"></el-button>
    <el-button icon="el-icon-delete" type="text" class="daily-item__delete" v-if="isMenuVisible && mode === READ" @click="deleteDaily"></el-button>
    <transition name="el-zoom-in-top">
      <div class="daily-item--edit" v-if="mode === EDIT">
        <div class="form__item">
          <div class="form__label">日期</div>
          <div class="daily-date">{{dailyDate}}</div>
        </div>
        <div class="no-event-tips" v-show="events.length === 0">* 若出现没有事件填写的情况, 则之前汇报的事件已被删除</div>
        <div class="form__item" v-for="e in events" :key="e.id">
          <div class="form__label">
            {{e.desc}}
          </div>
          <span class="title">{{e.projectName}}</span>
          <el-input-number v-model="e.dailyRealTime" :controls="false" @change="genBaseContent"></el-input-number>
        </div>
        <div class="form__item">
          <div class="form__label">内容</div>
          <el-input v-model="dailyContent" type="textarea" resize="none" size="mini" :autosize="{minRows: 4}"></el-input>
        </div>
        <div class="form__btn-group">
          <el-button class="cancel" @click="mode = READ" size="small">取消</el-button>
          <el-button class="submit" @click="updateDaily" type="primary" size="small">修改</el-button>
        </div>
      </div>
      <div class="daily-item" v-html="daily.content" v-else>
      </div>
    </transition>
  </div>
</template>
<script>
import { date } from '@/utils';

const MON = date.getWeekStart();
const SUN = date.getWeekEnd();

export default {
  name: 'DailyItem',
  props: {
    isMenuVisible: {
      type: Boolean,
      required: true,
    },
    READ: {
      default: 1,
    },
    EDIT: {
      default: 2,
    },
    daily: {
      type: Object,
      default() {
        return {
          id: -1,
          content: '',
          date: new Date(),
        };
      },
    },
  },
  data() {
    return {
      mode: this.READ,
      events: [],
      dailyContent: '',
    };
  },
  computed: {
    dailyDate() {
      return date.format(new Date(this.daily.date), 'yyyy年MM月dd日');
    },
  },
  methods: {
    genBaseContent() {
      let content = this.events.map(({ desc, dailyRealTime }) => `${desc} —— ${dailyRealTime}h`);
      this.dailyContent = content.join('\n');
    },
    editMode() {
      let dailyDate = date.format(new Date(this.daily.date), 'yyyy-MM-dd');
      this.$api.$daily.detail(this.daily.id, dailyDate, (data) => {
        this.events = data.events;
        this.dailyContent = data.content;
      });
      this.mode = this.EDIT;
    },
    updateDaily() {
      this.mode = this.READ;
      this.$emit('update', {
        dailyId: this.daily.id,
        date: new Date(this.daily.date),
        events: this.events,
        content: this.dailyContent,
      });
    },
    deleteDaily() {
      this.$emit('delete', this.daily.id, new Date(this.daily.date));
    },
  },
};
</script>
<style lang="scss" scoped>
.daily-item__wrapper {
  width: 50%;
  min-height: 26vh;
  padding: 0 20px 10px 40px;
  border-left: 7px solid $default;
  box-sizing: border-box;
  position: relative;
  div {
    box-sizing: border-box;
  }
}
.timeline__point {
  @include absTL(-2px, -15px);
  @include setSize(24px, 24px);
  border-radius: 12px;
  background-color: $default;
}

.daily-item__edit,
.daily-item__delete {
  position: absolute;
  top: 2px;
  font-size: 20px;
  padding: 0;
}

.daily-item__edit {
  color: $default;
  right: 40px;
}

.daily-item__delete {
  color: $danger;
  right: 0;
  &:hover,
  &:focus {
    opacity: 0.7;
    color: $danger;
  }
}

.daily-date {
  color: $black;
  font-size: 14px;
  text-align: center;
}

.daily-item--edit {
  .form__item {
    @include flex(flex-start);
    position: relative;
    margin-bottom: 15px;
    &:first-child {
      margin-bottom: 25px;
    }
  }

  .no-event-tips {
    margin-bottom: 15px;
    color: $danger;
    font-size: 14px;
  }
  .form__label {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 20px;
    font-size: 12px;
    color: $tips;
  }
  .title {
    @include setSize(100px, 20px);
    @include absBL(12px, -120px);
    display: none;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 2px;
    box-sizing: border-box;
    opacity: 0;
    text-align: center;
    z-index: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .form__label:hover + .title {
    display: block;
    opacity: 1;
    transition: opacity 2s ease-in-out;
  }
  .form__btn-group {
    margin: 20px 0 30px 80px;
  }
  .cancel {
    width: 100px;
    margin-right: 10px;
    color: $black;
    &:hover {
      background-color: $mask;
    }
  }
  .submit {
    width: 100px;
    background-color: $default;
    border: none;
    &:hover,
    &:focus {
      opacity: 0.9;
    }
  }
}
</style>

<style lang="scss">
.daily-item {
  h2 {
    margin: 0 0 40px 0;
    letter-spacing: 1px;
    font-weight: 500;
    color: $black;
  }
  p {
    color: $tips;
    font-size: 14px;
  }
}
.daily-item--edit {
  .el-input-number,
  .el-input,
  .el-input__inner {
    width: 100%;
    text-align: center;
  }
}
</style>

