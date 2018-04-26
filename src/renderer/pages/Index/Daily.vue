<template>
  <div style="height: 100%">
    <div id="daily__wrapper">
      <div id="user-list__wrapper">
        <user-list :curDepId="curDepId" :curUser="curUser" @depChange="depChange" @userChange="userChange"></user-list>
      </div>
      <div id="main__wrapper">
        <el-date-picker id="daily-month" v-model="dailyMonth" :picker-options="onlyBeforeThisMonth" @change="monthChange" type="month" align="center" placeholder="选择月份" format="yyyy 年 MM 月" prefix-icon="none">
        </el-date-picker>
        <div id="add-daily__wrapper">
          <el-button @click="showAddDaily" icon="el-icon-edit-outline" type="primary" id="add-daily" v-if="isMenuVisible" size="small">撰写日报</el-button>
        </div>
        <transition name="el-zoom-in-top">
          <div id="add-daily__form" v-show="isAddDaily">
            <div class="timeline__point"></div>
            <div class="form__item daily-date">
              <div class="form__label">日期</div>
              <el-date-picker v-model="dailyDate" :picker-options="onlyThisWeek" @change="dateChange" type="date" align="center" placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="no-event-tips" v-show="events.length === 0">* 若看到这句话或找不看到可以填写的计划事项，请联系项目或部门负责人为您添加</div>
            <div class="form__item" v-for="e in events" :key="e.id">
              <div class="form__label">{{e.desc}}</div>
              <input type="number" v-model.number="e.dailyRealTime" class="form__input" />
              <span class="title">
                {{e.projectName}}
                <p>{{e.desc}}</p>
              </span>
            </div>
            <div class="form__item">
              <div class="form__label">内容</div>
              <el-input v-model="dailyContent" type="textarea" resize="none" size="mini" :autosize="{minRows: 4}"></el-input>
            </div>
            <div class="form__btn-group">
              <el-button id="cancel" @click="isAddDaily=false" size="small">取消</el-button>
              <el-button id="submit" @click="addOrUpdateDaily($data, 'add')" type="primary" size="small" :disabled="events.length === 0">提交</el-button>
            </div>
          </div>
        </transition>
        <div class="no-daily-tips" v-show="dailies.length === 0 && !isAddDaily">暂无日报</div>
        <daily-item v-for="d in dailies" :key="d.id" :daily="d" :isMenuVisible="isMenuVisible" @update="addOrUpdateDaily" @delete="deleteDaily"></daily-item>
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
const LAST_DATE = date.getLastDateOfMonth();

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
      dailies: [],
      dailyMonth: new Date(),
      dailyDate: new Date(),
      isAddDaily: false,
      dailyContent: '',
      onlyThisWeek: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time > SUN || time < MON;
        },
      },
      onlyBeforeThisMonth: {
        disabledDate(time) {
          return time > LAST_DATE;
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
    genBaseContent() {
      let content = this.events.map(({ desc, dailyRealTime }) => {
        if (!dailyRealTime) {
          dailyRealTime = 0;
          return '';
        }
        return `${desc} —— ${dailyRealTime}h`;
      });
      this.dailyContent = content.filter(c => c !== '').join('\n');
    },
    userChange(userId) {
      this.curUser = userId;
      this.getDailies(this.curUser);
    },
    depChange(id) {
      this.curDepId = id;
    },
    getDailies(userId, dailyMonth = new Date()) {
      dailyMonth = date.format(dailyMonth, 'yyyy-MM-dd');
      this.$api.$daily.abstract(userId, dailyMonth, (dailies) => {
        this.dailies = dailies;
      });
    },
    getAddEvents(dailyDate) {
      let dailyDateStr = date.format(dailyDate, 'yyyy-MM-dd');
      this.$api.$events.get((events) => {
        this.events = events.map(({ id, desc, projectName }) => { // eslint-disable-line
          return {
            id,
            desc,
            projectName,
            dailyRealTime: 0,
          };
        });
      }, dailyDateStr);
    },
    dateChange(dailyDate) {
      this.getAddEvents(dailyDate);
    },
    monthChange(dailyMonth) {
      this.getDailies(this.curUser, dailyMonth);
    },
    showAddDaily() {
      this.getAddEvents(this.dailyDate);
      this.isAddDaily = true;
    },
    addOrUpdateDaily(data, mode) {
      let dailyDateStr = date.format(data.dailyDate, 'yyyy-MM-dd');
      let detail = {};
      let isLegal = true;
      for (let { id, dailyRealTime } of data.events) {
        detail[id] = dailyRealTime;
        if (dailyRealTime === undefined || dailyRealTime === '') {
          isLegal = false;
          break;
        }
      }
      if (isLegal) {
        let temp = {
          date: dailyDateStr,
          detail: JSON.stringify(detail),
          content: data.dailyContent,
        };
        if (mode === 'add') {
          this.$api.$daily.add(temp, () => {
            this.isAddDaily = false;
            this.getDailies(this.curUser);
          });
        } else {
          temp.dailyId = data.dailyId;
          this.$api.$daily.update(temp, () => this.getDailies(this.curUser, this.dailyMonth));
        }
      } else {
        this.$message.error('请填写实际工时，若没有做这件事，填0即可');
      }
    },
    deleteDaily(dailyId, dailyDate) {
      let dailyDateStr = date.format(dailyDate, 'yyyy-MM-dd');
      this.$confirm('此操作将永久删除该日报, 是否继续?', '警告', {
        type: 'error',
        confirmButtonClass: 'confirm-delete',
      }).then(() => {
        this.$api.$daily.delete(dailyId, dailyDateStr,
          () => this.getDailies(this.curUser, this.dailyMonth));
      }).catch(() => { });
    },
  },
  created() {
    if (this.profile.username === '') {
      this.$api.$users.getProfile((data) => {
        this.updateProfile(data);
        this.curUser = this.profile.userId;
        this.profile.depId !== 0 && (this.curDepId = this.profile.depId);
        this.getDailies(this.curUser);
      });
    } else {
      this.curUser = this.profile.userId;
      this.profile.depId !== 0 && (this.curDepId = this.profile.depId);
      this.getDailies(this.curUser);
    }
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
  padding: 72px 0 30px 120px;
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

.no-daily-tips {
  font-size: 28px;
  color: $tips;
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
    position: relative;
  }
  .no-event-tips {
    margin-bottom: 15px;
    color: $danger;
    font-size: 14px;
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
  .form__input {
    @include setSize(100%, 40px);
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: $black;
    font-size: 14px;
    line-height: 40px;
    outline: none;
    text-align: center;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-butto {
      -webkit-appearance: none;
    }
    &:focus {
      border-color: $primary;
    }
    &:focus + .title {
      display: block;
      opacity: 1;
      transition: opacity 2s ease-in-out;
    }
  }
  .title {
    @include absBR(0, 0);
    max-width: 400px;
    height: auto;
    padding: 8px;
    display: none;
    font-size: 12px;
    line-height: 1.5;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 2px;
    box-sizing: border-box;
    opacity: 0;
    text-align: center;
    z-index: 2;
    overflow: hidden;
    transform: translate(105%, 25%);
    p {
      white-space: pre-line;
    }
  }
  .form__btn-group {
    margin: 40px 0 30px 100px;
  }
}

#cancel {
  width: 100px;
  margin-right: 10px;
  color: $black;
  &:hover {
    background-color: $mask;
  }
}
#submit {
  width: 100px;
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
  .el-input,
  .el-input__inner {
    width: 100%;
    text-align: center;
  }
}
#daily-month {
  border: none;
  font-size: 28px;
  padding: 0;
  margin-bottom: 30px;
}
.confirm-delete {
  background-color: $danger !important;
  color: #fff !important;
  border: none !important;
}
</style>
