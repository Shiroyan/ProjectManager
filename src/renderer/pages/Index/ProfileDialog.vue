<template>
  <el-dialog :visible.sync="_isVisible" title="修改个人信息" center width="26.354vw" custom-class="profile-dialog">
    <el-form :model="profileForm" ref="profileForm" :rules="rules" :status-icon="false">
      <div class="input-group">
        <el-form-item class="form__item" v-if="profile.isAdmin">
          <my-input class="input" type="password" icon="password" placeholder="新密码，不输入代表不更改" v-model="profileForm.newPwd"></my-input>
        </el-form-item>
        <el-form-item class="form__item" prop="username">
          <my-input class="input" icon="username" placeholder="请输入姓名，3 - 12个字" v-model="profileForm.username"></my-input>
        </el-form-item>
        <el-form-item class="form__item" prop="city">
          <my-select class="input" icon="city" placeholder="请选择城市" v-model="profileForm.city" :options="options.citys"></my-select>
        </el-form-item>
        <el-form-item class="form__item" prop="dep">
          <my-select class="input" icon="department" placeholder="请选择部门" v-model="profileForm.dep" :options="options.deps"></my-select>
        </el-form-item>
        <el-form-item class="form__item" prop="job">
          <my-select class="input" icon="job" placeholder="请选择岗位" v-model="profileForm.job" :options="options.jobs"></my-select>
        </el-form-item>
        <el-form-item class="form__item" prop="role" v-if="profile.isAdmin">
          <my-select class="input" icon="job" placeholder="请选择角色" v-model="profileForm.role" :options="options.roles"></my-select>
        </el-form-item>
      </div>
      <div id="btn-group">
        <el-button class="btn" id="cancel" @click="_isVisible = false">取消</el-button>
        <el-button class="btn" type="info" id="modify" @click="modify('profileForm')">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import MyInput from '@/components/Input';
import MySelect from '@/components/Select';

export default {
  name: 'ProfileDialog',
  components: {
    'my-input': MyInput,
    'my-select': MySelect,
  },
  props: {
    id: {
      type: Number,
      default: undefined,
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object,
      default() {
        return {
          username: '',
          city: -1,
          dep: -1,
          job: -1,
          role: 2,
          newPwd: '',
        };
      },
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState(['options', 'rules', 'profile']),
    _isVisible: {
      get() { return this.isVisible; },
      set(newVal) { this.$emit('update:isVisible', newVal); },
    },
    profileForm: {
      get() {
        return this.form;
      },
      set(v) { },
    },
  },
  methods: {
    modify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.profile.isAdmin ?
            this.$emit('updateProfile', this.id, this.profileForm)
            :
            this.$emit('updateProfile', this.profileForm);
          this._isVisible = false;
        } else {
          this.$message({
            type: 'error',
            message: '请检查资料填写是否正确',
            center: true,
          });
          return false;
        }
        return true;
      });
    },
    ...mapMutations(['updateOptions']),
  },
  mounted() {
    this.options.citys.length === 0 &&
      this.$api.$users.options((data) => {
        this.updateOptions(data);
      });
  },
};
</script>

<style lang="scss" scoped>
.form__item {
  @include setSize(310px, 48px);
  box-sizing: border-box;
  margin-bottom: 20px;
}

#btn-group {
  @include setSize(310px, 48px);
  display: inline-block;
  .btn {
    @include setSize(150px, 36px);
    padding: 6px 0;
  }
  margin-top: 24px;
}

#modify {
  color: #fff;
  float: right;
  background-color: $default;
  &:hover {
    opacity: 0.9;
  }
}

#cancel {
  color: #9e9e9e;
}
</style>


