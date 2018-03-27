<template>
  <div id="project__wrapper">
    <el-tabs v-model="tab" @tab-click="handleClick" id="project__wrapper">
      <el-tab-pane label="基本信息" name="info">
        <div id="info__wrapper">
          <el-button type="danger" icon="el-icon-delete" id="delete" v-if="profile.isPM" @click="isDelVisible = true">删除</el-button>
          <el-button icon="el-icon-edit" id="edit" v-if="profile.isPM" @click="isEditVisible = true">编辑</el-button>
          <div id="info__name" class="info__item">{{info.name}}</div>
          <p id="info__start-end" class="info__item">{{info.startTime}} ~ {{info.endTime}}</p>
          <div class="info__item">
            <div class="info__label">合同</div>
            <a id="info__contract" :href="`${baseUrl}${info.contract.url}`">附件</a>
            <div class="info__label">合同金额</div>
            <span id="info__contract-val">{{info.contractVal}}</span>
          </div>
          <div class="info__item">
            <div class="info__label">甲方</div>
            <p id="info__firstParty">{{info.firstParty}}</p>
          </div>
          <div class="info__item">
            <div class="info__label">负责人</div>
            <user-avatar id="info__leader" :username="info.leader.username" :job="info.leader.jobId">
            </user-avatar>
          </div>
          <div class="info__item">
            <div class="info__label">成员</div>
            <user-avatar class="info__members" v-for="u in info.members" :key="u.id" :username="u.username" :job="u.jobId"></user-avatar>
          </div>
          <div class="info__item">
            <div class="info__label">进度</div>
            <el-progress id="info__progress" :text-inside="true" :stroke-width="16" :percentage="info.process" :status="info.process === 100 ? 'success': ''"></el-progress>
          </div>
          <div class="info__item">
            <div class="info__label">阶段</div>
            <span id="info__stage">{{info.stageName}}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="计划" name="plans">
        <div id="plans__container">
          <plan v-for="p in plans" :key="p.id" :plan="p" @editPlan="editPlan" @deletePlan="deletePlan"></plan>
          <transition-group mode="out-in" name="el-fade-in">
            <el-button id="add-plan-btn" icon="el-icon-plus" plain v-if="profile.isPM && !isAddPlan" @click="isAddPlan=true" key="button">新增计划</el-button>
            <div id="add-plan__form" v-if="isAddPlan" key="form">
              <input id="add-plan__input" placeholder="计划名, 3-10个字符" v-model="planName">
              <div id="add-plan__btn-group">
                <el-button id="cancel" type="text" size="mini" @click="isAddPlan=false">取消</el-button>
                <el-button id="add" type="text" size="mini" @click="addPlan">确定</el-button>
              </div>
            </div>
          </transition-group>
        </div>
        <p class="handle-tips">* 按下Shift + 滑轮 进行左右滑动</p>
      </el-tab-pane>
      <el-tab-pane label="Q & A" name="bugs" disabled>
      </el-tab-pane>
    </el-tabs>
    <project-dialog v-if="isEditVisible" mode="edit" :isVisible.sync="isEditVisible" :info="info" @updateProject="updateProject"></project-dialog>
    <del-project-dialog :isVisible.sync="isDelVisible" :projectName="info.name" @deleteProject="deleteProject"></del-project-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import UserAvatar from '@/components/UserAvatar';
import { baseUrl } from '@/api';  // eslint-disable-line
import api from '@/api';  // eslint-disable-line
import ProjectDialog from './Project/ProjectDialog';
import DelProjectDialog from './Project/DelProjectDialog';
import Plan from './Project/Plan';

