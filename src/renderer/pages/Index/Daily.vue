<template>
  <div style="height: 100%">
    <div id="daily__wrapper">
      <div id="user-list__wrapper">
        <user-list :curDepId="curDepId" :curUser="curUser" @depChange="depChange" @userChange="userChange"></user-list>
      </div>
      <div id="main__wrapper">
        <daily-item :isMenuVisible="isMenuVisible"></daily-item>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import UserList from '@/components/UserList';
import DailyItem from './Daily/DailyItem';

export default {
  name: 'Daily',
  components: {
    'user-list': UserList,
    'daily-item': DailyItem,
  },
  data() {
    return {
      curDepId: 1,
      curUser: -1,
      events: [],
    };
  },
  computed: {
    ...mapState(['profile']),
    isMenuVisible() {
      return this.profile.userId === this.curUser;
    },
  },
  methods: {
    ...mapMutations(['updateProfile']),
    userChange(userId) {
      this.curUser = userId;
    },
    depChange(id) {
      this.curDepId = id;
    },
  },
  created() {
    this.$api.$events.get(this.profile.userId, (events) => {
      this.events = events;
    });
    this.profile.username === '' ?
      this.$api.$users.getProfile((data) => {
        this.updateProfile(data);
        this.curUser = this.profile.userId;
      }) : (this.curUser = this.profile.userId);
  },
};
</script>

<style lang="scss" scoped>
#daily__wrapper {
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
  padding: 72px 0 0 120px;
  overflow-y: auto;
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
</style>

