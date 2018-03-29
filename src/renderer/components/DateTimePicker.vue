<template>
  <el-date-picker id="start-end-range" @change="change" v-model="val" type="datetimerange" align="center" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" range-separator="~" value-format="yyyy-MM-dd hh:mm:ss" :default-time="['8:00:00', '23:59:59']" :picker-options="pickerOptions">
  </el-date-picker>
</template>

<script>
export default {
  name: 'DateTimePicker',
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    pickerOptions: {
      type: Object,
      default() {
        return {
          firstDayOfWeek: 1,
        };
      },
    },
  },
  data() {
    return {
      val: this.value.slice(0),
    };
  },
  methods: {
    change(value) {
      this.$emit('input', value);
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

