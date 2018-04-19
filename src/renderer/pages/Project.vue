<template>
  <div>
    <el-tabs v-model="tab" @tab-click="handleClick" id="project__wrapper">
      <el-tab-pane label="基本信息" name="info">
        <div id="info__wrapper">
          <el-button type="danger" icon="el-icon-delete" id="delete" v-if="isLeader" @click="isDelVisible = true">删除</el-button>
          <el-button type="warning" icon="el-icon-refresh" id="exchange" v-if="isLeader" @click="isExchangeVisible = true">转让/添加</el-button>
          <el-button icon="el-icon-edit" id="edit" v-if="isLeader" @click="isEditVisible = true">编辑</el-button>
          <div id="info__name" class="info__item">{{info.name}}</div>
          <p id="info__start-end" class="info__item">{{info.startTime}} ~ {{info.endTime}}</p>
          <div class="info__item">
            <div class="info__label">合同</div>
            <span id="info__contract" v-if="info.contract === ''">无</span>
            <a id="info__contract" :href="`${baseUrl}${info.contract.url}`" v-else>附件</a>
            <div class="info__label">合同金额</div>
            <span id="info__contract-val">{{info.contractVal}}</span>
          </div>
          <div class="info__item">
            <div class="info__label">甲方</div>
            <p id="info__firstParty">{{info.firstParty}}</p>
          </div>
          <div class="info__item">
            <div class="info__label">负责人</div>
            <user-avatar class="info__leader" v-for="u in info.leaders" :key="u.id" :username="u.username" :job="u.jobId">
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
        <el-button icon="el-icon-my-filter" id="event__filter" @click="isShowFilter=true">筛选</el-button>
        <div id="filter-pane__wrapper" v-show="isShowFilter">
          <el-button icon="el-icon-close" type="text" plain id="filter-pane__close" @click="isShowFilter = false"></el-button>
          <div class="filter-pane__group" id="time-filter">
            <div class="group__title">按时间</div>
            <div class="group__item" :class="{'group__item--active': curTime === index}" v-for="(time, index) in timeLine" :key="index" @click="curTime = index">
              <span>{{time}}</span>
            </div>
          </div>
          <div class="filter-pane__group" id="members-filter">
            <div class="group__title">按成员</div>
            <div class="group__item" :class="{'group__item--active': curUser === 0}" @click="curUser = 0">全部</div>
            <div class="group__item" v-for="m in userList" :key="m.id" :class="{'group__item--active': curUser === m.id}" @click="curUser = m.id">
              <user-avatar :username="m.username" :job="m.jobId" class="avatar"></user-avatar>
              {{m.username}}
            </div>
          </div>
          <div class="filter-pane__group" id="tags-filter">
            <div class="group__title">按标签</div>
            <div class="group__item" :class="{'group__item--active': curTag === 0}" @click="curTag = 0">全部</div>
            <div class="group__item" v-for="t in tagList" :key="t.id" :class="{'group__item--active': curTag === t.id}" @click="curTag = t.id">
              <mini-tag :tagName="t.name" :id="t.id"></mini-tag>
            </div>
          </div>
        </div>
        <div id="plans__container">
          <plan v-for="p in curPlans" :key="p.id" :userList="userList" :plan="p" :isLeader="isLeader" @updatePlan="updatePlan" @deletePlan="deletePlan" @createEvent="createEvent" @updateEvent="updateEvent" @deleteEvent="deleteEvent" @finishEvent="finishEvent"></plan>
          <transition-group mode="out-in" name="el-fade-in">
            <el-button id="add-plan-btn" icon="el-icon-plus" plain v-if="isLeader && !isAddPlan" @click="isAddPlan=true" key="button">新增计划</el-button>
            <div id="add-plan__form" v-if="isAddPlan" key="form">
              <input id="add-plan__input" placeholder="计划名, 3-20个字符" v-model="planName">
              <div id="add-plan__btn-group">
                <el-button id="cancel" type="text" size="mini" @click="isAddPlan=false">取消</el-button>
                <el-button id="add" type="text" size="mini" @click="createPlan">确定</el-button>
              </div>
            </div>
          </transition-group>
        </div>
        <p class="handle-tips">* 按下Shift + 滑轮 进行左右滑动</p>
      </el-tab-pane>
      <!-- <el-tab-pane label="Q & A" name="bugs" disabled>
      </el-tab-pane> -->
    </el-tabs>
    <project-dialog v-if="isEditVisible" mode="edit" :isVisible.sync="isEditVisible" :info="info" @updateProject="updateProject"></project-dialog>
    <del-project-dialog :isVisible.sync="isDelVisible" :projectName="info.name" @deleteProject="deleteProject"></del-project-dialog>
    <exchange-dialog v-if="isExchangeVisible" :isVisible.sync="isExchangeVisible" :leaders="this.info.leaders" @exchangeLeader="exchangeLeader"></exchange-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import UserAvatar from '@/components/UserAvatar';
