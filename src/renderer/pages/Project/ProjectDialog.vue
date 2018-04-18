<template>
  <el-dialog :visible.sync="_isVisible" center width="37vw" custom-class="project-dialog" :top="mode === 'edit' ? '2vh': '15vh'">
    <el-form :model="projectForm" ref="projectForm" :rules="rules" :status-icon="false" label-position="left" label-width="6.2vw" class="project-form" :inline-message="false">
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
        <el-form-item class="form__item" label="合同" id="contract">
          <upload v-model="projectForm.contract"></upload>
        </el-form-item>
        <el-form-item class="form__item"  label="合同金额">
          <sb-input v-model.number="projectForm.contractVal" placeholder="合同金额 0 - 100万"></sb-input>
        </el-form-item>
        <el-form-item class="form__item" label="起止时间" prop="startTime">
          <date-time-picker v-model="timeRange"></date-time-picker>
        </el-form-item>
        <template v-if="mode === 'edit'">
          <el-form-item class="form__item" label="进度">
            <el-slider id="process" v-model="projectForm.process" show-input :show-input-controls="false" input-size="mini"></el-slider>
          </el-form-item>
          <el-form-item class="form__item" label="项目阶段">
            <el-select v-model="projectForm.stageId" placeholder="请选择阶段">
              <el-option v-for="item in stages.stages" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </div>
      <div id="btn-group">
        <el-button class="btn" type="info" id="create" @click="ensure('projectForm')" v-if="mode !== 'edit'">创建</el-button>
        <el-button class="btn" type="info" id="edit" @click="ensure('projectForm')" v-else>确定</el-button>
      </div>
    </el-form>
    <user-list :isVisible.sync="innerVisible" :list="users.users" v-model="projectForm.members"></user-list>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import SBInput from '@/components/SBInput';
import MemberIcons from '@/components/MemberIcons';
import UserList from '@/components/UserListDialog';
import Upload from '@/components/Upload';
import DateTimePicker from '@/components/DateTimePicker';

export default {
  name: 'ProjectDialog',
  components: {
    'sb-input': SBInput,
    'member-icons': MemberIcons,
    'user-list': UserList,
    upload: Upload,
    'date-time-picker': DateTimePicker,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    mode: {
      type: String,
      default: 'create',
    },
    info: {
      type: Object,
      default() {
        return {
          name: '',
          firstParty: '',
          contract: { name: '' },
          contractVal: 0,
          startTime: '',
          endTime: '',
          members: [],
          process: 0,
          stageId: 0,
        };
      },
    },
  },
  data() {
    return {
      innerVisible: false,
      projectForm: JSON.parse(JSON.stringify(this.info)),
    };
  },
  computed: {
    ...mapState(['users', 'rules', 'stages']),
    _isVisible: {
      get() { return this.isVisible; },
      set(newVal) { this.$emit('update:isVisible', newVal); },
    },
    timeRange: {
      get() {
        let { startTime, endTime } = this.projectForm;
        return startTime ? [startTime, endTime] : [];
      },
      set(v) {
        this.projectForm.startTime = v[0];
        this.projectForm.endTime = v[1];
      },
    },
  },
  methods: {
    ensure(formName) {
      this.$refs[formName].validate((valid, field) => {
        if (valid) {
          let eventName = this.mode === 'edit' ? 'updateProject' : 'createProject';
          this.$emit(eventName, this.projectForm);
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
      this.projectForm.members = this.projectForm.members.filter(val => val.id !== id);
    },
    ...mapMutations(['updateUsers', 'updateStages']),
  },
  created() {
    this.users.users.length === 0
      && this.$api.$users.getUsersList(users => this.updateUsers(users));
    this.stages.stages.length === 0
      && this.$api.$projects.getStages(stages => this.updateStages(stages));
  },
};
</script>

<style lang="scss" scoped>
.project-form {
  margin: 0 auto;
  text-align: -webkit-center;
}

.form__item {
  @include setSize(310px, 6.25vh);
  box-sizing: border-box;
  margin-bottom: 20px;
}

#members,
#contract {
  text-align: left;
  .el-form-item__content {
    padding-left: 20px;
  }
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
<style lang="scss">
#process {
  .el-slider__input {
    width: 50px;
    border: none;
    outline: none;
  }
  .el-slider__runway.show-input {
    margin-right: 60px;
  }
}
.project-dialog {
  max-height: 90.23vh
}
</style>



