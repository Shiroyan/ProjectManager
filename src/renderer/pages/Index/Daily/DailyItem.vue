<template>
  <div class="daily-item__wrapper">
    <div class="timeline__point"></div>
    <el-button icon="el-icon-edit" type="text" class="daily-item_edit" v-if="isMenuVisible" @click="editMode"></el-button>
    <transition name="el-fade-in-linear" mode="out-in">
      <div class="daily-item--edit" v-if="mode === EDIT">
        <el-date-picker v-model="date" :picker-options="pickerOptions" type="date" align="center" placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="daily-item" v-else>
        <h2>04月11日</h2>
        <p>日报前端页面撰写 -8h</p>
        <p>日报接口Api - 12h</p>
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
  },
  data() {
    return {
      mode: this.READ,
      events: [],
      date: new Date(),
      pickerOptions: {
        disabledDate(time) {
          return time > SUN || time < MON;
        },
      },
    };
  },
  methods: {
    getEvent() {
      this.$api.$events.get();
    },
    editMode() {
      this.mode = this.EDIT;
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
.daily-item_edit {
  @include absTR(2px, 0);
  font-size: 20px;
  padding: 0;
  color: $default;
}

.daily-item {
  h2 {
    margin: 0 0 40px 0;
    letter-spacing: 2px;
  }
  p {
    color: $tips;
    font-size: 14px;
  }
}
</style>