import MiniTag from '@/components/MiniTag';
import { baseUrl } from '@/api';  // eslint-disable-line
import api from '@/api';  // eslint-disable-line
import ProjectDialog from './Project/ProjectDialog';
import DelProjectDialog from './Project/DelProjectDialog';
import ExchangeDialog from './Project/ExchangeDialog';
import Plan from './Project/Plan';

export default {
  components: {
    'user-avatar': UserAvatar,
    'project-dialog': ProjectDialog,
    'del-project-dialog': DelProjectDialog,
    'exchange-dialog': ExchangeDialog,
    'mini-tag': MiniTag,
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
        leaders: [],
        members: [],
        process: 0,
        stageName: '',
      },
      plans: [],
      baseUrl,
      isEditVisible: false,
      isDelVisible: false,
      isExchangeVisible: false,
      isAddPlan: false,
      isShowFilter: false,
      planName: '',
      timeLine: ['全部', '未开始', '进行中', '快结束', '已完成', '已逾期'],
      curTime: 0,
      curUser: 0,
      curTag: 0,
    };
  },
  computed: {
    ...mapState(['profile', 'tags', 'users']),
    isLeader() {
      if (this.profile.isAdmin) {
        return true;
      }
      let { leaders } = this.info;
      let leaderIds = leaders.map(u => u.id);
      return this.profile.isPM && (leaderIds.indexOf(this.profile.userId) !== -1);
    },
    userList() {
      let members = JSON.parse(JSON.stringify(this.info.members)); // 对象数组的深拷贝
      let leaders = JSON.parse(JSON.stringify(this.info.leaders)); // 对象数组的深拷贝
      members.push(...leaders);
      return members;
    },
    tagList() {
      let map = new Map();
      let temp = [];
      this.plans.forEach(({ events }) => {
        events.forEach(({ tags }) => {
          tags.forEach(tag => map.set(tag.id, tag));
        });
      });
      for (let [key, val] of map) {
        temp.push(val);
      }
      return temp;
    },
    curPlans() {
      let afterFilter = [];
      let plans = JSON.parse(JSON.stringify(this.plans));
      afterFilter = this.timeFilter(this.curTime, plans);
      afterFilter = this.userFilter(this.curUser, afterFilter);
      afterFilter = this.tagFilter(this.curTag, afterFilter);
      return afterFilter;
    },
  },
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
    /**
     * 0 - 全部
     * 1 - 未开始
     * 2 - 进行中
     * 3 - 快结束
     * 4 - 已完成
     * 5 - 已逾期
     */
    timeFilter(time, plans) {
      let afterFilter = [];
      if (time === 0) {
        return plans;
      }
      for (let plan of plans) {
        plan.events = plan.events.filter((e) => {
          let startTime = new Date(e.startTime);
          let endTime = new Date(e.endTime);
          const twoDay = 1000 * 60 * 60 * 24 * 2; // 2天
          let now = new Date();

          switch (time) {
            case 1:
              return now < startTime;
            case 2:
              return (now >= startTime && now <= endTime);
            case 3:
              return (endTime - now < twoDay && endTime - now > 0);
            case 4:
              return e.isFinished;
            case 5:
              return now >= endTime;
            default:
              return true;
          }
        });
        afterFilter.push(plan);
      }
      return afterFilter;
    },
    userFilter(userId, plans) {
      if (userId === 0) {
        return plans;
      }
      let afterFilter = [];
      for (let plan of plans) {
        plan.events = plan.events.filter(({ members }) => members.some(({ id }) => id === userId));
        afterFilter.push(plan);
      }
      return afterFilter;
    },
    tagFilter(tagId, plans) {
      if (tagId === 0) {
        return plans;
      }
      let afterFilter = [];
      for (let plan of plans) {
        plan.events = plan.events.filter(({ tags }) => tags.some(({ id }) => id === tagId));
        afterFilter.push(plan);
      }
      return afterFilter;
    },
    exchangeLeader(leaders) {
      let temp = leaders.map(({ id }) => id);
      this.$api.$projects.exchange(this.projectId, {
        leaders: temp.join(','),
      }, () => {
        this.isExchangeVisible = false;
        this.getProjectInfo();
      });
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
      this.$api.$projects.update(this.projectId, data, () => {
        this.isEditVisible = false;
        this.getProjectInfo();
      });
    },
    getProjectInfo() {
      this.$api.$projects.getProjectInfo(this.projectId, (info) => {
        if (info.contract.length > 0) {
          info.contract = { name: `${info.name}.doc`, url: info.contract };
        }
        this.info = info;
      });
    },
    getTags() {
      this.tags.tags.length === 0 && this.$api.$events.getTags((tags) => {
        this.updateTags(tags);
      });
    },
    createPlan() {
      let len = this.planName.length;
      if (len < 3 || len > 20) {
        this.$message.error({ message: '字符3 - 20个', center: true });
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
    updatePlan(id, form) {
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
    createEvent(data) {
      data.projectId = this.projectId;
      this.$api.$events.create(data, () => {
        this.getPlans();
      });
    },
    updateEvent(data, cb) {
      data.projectId = this.projectId;
      this.$api.$events.update(data.id, data, () => {
        cb && cb();
        this.getPlans();
      });
    },
    deleteEvent(eventId, planId) {
      let data = {
        planId,
        projectId: this.projectId,
      };
      this.$api.$events.delete(eventId, data, () => {
        this.getPlans();
      });
    },
    finishEvent(eventId, planId, isFinished) {
      this.$api.$events.finish(eventId, { planId, isFinished }, () => {
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
  created() {
    this.projectId = this.$route.params.projectId;
    this.getProjectInfo();
    this.users.users.length === 0
      && this.$api.$users.getUsersList(users => this.updateUsers(users));
  },
};
</script>
<style lang="scss" scoped>
#project__wrapper {
  margin-left: 50px;
}
#info__wrapper {
  margin: 54px 0 0 112px;
  font-size: 14px;
  color: $black;
  position: relative;
}

#edit,
#delete,
#exchange {
  @include setSize(84px,32px);
  position: absolute;
  top: -30px;
  font-size: 12px;
  padding: 10px 0;
}

#edit {
  right: 432px;
  &:hover {
    background-color: #eee;
    color: $default;
  }
}

#exchange {
  right: 328px;
}

