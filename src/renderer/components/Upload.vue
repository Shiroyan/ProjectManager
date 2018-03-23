<template>
  <div id="upload__wrapper">
    <span @click="upload" id="upload__btn">
      {{file === '' ? '点击上传' : '重新上传'}}
    </span>
    <input type="file" ref="input" @change="change" id="upload__input" accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
    <span id="upload__filename">{{filename}}</span>
  </div>

</template>

<script>
export default {
  data() {
    return {
      file: '',
    };
  },
  computed: {
    filename() {
      if (this.file) {
        let name = this.file.name;
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
    upload() {
      this.$refs.input.click();
    },
    change({ target }) {
      let file = target.files[0];
      this.file = file || '';
      this.$emit('input', this.file);
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