export default {
  components: {
    'user-avatar': UserAvatar,
    'project-dialog': ProjectDialog,
    'del-project-dialog': DelProjectDialog,
    plan: Plan,
  },
  data() {
    return {
      tab: 'info',
      projectId: '',
      info: {
        name: '',
        startTime: '',
        endTime: '',
        contract: '',
        contractVal: '',
        firstParty: '',
        leader: { username: '', jobId: 0 },
        members: [],
        process: 0,
        stageName: '',
      },
      plans: [],
      baseUrl,
      isEditVisible: false,
      isDelVisible: false,
      isAddPlan: false,
      planName: '',
    };
  },
  computed: mapState(['profile', 'tags', 'users']),
  methods: {
    ...mapMutations(['updateTags', 'updateUsers']),
    handleClick(tab, event) {
      let { name } = tab;
      switch (name) {
        case 'info':
          this.getProjectInfo(); break;
        case 'plans':
          this.getPlans();
          this.getTags();
          break;
        default:
      }
    },
    getPlans() {
      this.$api.$plans.all(this.projectId, (plans) => {
        this.plans = plans;
      });
    },
    deleteProject() {
      this.$api.$projects.delete(this.projectId, () => {
        this.$router.push('/');
        this.isDelVisible = false;
      });
    },
    updateProject(form) {
      let data = Object.assign({}, form);
      data.members = data.members.map(u => u.id).join(',');
      if (!(data.contract instanceof File)) {
        delete data.contract;
      }
      data.leaderId = data.leader.id;
      this.$api.$projects.update(this.projectId, data, () => {
        this.isEditVisible = false;
        this.getProjectInfo();
      });
    },
    getProjectInfo() {
      this.$api.$projects.getProjectInfo(this.projectId, (info) => {
        info.contract = { name: `${info.name}.doc`, url: info.contract };
        this.info = info;
      });
    },
    getTags() {
      this.tags.tags.length === 0 && this.$api.$events.getTags((tags) => {
        this.updateTags(tags);
      });
    },
    addPlan() {
      let len = this.planName.length;
      if (len < 3 || len > 10) {
        this.$message.error({ message: '字符3-10个', center: true });
      } else {
        this.isAddPlan = false;
        this.$api.$plans.add({
          name: this.planName,
          projectId: this.projectId,
        }, () => {
          this.getPlans();
        });
      }
    },
    editPlan(id, form) {
      this.$api.$plans.update(id, {
        projectId: this.projectId,
        name: form.planName,
        process: form.process,
      }, () => {
        this.getPlans();
      });
    },
    deletePlan(planId) {
      this.$api.$plans.delete(planId, { projectId: this.projectId },
        () => {
          this.getPlans();
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    let projectId = to.params.projectId;
    if (projectId === undefined || projectId === 'undefined' || projectId === '') {
      next(vm => vm.$router.push('/'));
    } else {
      next();
    }
  },
  mounted() {
    this.projectId = this.$route.params.projectId;
    api.$projects.getProjectInfo(this.projectId, (info) => {
      info.contract = { name: `${info.name}.doc`, url: info.contract };
      this.info = info;
    });
    this.users.users.length === 0
      && this.$api.$users.getUsersList(users => this.updateUsers(users));
  },
};
</script>
<style lang="scss" scoped>
#info__wrapper {
  margin: 54px 0 0 62px;
  font-size: 14px;
  color: $black;
  position: relative;
}

#edit,
#delete {
  @include setSize(84px,32px);
  position: absolute;
  top: -30px;
  font-size: 12px;
  padding: 10px 0;
}

#edit {
  right: 328px;
  &:hover {
    background-color: #eee;
    color: $default;
  }
}

#delete {
  right: 224px;
}

.info__item {
  @include flex(flex-start);
  height: 36px;
  margin-bottom: 30px;
}
.info__label {
  width: 70px;
  color: $tips;
  vertical-align: middle;
}
#info__name {
  font-size: 28px;
  color: #212121;
}

#info__start-end {
  color: $tips;
  letter-spacing: 1px;
}

#info__leader,
.info__members {
  margin-right: 10px;
}

#info__contract {
  color: $default;
  cursor: pointer;
  text-decoration: underline;
  margin-right: 70px;
}
#info__contract-val {
  margin-left: 20px;
  color: #2e2e2e;
}
#info__progress {
  width: 180px;
}
</style>
<style lang="scss" scoped>
#plans__container {
  margin-top: 44px;
  white-space: nowrap;
  height: 78vh;
  overflow: hidden;
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: #f5f5f5;
  }
}
#add-plan-btn {
  @include setSize(250px, 40px);
  background-color: #eee;
  border: none;
  color: $black;
  font-size: 13px;
  margin-right: 20px;
  &:hover {
    border: none;
  }
}
#add-plan__form {
  @include setSize(250px, 120px);
  background-color: #eee;
  border: 1px solid #eee;
  border-radius: 5px;
  text-align: center;
  padding-top: 20px;
}
#add-plan__input {
  @include setSize(200px, 32px);
  border: none;
  border-bottom: 2px solid $tips;
  background-color: #eee;
  box-sizing: border-box;
  font-size: 14px;
  padding: 9px;
  outline: none;
  margin-bottom: 40px;
  &:focus {
    border-bottom-color: $default;
  }
}
#add-plan__btn-group {
  text-align: center;
}
#add {
  margin-left: 20px;
  color: $default;
}
#cancel {
  color: $black;
}
.handle-tips {
  margin: 10px 0 0 0;
  font-size: 12px;
  color: $danger;
}
</style>

<style lang="scss">
#project__wrapper {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__nav-wrap {
    width: 500px;
    margin: 0 auto;
  }
}
</style>