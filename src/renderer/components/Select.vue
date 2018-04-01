<template>
  <div id="select_container">
    <div class="icon">
      <i :class="icon"></i>
    </div>
    <el-select id="select" :placeholder="placeholder" v-model="val" popper-class="select__options">
      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      require: true,
    },
    placeholder: {
      type: String,
      require: true,
    },
    options: {
      type: Array,
      require: true,
    },
    value: [Number, String],
  },
  data() {
    return {
      // val: this.value,
    };
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(v) { this.$emit('input', v); },
    },
  },
  // methods: {
  //   change() {
  //     this.$emit('input', this.val);
  //   },
  // },
};
</script>

<style lang="scss">
#select_container {
  @include setSize(100%, 100%);
  @include flex(space-between);
  padding: 12px 13px;
  box-sizing: border-box;
  border-radius: 2px;
  background-color: #fff;
  font-size: 14px;
  text-align: center;
  box-shadow: 0px 0px 2px 0px rgba(193, 193, 193, 1);
  border: 1px solid #fff;
}

.icon {
  height: 24px;
}

#select {
  @include setSize(270px, 24px);
  border: none;
  padding: 0;
  text-align: center;
}

.select__options {
  margin-top: 10px !important;
}
</style>