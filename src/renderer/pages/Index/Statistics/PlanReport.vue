<template>
  <div id="report__wrapper">
    <div id="report__header">
      <div class="report__item" id="report__timerange">
        <div class="report__label">起止时间</div>
        <i class="el-icon-time"></i>
        <span class="report__val">{{plan.startTime}}</span> ~
        <i class="el-icon-time"></i>
        <span class="report__val">{{plan.endTime}}</span>
      </div>
      <div class="report__item--inline">
        <div class="report__label">可用/计划</div>
        <span class="report__val">{{plan.avaTime}}h</span> /
        <span class="report__val">{{plan.planTime}}h</span>
      </div>
      <div class="report__item--inline">
        <div class="report__label" title="> 0,忙 < 0,闲">空闲预警</div>
        <span class="report__val" :style="fontColor">{{plan.busyTime}}h</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanReport',
  props: {
    plan: {
      type: Object,
      required: true,
    },
  },
  computed: {
    fontColor() {
      let color = '#5e5e5e';
      if (this.plan.busyTime >= 8) { // >=8 忙，标红
        color = '#E51C23';
      }
      if (this.plan.busyTime <= -8) { // <=-8 闲, 标绿
        color = '#259B24';
      }
      return { color };
    },
  },
};
</script>

<style lang="scss" scoped>
#report__wrapper {
  padding-top: 50px;
  padding-left: 10px;
}
.report__item {
  margin-bottom: 20px;
}
.report__item--inline {
  display: inline-block;
  margin-right: 40px;
}
.report__label {
  color: $tips;
  display: inline-block;
  margin-right: 20px;
  font-size: 14px;
}
#report__timerange {
  .el-icon-time,
  .report__val {
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px;    
  }
  .el-icon-time {
    font-size: 16px;
  }
}
.report__val {
  color: $black;
  font-size: 14px;
}
</style>
