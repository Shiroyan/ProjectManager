<template>
  <el-dialog :visible.sync="_isVisible" center width="30vw" custom-class="exchange-dialog">
    <el-form :model="exchangeForm" ref="exchangeForm" :rules="rules" :status-icon="false" label-position="left" label-width="6.2vw" class="exchange-form" :inline-message="false">
      <div class="input-group">
        <el-form-item class="form__item" label="负责人" id="leaders" prop="leaders">
          <member-icons :list="exchangeForm.leaders" @add="addMember" @remove="removeMember"></member-icons>
        </el-form-item>
      </div>
      <div id="btn-group">
        <el-button class="btn" type="info" id="edit" @click="ensure('exchangeForm')">确定</el-button>
      </div>
    </el-form>
    <user-list :isVisible.sync="innerVisible" :list="users.users" v-model="exchangeForm.leaders"></user-list>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import MemberIcons from '@/components/MemberIcons';
import UserList from '@/components/UserList';


export default {
  name: 'ExchangeDialog',
  components: {
    'member-icons': MemberIcons,
    'user-list': UserList,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    leaders: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      innerVisible: false,
      exchangeForm: {
        leaders: JSON.parse(JSON.stringify(this.leaders)),
      },
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
    ensure(formName) {
      this.$refs[formName].validate((valid, field) => {
        if (valid) {
          this.$emit('exchangeLeader', this.exchangeForm.leaders);
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
      this.exchangeForm.leaders = this.exchangeForm.leaders.filter(val => val.id !== id);
    },
    ...mapMutations(['updateUsers']),
  },
  mounted() {
    this.users.users.length === 0
      && this.$api.$users.getUsersList(users => this.updateUsers(users));
  },
};
</script>

<style lang="scss" scoped>
.exchange-form {
  margin: 0 auto;
  text-align: -webkit-center;
}

.form__item {
  @include setSize(310px, 6.25vh);
  box-sizing: border-box;
  margin-bottom: 20px;
}

#leaders {
  text-align: left;
  .el-form-item__content {
    padding-left: 20px;
  }
}

.btn {
  @include setSize(150px, 36px);
  padding: 6px 0;
  background-color: $default;
  display: block;
  color: #fff;
  margin: 32px auto 0 auto;
  &:hover,
  &:focus {
    background-color: $default;
    opacity: 0.9;
  }
}
</style>


