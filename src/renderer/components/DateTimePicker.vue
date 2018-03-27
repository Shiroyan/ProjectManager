<template>
  <el-date-picker id="start-end-range" 
    v-model="_value" 
    type="datetimerange"
    align="center"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    format="yyyy-MM-dd" 
    range-separator="~" 
    value-format="yyyy-MM-dd hh:mm:ss"
    :default-time="['8:00:00', '23:59:59']"
    :picker-options="{firstDayOfWeek: 1}">
  </el-date-picker>
</template>

<script>
export default {
  name: 'DateTimePicker',
  props: {
    value: {
      type: Array,
      default: [],
    },
  },
  computed: {
    _value: {
      get() {
        return Array.from(this.value);
      },
      set(v) {
        this.$emit('input', v);
      },
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

