<template>
  <div id="user-list__wrapper">
    <div id="user-list__header">
      <el-input class="user-list__search" v-model="searchContent" prefix-icon="el-icon-search" placeholder="搜索用户" @keyup.enter.native="search(searchContent)"></el-input>
    </div>
    <div id="user-list__content">
      <div id="user-list__tabs">
        <div class="tab" v-for="dep in options.deps" :key="dep.id" @click="depChange(dep.id)" :class="{'tab--active': curDepId === dep.id}">
          <span class="tab__name">{{dep.name}}</span>
        </div>
      </div>
      <div id="user-list__users">
        <div class="group" v-for="g in curList" :key="g[0].jobId">
          <div class="group__title">{{g[0].jobName}}</div>
          <div class="user" v-for="u in g" :key="u.userId" @click="userChange(u.id)" :class="{'user--active': curUser===u.id}">
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
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import UserAvatar from '@/components/UserAvatar';

export default {
  name: 'UserList',
  components: {
    'user-avatar': UserAvatar,
  },
  props: {
    curDepId: {
      type: Number,
      required: true,
    },
    curUser: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      curList: [],
      searchContent: '',
    };
  },
  computed: {
    ...mapState(['users', 'options']),
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
    ...mapMutations(['updateUsers', 'updateOptions']),
    depChange(id) {
      this.curList = this.list.get(id);
      this.$emit('depChange', id);
    },
    userChange(id) {
      this.$emit('userChange', id);
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
        if (jobId === 0) {
          continue; // eslint-disable-line
        }
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
    },
  },
  created() {
    //  初始化curList
    this.users.users.length === 0 ?
      this.$api.$users.getUsersList((users) => {
        this.updateUsers(users);
        this.curList = this.list.get(this.curDepId);
      }) :
      this.curList = this.list.get(this.curDepId);

    this.options.citys.length === 0 &&
      this.$api.$users.options((data) => {
        this.updateOptions(data);
      });
  },
};
</script>

<style lang="scss" scoped>
#user-list__wrapper {
  @include setSize(100%, 100%);
  border-right: 1px solid #ddd;
  border-left: 1px solid #ddd;
  float: left;
  div {
    box-sizing: border-box;
  }
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
  @include setSize(247px, 100%);
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

<style lang="scss">
.user-list__search {
  height: 100%;
  & > .el-input__inner {
    border: none;
    height: 100%;
  }
}
</style>
