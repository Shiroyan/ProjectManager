<template>
  <el-date-picker id="start-end-range" v-model="val" type="datetimerange" align="center" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" range-separator="~" value-format="yyyy-MM-dd hh:mm:ss" :firstDayOfWeek="1" :default-time="['8:00:00', '23:59:59']">
  </el-date-picker>
</template>

<script>
export default {
  name: 'DateTimePicker',
  props: ['value'],
  data() {
    return {
      val: this.value,
    };
  },
  watch: {
    val(newVal, oldVal) {
      this.$emit('input', newVal);
    },
  },
};
</script>

<style lang="scss" scoped>
#start-end-range {
  width: 236px;
  padding: 0;
  border: none;
}
</style>

