<template>
  <el-dialog :visible.sync="_isVisible" center width="37vw" custom-class="project-dialog">
    <el-form :model="projectForm" ref="projectForm" :rules="rules" :status-icon="false" label-position="left" label-width="5.856vw" class="project-form" :inline-message="false">
      <div class="input-group">
        <el-form-item class="form__item" prop="name" label="项目名称">
          <sb-input v-model="projectForm.name" placeholder="项目名称 3 - 12个字符"></sb-input>
        </el-form-item>
        <el-form-item class="form__item" prop="firstParty" label="甲方">
          <sb-input v-model="projectForm.firstParty" placeholder="甲方 2 - 20个字符" :maxlength="20"></sb-input>
        </el-form-item>
        <el-form-item class="form__item" label="成员" id="members">
          <member-icons :list="projectForm.members" @add="addMember" @remove="removeMember"></member-icons>
        </el-form-item>
        <el-form-item class="form__item" label="合同" id="contract" prop="contract">
          <upload v-model="projectForm.contract"></upload>
        </el-form-item>
        <el-form-item class="form__item" prop="contractVal" label="合同金额">
          <sb-input v-model="projectForm.contractVal" placeholder="合同金额 0 - 100万"></sb-input>
        </el-form-item>
        <el-form-item class="form__item" prop="" label="合同金额">
          <sb-input v-model="projectForm.contractVal" placeholder="合同金额 0 - 100万"></sb-input>
        </el-form-item>
      </div>
      <div id="btn-group">
        <el-button class="btn" type="info" id="create" @click="create('projectForm')">创建</el-button>
      </div>
    </el-form>
    <user-list :isVisible.sync="innerVisible" :list="users.users" v-model="projectForm.members"></user-list>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import SBInput from './SBInput';
import MemberIcons from './MemberIcons';
import UserList from './UserList';
import Upload from './Upload';

export default {
  name: 'ProfileDialog',
  components: {
    'sb-input': SBInput,
    'member-icons': MemberIcons,
    'user-list': UserList,
    upload: Upload,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      projectForm: {
        name: '',
        firstParty: '',
        contract: '',
        contractVal: '',
        startTime: '',
        endTime: '',
        members: [],
      },
      innerVisible: false,
    };
  },
  computed: {
    ...mapState(['users', 'rules']),
    _isVisible: {
      get() { return this.isVisible; },
      set(newVal) { this.$emit('update:isVisible', newVal); },
    },
  },
  methods: {
    create(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.projectForm.members = this.projectForm.members.join(',');
          this.$api.$projects.create(this.projectForm, () => {
            this._isVisible = false;
            this.$router.push('/index');
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
    addMember() {
      this.innerVisible = true;
    },
    removeMember(id) {
      let members = this.projectForm.members;
      this.projectForm.members = members.filter(val => val.id !== id);
    },
    ...mapMutations(['updateUsers']),
  },
  updated() {
    this.users.users.length === 0
      && this.$api.$users.getUsersList(users => this.updateUsers(users));
  },
};
</script>

<style lang="scss" scoped>
.project-form {
  margin: 0 auto;
  text-align: -webkit-center;
}

.form__item {
  @include setSize(310px, 48px);
  box-sizing: border-box;
  margin-bottom: 20px;
}

#members,
#contract {
  text-align: left;
}

#btn-group {
  @include setSize(310px, 48px);
  color: #fff;
  display: block;
  overflow: hidden;
  .btn {
    @include setSize(150px, 36px);
    padding: 6px 0;
    background-color: $default;
    &:hover {
      opacity: 0.9;
    }
  }
  margin-top: 32px;
}
</style>


