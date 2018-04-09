<template>
  <div id="mod-pwd__wrapper">
    <el-form :model="modForm" ref="modForm" :rules="rules" :inline-message="true" :status-icon="false">
      <div class="input-group">
        <el-form-item class="form__item" prop="account">
          <my-input class="input" icon="account" placeholder="账号" v-model="modForm.account"></my-input>
        </el-form-item>
        <el-form-item class="form__item" prop="oldPwd">
          <my-input class="input" type="password" icon="password" placeholder="旧密码" v-model="modForm.oldPwd"></my-input>
        </el-form-item>
        <el-form-item class="form__item" prop="newPwd">
          <my-input class="input" type="password" icon="password" placeholder="新密码" v-model="modForm.newPwd"></my-input>
        </el-form-item>
      </div>
      <div id="forget-pwd__wrapper">
        <span id="forget-pwd__tips">如忘记密码，请联系管理员！</span>
      </div>
      <div id="btn-group">
        <el-button class="btn" id="cancel" @click="cancel">取消</el-button>
        <el-button class="btn" type="info" id="modify" @click="modify('modForm')">确定</el-button>
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
      modForm: {
        account: '',
        oldPwd: '',
        newPwd: '',
      },
    };
  },
  computed: mapState(['profile', 'rules']),
  methods: {
    modify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.$users.modifyPwd(this.modForm, () => {
            getCookie('token')
              .then(() => this.$api.$users.logout())
              .catch((error) => { });
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
    cancel() { this.$router.go(-1); },
  },
};
</script>


<style lang="scss" scoped>
#mod-pwd__wrapper {
  @include fullSize;
  @include flex(center);
}

.form__item {
  @include setSize(343px, 48px);
  margin-bottom: 10px;
}

#btn-group {
  .btn {
    @include setSize(160px, 48px);
    background-color: $default;
    &:hover {
      opacity: 0.9;
    }
  }

  #cancel {
    color: #fff;
    &:hover {
      color: #fff;
    }
  }
}

#modify {
  color: #fff;
  float: right;
}

#forget-pwd__wrapper {
  @include setSize(343px, auto);
  margin-bottom: 10px;
  overflow: hidden;
}

#forget-pwd__tips {
  line-height: 17px;
  font-size: 12px;
  color: $tips;
  float: right;
}
</style>
