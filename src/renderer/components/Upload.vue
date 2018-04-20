<template>
  <div id="upload__wrapper">
    <span @click="$refs.input.click()" id="upload__btn">
      {{val.name === '' ? '点击上传' : '重新上传'}}
    </span>
    <input type="file" ref="input" @change="change" id="upload__input">
    <span id="upload__filename">{{filename}}</span>
  </div>

</template>

<script>
export default {
  props: {
    value: {
      type: [Object, File],
      required: true,
    },
  },
  data() {
    return {
      val: this.value,
    };
  },
  computed: {
    filename() {
      if (this.val) {
        let name = this.val.name;
        if (name.length > 8) {
          let reg = /\..+/g;
          let ext = name.match(reg)[0];
          name = `${name.substr(0, 4)}……${ext}`;
        }
        return name;
      }
      return '';
    },
  },
  methods: {
    change({ target }) {
      let file = target.files[0];
      this.val = file;
      this.$emit('input', file);
    },
  },
};
</script>

<style lang="scss" scoped>
#upload__wrapper {
  font-size: 14px;
}
#upload__btn {
  cursor: pointer;
  color: $default;
}
#upload__input {
  @include setSize(0,0);
  visibility: hidden;
}
#upload__filename {
  display: inline-block;
  margin-left: 12px;
  color: $black;
}
</style>