#delete {
  right: 224px;
}

.info__item {
  @include flex(flex-start);
  @include setSize(670px, 40px);
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 4px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    height: 20px;
    border-radius: 10px;
    box-shadow: inset 0 0 6px #eee;
    background-color: #bbb;
  }
  margin-bottom: 26px;
}
.info__label {
  min-width: 70px;
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

.info__leader,
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
#filter-pane__wrapper {
  @include setSize(200px, 719px);
  @include fixedTL(48px, 48px);
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 100;
  box-shadow: 2px 5px 5px #ddd;
  padding-left: 10px;
  & div {
    box-sizing: border-box;
  }
}
#filter-pane__close {
  float: right;
  margin-right: 10px;
  color: $default;
  border: none;
  &:hover,
  &:focus {
    opacity: 0.8;
    border: none;
  }
}

.filter-pane__group {
  max-height: 225px;
  overflow: auto;
  border-top: 1px solid #ddd;
  padding-top: 10px;
  color: $black;
  font-size: 14px;
  &:first-of-type {
    border: none;
    clear: both;
    padding-top: 0;
  }
  &::-webkit-scrollbar {
    width: 8px;
    height: 16px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    height: 20px;
    border-radius: 10px;
    box-shadow: inset 0 0 6px #eee;
    background-color: #bbb;
  }
}

.group__title {
  color: $tips;
  margin-bottom: 18px;
}
.group__item {
  margin-bottom: 12px;
  cursor: pointer;
  .avatar {
    font-size: 12px;
    min-width: 32px;
    height: 32px;
    border-radius: 16px;
    margin-right: 10px;
    vertical-align: middle;
    display: inline-block;
  }
  &:after {
    display: inline-block;
    content: "\2714";
    font-size: 14px;
    color: $default;
    margin-left: 40px;
    visibility: hidden;
  }
  &:hover {
    background-color: $mask;
    color: $default;
  }
}
.group__item--active {
  background-color: $mask;
  color: $default;
  &:after {
    visibility: visible;
  }
}
#members-filter {
}
#event__filter {
  @include absTL(0, 0);
  @include setSize(94px, 36px);
  padding: 0;
  &:hover,
  &:focus {
    color: $default;
    border-color: $default;
  }
}
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
  display: inline-block;
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
#event__filter {
  [class^="el-icon-my"] {
    font-size: 20px;
    vertical-align: text-bottom;
  }
}
</style>
