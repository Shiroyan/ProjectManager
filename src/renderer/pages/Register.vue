<template>
  <div id="register__wrapper">
    <el-form :model="registerForm" ref="registerForm" :rules="rules" :inline-message="true" :status-icon="false">
      <div class="input-group">
        <el-form-item class="form__item" prop="account">
          <my-input class="input" icon="account" placeholder="请输入账号，6 - 12个字" v-model="registerForm.account"></my-input>
        </el-form-item>
        <el-form-item class="form__item" prop="password">
          <my-input class="input" type="password" icon="password" placeholder="请输入密码，6 - 12个字" v-model="registerForm.password"></my-input>
        </el-form-item>
        <el-form-item class="form__item" prop="username">
          <my-input class="input" icon="username" placeholder="请输入姓名，3 - 12个字" v-model="registerForm.username"></my-input>
        </el-form-item>
        <el-form-item class="form__item" prop="city">
          <my-select class="input" icon="city" placeholder="请选择城市" v-model="registerForm.city" :options="options.citys"></my-select>
        </el-form-item>
        <el-form-item class="form__item" prop="dep">
          <my-select class="input" icon="department" placeholder="请选择部门" v-model="registerForm.dep" :options="options.deps"></my-select>
        </el-form-item>
        <el-form-item class="form__item" prop="job">
          <my-select class="input" icon="job" placeholder="请选择岗位" v-model="registerForm.job" :options="options.jobs"></my-select>
        </el-form-item>
      </div>
      <div id="btn-group">
        <el-button class="btn" id="cancel" @click="cancel">取消</el-button>
        <el-button class="btn" type="info" id="register" @click="register('registerForm')">注册</el-button>
      </div>
      <div id="login__wrapper">
        <router-link to="/login" id="login__link">已有账号？ 去登录</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import MyInput from '../components/Input';
import MySelect from '../components/Select';

export default {
  components: {
    'my-input': MyInput,
    'my-select': MySelect,
  },
  data() {
    return {
      registerForm: {
        account: '',
        password: '',
        username: '',
        city: undefined,
        dep: undefined,
        job: undefined,
      },
    };
  },
  computed: mapState(['options', 'rules']),
  methods: {
    register(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.$users.register(this.registerForm, (data) => {
            this.$router.push('/login');
          });
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
    cancel() {
      this.$router.go(-1);
    },
    ...mapMutations(['updateOptions']),
  },
  mounted() {
    if (this.options.citys.length === 0
      || this.options.deps.length === 0
      || this.options.jobs.length === 0) {
      this.$api.$users.options((data) => {
        this.updateOptions(data);
      });
    }
  },
};
</script>


<style lang="scss" scoped>
#register__wrapper {
  @include fullSize;
  @include flex(center);
}

.form__item {
  @include setSize(343px, 48px);  
  margin-bottom: 10px;
}

#btn-group {
  @include setSize(343px, 48px);
  display: inline-block;
  .btn {
    @include setSize(160px, 48px);
  }
  margin-top: 4px;
}

#register {
  color: #fff;
  float: right;
}

#cancel {
  color: #9e9e9e;
}

#login__wrapper {
  margin-top: 10px;
  @include setSize(343px, 23px);
}

#login__link {
  text-decoration: none;
  color: $default;
  font-size: 12px;
  line-height: 17px;
  float: right;
}
</style>
