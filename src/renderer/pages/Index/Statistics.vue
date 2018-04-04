<template>
  <div style="height: 100%">
    <div id="sta__wrapper">
      <div id="user-list__wrapper">
        <div id="user-list__header">
          <el-input class="user-list__search" prefix-icon="el-icon-search" placeholder="搜索用户" @change="search"></el-input>
        </div>
        <div id="user-list__content">
          <div id="user-list__tabs">
            <div class="tab" v-for="dep in options.deps" :key="dep.id" @click="curDepId = dep.id" :class="{'tab--active': curDepId === dep.id}">
              <span class="tab__name">{{dep.name}}</span>
            </div>
          </div>
          <div id="user-list__users">
            <div class="group" v-for="g in curList" :key="g[0].jobId">
              <div class="group__title">{{g[0].jobName}}</div>
              <div class="user" v-for="u in g" :key="u.userId" @click="userClick(u.id)" :class="{'user--active': curSelectedUser===u.id}">
                <user-avatar class="user__avatar" :username="u.username" :job="u.jobId"></user-avatar>
                <div class="user__info">
                  <p class="info__username">{{u.username}}</p>
                  <p class="info__others">{{u.cityName}}, {{u.depName}}, {{u.jobName}}</p>
                </div>
              </div>
            </div>
            <div class="no-data-tips" v-if="!curList">
              <h2>暂无成员</h2>
            </div>
          </div>
        </div>
      </div>
      <div id="main__wrapper">
        <el-tabs v-model="tab" @tab-click="handleTabClick">
          <el-tab-pane label="概要" name="summary">
            <week-summary :sysChanges="sysChanges" @findHistory="getChanges" @genReport="genReport"></week-summary>
          </el-tab-pane>
          <el-tab-pane label="计划" name="plan">
            <report :report="planReport" @findHistoryReport="findHistoryReport"></report>
          </el-tab-pane>
          <el-tab-pane label="实际" name="real">
            <report :report="realReport" @findHistoryReport="findHistoryReport" type="real"></report>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import UserAvatar from '@/components/UserAvatar';
import WeekSummary from './Statistics/WeekSummary';
import Report from './Statistics/Report';

export default {
  name: 'Statistics',
  components: {
    'user-avatar': UserAvatar,
    'week-summary': WeekSummary,
    report: Report,
  },
  data() {
    return {
      curDepId: 0,
      curSelectedUser: -1,
      curList: undefined,
      tab: 'summary',
      sysChanges: {
        startTime: '',
        endTime: '',
        newMembers: [],
        delMembers: [],
        newProjects: [],
        delProjects: [],
      },
      planReport: {
        startTime: '',
        endTime: '',
        planTime: 0,
        avaTime: 0,
        busyTime: 0,
        projects: [],
      },
      realReport: {
        startTime: '',
        endTime: '',
        planTime: 0,
        avaTime: 0,
        realTime: 0,
        approval: 0,
        busyTime: 0,
        planOffset: 0,
        realOffset: 0,
        lastWeekRealOffset: 0,
        effect: 0,
        lastWeekEff: 0,
        badCnt: 0,
        busyCnt: 0,
        projects: [],
      },
    };
  },
  computed: {
    ...mapState(['users', 'options', 'profile']),
    list() {
      let { users } = this.users;
      //#region 按部分分类
      let deps = new Map();
      for (let u of users) {
        let { depId } = u;
        !deps.get(depId) && deps.set(depId, []);
        let dep = deps.get(depId);
        dep.push(u);
      }
      //#endregion
      //#region 按岗位分类
      let list = new Map();
      for (let [key, group] of deps) {
        let jobs = new Map();
        for (let u of group) {
          let { jobId } = u;
          !jobs.get(jobId) && jobs.set(jobId, []);
          jobs.get(jobId).push(u);
        }
        //  把Map转为二维数组
        let data = [];
        for (let [key, val] of jobs) {
          val.length > 0 && data.push(val);
        }
        list.set(key, data);
      }
      //#endregion
      return list;
    },
  },
  methods: {
    ...mapMutations(['updateUsers']),
    userClick(userId) {
      this.curSelectedUser = userId;
      if (this.tab === 'plan') {
        this.getPlan(this.curSelectedUser);
      }
      if (this.tab === 'real') {
        this.getReal(this.curSelectedUser);
      }
    },
    /**
     * 筛选符合条件的用户，匹配用户名、岗位、部门、城市。
     * 筛选结果按岗位进行分类
     */
    search(val) {
      //#region 筛选、分类
      let temp = new Map();
      for (let u of this.users.users) {
        let { jobId, username, jobName, depName, cityName } = u;
        !temp.get(jobId) && temp.set(jobId, []);
        if (username.match(val) || jobName.match(val)
          || depName.match(val) || cityName.match(val)) {
          temp.get(jobId).push(u);
        }
      }
      //#endregion
      //#region 转为二维数组
      let data = [];
      for (let [key, val] of temp) {
        val.length > 0 && data.push(val);
      }
      //#endregion
      this.curList = data;
      this.curDepId = 0;
    },
    handleTabClick(tab, event) {
      let { name } = tab;
      if (name === 'plan') {
        this.getPlan(this.curSelectedUser);
      } else if (name === 'real') {
        this.getReal(this.curSelectedUser);
      }
    },
    getChanges(startTime, endTime) {
      this.$api.$sta.sysChanges(startTime, endTime, (data) => {
        this.sysChanges = data;
      });
    },
    genReport(startTime, endTime, type, cb) {
      this.$api.$sta.excel(type, startTime, endTime, cb);
    },
    getPlan(userId, startTime, endTime) {
      userId = userId === -1 ? this.profile.userId : userId;
      this.$api.$sta.plan(userId, (data) => {
        this.planReport = data;
      }, startTime, endTime);
    },
    getReal(userId, startTime, endTime) {
      userId = userId === -1 ? this.profile.userId : userId;
      this.$api.$sta.real(userId, (data) => {
        this.realReport = data;
      }, startTime, endTime);
    },
    findHistoryReport(startTime, endTime, type) {
      if (type === 'plan') {
        this.getPlan(this.curSelectedUser, startTime, endTime);
      } else {
        this.getReal(this.curSelectedUser, startTime, endTime);
      }
    },
  },
  watch: {
    curDepId(newVal, oldVal) {
      if (newVal !== 0) {
        this.curList = this.list.get(newVal);
      }
    },
  },
  mounted() {
    this.users.users.length === 0 ?
      this.$api.$users.getUsersList((users) => {
        this.updateUsers(users);
        this.curDepId = 1;
      }) : this.curDepId = 1;
    this.getChanges();
  },
};
</script>


