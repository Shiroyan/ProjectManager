<template>
  <div style="height: 100%">
    <div id="daily__wrapper">
      <div id="user-list__wrapper">
        <user-list :curDepId="curDepId" :curUser="curUser" @depChange="depChange" @userChange="userChange"></user-list>
      </div>
      <div id="main__wrapper">
        <div id="add-daily__wrapper">
          <el-button @click="showAddDaily" icon="el-icon-edit-outline" type="primary" id="add-daily" v-if="isMenuVisible" size="small">撰写日报</el-button>
        </div>
        <transition name="el-fade-in-linear">
          <div id="add-daily__form" v-show="isAddDaily">
            <div class="timeline__point"></div>
            <div class="form__item daily-date">
              <div class="form__label">日期</div>
              <el-date-picker v-model="dailyDate" :picker-options="pickerOptions" type="date" align="center" placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="form__item" v-for="e in events" :key="e.id">
              <div class="form__label">{{e.desc}}</div>
              <el-input-number v-model="e.dailyRealTime" :controls="false"></el-input-number>
            </div>
            <div class="form__item">
              <div class="form__label">内容</div>
              <el-input type="textarea" resize="none" size="mini" :autosize="{minRows: 4}"></el-input>
            </div>
            <div class="form__btn-group">
              <el-button id="cancel" @click="isAddDaily=false" size="small">取消</el-button>
              <el-button id="submit" @click="isAddDaily=false" type="primary" size="small">提交</el-button>
            </div>
          </div>
        </transition>

        <daily-item :isMenuVisible="isMenuVisible"></daily-item>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { date } from '@/utils';
import UserList from '@/components/UserList';
import DailyItem from './Daily/DailyItem';

const MON = date.getWeekStart();
const SUN = date.getWeekEnd();

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
      dailyDate: new Date(),
      isAddDaily: false,
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time > SUN || time < MON;
        },
      },
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
    getAddEvents(dailyDate) {
      let dailyDateStr = date.format(dailyDate, 'yyyy-MM-dd');
      this.$api.$events.get((events) => {
        this.events = events.map(({ id, desc }) => { // eslint-disable-line
          return {
            id,
            desc,
            dailyRealTime: 0,
          };
        });
      }, dailyDateStr);
    },
    showAddDaily() {
      this.getAddEvents(this.dailyDate);
      this.isAddDaily = true;
    },
  },
  created() {
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
#add-daily__wrapper {
  text-align: right;
  margin-bottom: 40px;
}
#add-daily {
  margin-right: 250px;
  background-color: $default;
  border: none;
  &:hover,
  &:focus {
    opacity: 0.9;
  }
}

#add-daily__form {
  width: 50%;
  min-height: 26vh;
  padding: 0 20px 10px 40px;
  border-left: 7px solid $default;
  box-sizing: border-box;
  position: relative;
  div {
    box-sizing: border-box;
  }
  .timeline__point {
    @include absTL(-2px, -15px);
    @include setSize(24px, 24px);
    border-radius: 12px;
    background-color: $default;
  }
  .form__item {
    @include flex(flex-start);
    margin-bottom: 15px;
  }

  .form__label {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 20px;
    font-size: 12px;
    color: $tips;
  }
  .form__btn-group {
    margin: 20px 0 30px 80px;
  }
}

#cancel {
  margin-right: 10px;
  color: $black;
  &:hover {
    background-color: $mask;
  }
}
#submit {
  background-color: $default;
  border: none;
  &:hover,
  &:focus {
    opacity: 0.9;
  }
}
</style>

<style lang="scss">
#add-daily__form {
  .el-input-number,
  .el-input,
  .el-input__inner {
    width: 100%;
  }
}
</style>
