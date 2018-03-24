<template>
  <div class="input--sb__container">
    <input type="text" :placeholder="placeholder" class="input--sb__content" v-model="val" @input="input" :maxlength="maxlength">
  </div>
</template>

<script>
export default {
  name: 'sb-input', //..Single Border Input
  props: {
    value: [Number, String],
    placeholder: [String],
    maxlength: { type: Number, default: 12 },
    type: { type: String, default: 'string' },
  },
  data() {
    return {
      val: this.value,
    };
  },
  methods: {
    input() {
      this.type === 'number' && (this.val = +this.val);
      this.$emit('input', this.val);
    },
  },
};
</script>

<style lang="scss" scoped>
.input--sb__content {
  @include setSize(100%, 30px);
  box-sizing: border-box;
  padding: 8px;
  border: none;
  border-bottom: 2px solid $border;
  outline: none;
  &:focus {
    border-bottom-color: $default;
    transition: all 0.3s ease-in-out;
  }
}
</style>

<style lang="scss">
.input--sb__container + .el-form-item__error {
  left: 15px;
}
</style>

