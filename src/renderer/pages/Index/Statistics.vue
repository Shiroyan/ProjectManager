<template>
  <div style="height: 100%">
    <div id="sta__wrapper">
      <div id="user-list__wrapper">
        <user-list :curDepId="curDepId" :curUser="curUser" @depChange="depChange" @userChange="userChange"></user-list>
      </div>
      <div id="main__wrapper">
        <el-tabs v-model="tab" @tab-click="handleTabClick">
          <el-tab-pane label="概要" name="summary">
            <week-summary :sysChanges="sysChanges" @findHistory="getChanges" @genReport="genReport" @genMonthReport="genMonthReport"></week-summary>
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
import UserList from '@/components/UserList';
import WeekSummary from './Statistics/WeekSummary';
import Report from './Statistics/Report';


export default {
  name: 'Statistics',
  components: {
    'week-summary': WeekSummary,
    'user-list': UserList,
    report: Report,
  },
  data() {
    return {
      curDepId: 1,
      curUser: -1,
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
    ...mapState(['profile']),
  },
  methods: {
    userChange(userId) {
      this.curUser = userId;
      if (this.tab === 'plan') {
        this.getPlan(this.curUser);
      }
      if (this.tab === 'real') {
        this.getReal(this.curUser);
      }
    },
    handleTabClick(tab, event) {
      let { name } = tab;
      if (name === 'plan') {
        this.getPlan(this.curUser);
      } else if (name === 'real') {
        this.getReal(this.curUser);
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
    genMonthReport(date, cb) {
      this.$api.$sta.month(date, cb);
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
        this.getPlan(this.curUser, startTime, endTime);
      } else {
        this.getReal(this.curUser, startTime, endTime);
      }
    },
    depChange(id) {
      this.curDepId = id;
    },
  },
  mounted() {
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
  float: left;
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