<style lang="scss" scoped>
// 用户列表样式
#sta__wrapper {
  @include setSize(100%, 100%);
  border-top: 1px solid #ddd;
  overflow: hidden;
  & div {
    box-sizing: border-box;
  }
}
#user-list__wrapper {
  @include setSize(302px, 100%);
  border-right: 1px solid #ddd;
  border-left: 1px solid #ddd;
  float: left;
}
#user-list__header {
  @include setSize(100%, 50px);
  border-bottom: 1px solid #ddd;
}
#user-list__content {
  @include setSize(100%, 87.23vh);
  overflow: hidden;
}
#user-list__tabs {
  @include setSize(50px, 100%);
  border-right: 1px solid #ddd;
  float: left;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
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
  .tab {
    @include setSize(50px, 70px);
    border-right: 4px solid transparent;
    color: $black;
    cursor: pointer;
    font-size: 12px;
    text-align: center;
    letter-spacing: 1px;
    &::before {
      @include setSize(0, 100%);
      content: "";
      display: inline-block;
      vertical-align: middle;
    }
    &:hover {
      background-color: $mask;
      color: $default;
    }
  }
  .tab__name {
    display: inline-block;
  }
  .tab--active {
    border-right-color: $default;
    color: $default;
    font-weight: bold;
  }
  .tab:focus {
    border-right-color: $default;
  }
}
#user-list__users {
  @include setSize(250px, 100%);
  float: right;
  overflow: hidden;
  overflow-y: auto;
  .group {
    margin-top: 30px;
  }
  .group__title {
    margin-left: 10px;
    font-size: 16px;
    color: $tips;
  }
  .user {
    @include flex(flex-start);
    border-bottom: 1px solid #ddd;
    padding: 10px;
    cursor: pointer;
    &:hover {
      background-color: #eee;
      transition: all 0.3s ease-in;
    }
  }
  .user--active {
    background-color: #eee;
    transition: all 0.3s ease-in-out;
  }
  .user__avatar {
    margin-right: 18px;
  }
  .info__username,
  .info__others {
    font-size: 12px;
  }
  .info__others {
    color: $tips;
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
.no-data-tips {
  @include setSize(100%, 100%);
  @include flex(center);
  color: $tips;
}
</style>

<style lang="scss" scoped>
// 主体样式
#main__wrapper {
  @include setSize(1016px, 100%);
  float: right;
  padding: 13px 0 0 20px;
}
</style>


<style lang="scss">
.user-list__search {
  height: 100%;
  & > .el-input__inner {
    border: none;
    height: 100%;
  }
}
#main__wrapper {
  .el-tabs__item {
    text-align: center;
    width: 124px;
    &.is-active {
      font-weight: bold;
      color: $black;
    }
    &:hover {
      color: $black;
    }
  }
  .el-tabs__active-bar {
    background-color: $default;
    height: 3px;
  }
}
</style>
