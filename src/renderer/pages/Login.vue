<template>
  <div id="login__wrapper">
    <el-form :model="loginForm" ref="loginForm" :rules="rules" :inline-message="true" :status-icon="false">
      <div class="input-group">
        <el-form-item class="form__item" prop="account">
          <my-input class="input" icon="account" placeholder="账号" v-model="loginForm.account"></my-input>
        </el-form-item>
        <el-form-item class="form__item" prop="password">
          <my-input class="input" type="password" icon="password" placeholder="密码" v-model="loginForm.password"></my-input>
        </el-form-item>
      </div>
      <div id="forget-pwd__wrapper">
        <router-link to="/forgetPwd" id="forget-pwd__link">忘记密码？</router-link>
      </div>
      <div id="btn-group">
        <el-button class="btn" type="info" id="login" @click="login('loginForm')">登录</el-button>
      </div>
      <div id="login__footer">
        <div id="register__wrapper">
          <router-link to="/register" id="register__link">没有账号？前往注册</router-link>
        </div>
        <div id="auto-login__wrapper">
          <span id="auto-login__label">15天自动登录</span>
          <el-switch v-model="loginForm.autoLogin" active-color="#AABBFD" inactive-color="#c1c1c1" :width="45"></el-switch>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getCookie } from '@/utils';
import MyInput from '../components/Input';

export default {
  components: {
    'my-input': MyInput,
  },
  data() {
    return {
      loginForm: {
        account: '',
        password: '',
        autoLogin: false,
      },
    };
  },
  computed: mapState(['profile', 'rules']),
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.$users.login(this.loginForm, (data) => {
            this.updateProfile(data);
            this.$router.push('/');
          });
        } else {
          this.$message({
            type: 'error',
            message: '请检查格式',
            center: true,
          });
          return false;
        }
        return true;
      });
    },
    ...mapMutations(['updateProfile']),
  },
  /**
   * 在进入登录页面之前，检验是否存在token，若存在则进行自动登录
   */
  beforeRouteEnter(to, from, next) {
    getCookie('token')
      .then((token) => {
        next((vm) => {
          vm.$api.$users.autoLogin((data) => {
            vm.updateProfile(data);
            vm.$router.push('/');
          });
        });
      })
      .catch(error => next());
  },
};
</script>


<style lang="scss" scoped>
#login__wrapper {
  @include fullSize;
  @include flex(center);
}

.form__item {
  @include setSize(343px, 48px);
  margin-bottom: 10px;
}

#btn-group {
  .btn {
    @include setSize(343px, 48px);
    background-color: $default;
    &:hover {
      opacity: 0.9;
    }
  }
}

#login {
  color: #fff;
}

#forget-pwd__wrapper,
#login__footer {
  display: inline-block;
  @include setSize(343px, auto);
}

#forget-pwd__link,
#register__link {
  line-height: 17px;
  font-size: 12px;
  text-decoration: none;
  color: $default;
}

#forget-pwd__link,
#auto-login__wrapper {
  float: right;
}

#auto-login__label {
  color: #9e9e9e;
  margin-right: 11px;
}

#register__wrapper {
  float: left;
}

#login__footer {
  margin-top: 4px;
  font-size: 12px;
}
</style>
