<template>
  <div>
    <div id="users__wrapper" class="users__wrapper" :class="{'users__wrapper--admin': profile.isAdmin}">
      <div class="users__item" v-for="u in users.users" :key="u.id">
        <user-avatar class="user__avatar" :username="u.username" :job="u.jobId"></user-avatar>
        <div class="user__username">{{u.username}}</div>
        <div class="user__account" v-if="profile.isAdmin">
            {{u.account}}
        </div>
        <div class="user__dep">{{u.depName}}</div>
        <div class="user__job">{{u.jobName}}</div>
        <div class="user__city">{{u.cityName}}</div>
        <div class="user__role" v-if="profile.isAdmin">{{u.roleName}}</div>
        <el-button type="text" icon="el-icon-edit" class="edit-user" v-if="profile.isAdmin && profile.userId !== u.id " @click="showEditUser(u)"></el-button>
        <el-button type="text" icon="el-icon-delete" class="del-user" v-if="profile.isAdmin && profile.userId !== u.id" @click="showDelUser(u.id)"></el-button>
      </div>
    </div>
    <profile-dialog :id="selectedUserId" :form="selectedUserProfile" :isVisible.sync="isEditUser" @updateProfile="updateProfileByAdmin"></profile-dialog>
    <el-dialog :visible.sync="isDelUser" center width="29vw" custom-class="del-user-dialog">
      <div id="del-user-dialog__content">
        <div id="danger__tips">
          <i class="el-icon-warning" id="danger__icon"></i>
          <div id="danger__title">确认删除该用户么？</div>
        </div>
      </div>
      <div slot="footer">
        <p id="danger__desc">该操作不可逆，与该用户关联的数据都会被清除！</p>
        <el-button type="danger" id="ensure" @click="delUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import UserAvatar from '@/components/UserAvatar';
import ProfileDialog from './ProfileDialog';

export default {
  name: 'Users',
  components: {
    'user-avatar': UserAvatar,
    'profile-dialog': ProfileDialog,
  },
  data() {
    return {
      isEditUser: false,
      isDelUser: false,
      selectedUserId: -1,
      selectedUserProfile: {
        username: '',
        city: '',
        dep: '',
        job: '',
        role: '',
        newPwd: '',
      },
    };
  },
  computed: {
    ...mapState(['profile', 'rules', 'users']),
  },
  methods: {
    ...mapMutations(['updateUsers']),
    showEditUser(user, dialogName) {
      this.selectedUserId = user.id;
      this.selectedUserProfile = {
        city: user.cityId,
        dep: user.depId,
        job: user.jobId,
        role: user.roleId,
        username: user.username,
        newPwd: '',
      };
      this.isEditUser = true;
    },
    showDelUser(userId) {
      this.selectedUserId = userId;
      this.isDelUser = true;
    },
    updateProfileByAdmin(id, profileForm) {
      this.$api.$users.updateProfileByAdmin(id, profileForm, () => {
        this.getUsersList();
      });
    },
    getUsersList() {
      this.$api.$users.getUsersList(users => this.updateUsers(users));
    },
    delUser() {
      this.$api.$users.delete(this.selectedUserId, () => {
        this.isDelUser = false;
        this.getUsersList();
      });
    },
  },
  mounted() {
    this.getUsersList();
  },
};
</script>

<style lang="scss" scoped>

.users__wrapper {
  @include setSize(40%, 100%);
}

.users__wrapper--admin {
  @include setSize(60%, 100%);
  .edit-user {
    margin-left: 30px;
  }
}

#users__wrapper {
  box-sizing: border-box;
  margin: 30px auto 0 auto;
  padding-bottom: 20px;
  overflow: auto;
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
.users__item {
  @include flex(flex-start);
  border-bottom: 1px solid #ddd;
  padding: 10px;
}
.user__avatar {
  @include setSize(48px,48px);
  border-radius: 24px;
  line-height: 48px;
  margin-right: 20px;
}
.user__username {
  color: #2e2e2e;
  font-size: 18px;
  width: 100px;
}
.user__account {
  width: 150px;
}

.user__dep,
.user__job,
.user__city,
.user__role {
  font-size: 14px;
  color: $tips;
  width: 80px;
}

.edit-user {
  margin-right: 20px;
  color: $default;
  font-size: 18px;
  &:hover,
  &:focus {
    color: $default;
    font-weight: bold;
  }
}
.del-user {
  color: $danger;
  font-size: 18px;
  &:hover,
  &:focus {
    color: $danger;
    font-weight: bold;
  }
}
#del-user-dialog__content {
  text-align: center;
  margin-bottom: 30px;
}

#danger__icon {
  font-size: 48px;
  color: $danger;
  vertical-align: middle;
  margin-right: 18px;
}

#danger__title {
  color: #2e2e2e;
  font-size: 18px;
  display: inline-block;
}

#danger__desc {
  font-size: 13px;
  color: $danger;
}

#ensure {
  @include setSize(150px, 36px);
  padding: 6px 0;
  &:hover {
    opacity: 0.9;
  }
  margin-top: 20px;
}
</style>