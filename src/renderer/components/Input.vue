<template>
  <div id="input__container">
    <div class="icon">
      <i :class="icon"></i>
    </div>
    <el-input id="input" :clearable="clearable" :type="type" :placeholder="placeholder" :maxlength="maxlength" v-model.trim="val">
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      require: true,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      require: true,
    },
    maxlength: {
      type: Number,
      default: 12,
    },
    value: [String, Number],
  },
  data() {
    return {
      // val: this.value,
    };
  },
  computed: {
    val: {
      get() { return this.value; },
      set(v) {
        this.$emit('input', v);
      },
    },
  },
  // watch: {
  //   val(newVal, oldVal) {
  //     this.$emit('input', newVal);
  //   },
  // },
};
</script>

<style lang="scss">
#input__container {
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

#input {
  @include setSize(270px, 24px);
  border: none;
  padding: 0;
  text-align: center;
}

#input:focus {
  border: none;
}
</style>