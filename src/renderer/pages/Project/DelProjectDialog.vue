<template>
  <el-dialog :visible.sync="_isVisible" center width="29vw" custom-class="del-project-dialog">
    <div id="content">
      <div id="danger__tips">
        <i class="el-icon-warning" id="danger__icon"></i>
        <div id="danger__title">确认删除该项目么？</div>
      </div>
    </div>
    <el-input id="input" v-model="input" placeholder="请输入该项目名称以确认" clearable></el-input>
    <div slot="footer">
      <p id="danger__desc">该操作不可逆，项目下所有事件计划都会被清除！</p>
      <el-button type="danger" id="ensure" @click="ensure">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DelProjectDialog',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      input: '',
    };
  },
  computed: {
    _isVisible: {
      get() { return this.isVisible; },
      set(newVal) { this.$emit('update:isVisible', newVal); },
    },
  },
  methods: {
    ensure() {
      if (this.input === this.projectName) {
        this.$emit('deleteProject');
      } else {
        this.$message({
          type: 'error',
          message: '项目名错误',
          center: true,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#content {
  text-align: center;
  margin-bottom: 30px;
}

#danger__icon {
  font-size: 48px;
  color: $danger;
  vertical-align: middle;
  margin-right: 18px;
}

#danger__title {
  color: #2e2e2e;
  font-size: 18px;
  display: inline-block;
}

#danger__desc {
  margin-top: 10px;
  font-size: 12px;
  color: $danger;
}

#ensure {
  @include setSize(150px, 36px);
  padding: 6px 0;
  &:hover {
    opacity: 0.9;
  }
  margin-top: 20px;
}
</style>

<style lang="scss">
.del-project-dialog {
  .el-input {
    text-align: center;
  }
  .el-input__inner {
    width: 200px;
    color: $danger;
    &:focus {
      border: 1px solid $danger;
    }
  }
}
</style>


