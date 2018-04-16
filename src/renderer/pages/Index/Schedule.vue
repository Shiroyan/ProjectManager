<template>
  <div>
    <div id="schedules__wrapper">
      <el-dialog width="30.894vw" :visible.sync="isReportWorkHour">
        <div id="report-workhour__dialog">
          <el-form :model="workHourForm" ref="workHourForm" :rules="rules" label-width="7.32vw" label-position="left">
            <el-form-item label="起止时间" prop="week">
              <el-date-picker v-model="workHourForm.week" type="week" format="yyyy 第 WW 周" placeholder="选择周" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="工时" prop="avaTime">
              <el-input-number v-model="workHourForm.avaTime" :controls="false"></el-input-number>
            </el-form-item>
          </el-form>
          <div style="text-align: center">
            <el-button id="report-workhour__cancel" @click="isReportWorkHour = false" type="text">取消</el-button>
            <el-button id="report-workhour__ensure" type="text" @click="reportWorkHour">确定</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog width="30.894vw" :visible.sync="isModWorkHour">
        <div id="mod-workhour__dialog">
          <el-form :model="modWorkHourForm" ref="modWorkHourForm" :rules="rules" label-width="7.32vw" label-position="left">
            <el-form-item label="起止时间" prop="week">
              <el-date-picker v-model="modWorkHourForm.week" type="week" format="yyyy 第 WW 周" placeholder="选择周" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="工时" prop="avaTime">
              <el-input-number v-model="modWorkHourForm.avaTime" :controls="false"></el-input-number>
            </el-form-item>
            <el-form-item label="成员" prop="members">
              <member-icons :list="modWorkHourForm.members" @add="isShowUserList = true" @remove="removeMember"></member-icons>
            </el-form-item>
          </el-form>
          <div style="text-align: center">
            <el-button id="mod-workhour__cancel" @click="isModWorkHour = false" type="text">取消</el-button>
            <el-button id="mod-workhour__ensure" type="text" @click="modWorkHour">确定</el-button>
          </div>
        </div>
      </el-dialog>
      <div id="schedules__header">
        <div id="schedules__range">
          <el-button id="pre-month" type="text" icon="el-icon-arrow-left" @click="preMonth"></el-button>
          <div id="year-month">{{year}} 年 {{month}} 月</div>
          <el-button id="next-month" type="text" icon="el-icon-arrow-right" @click="nextMonth"></el-button>
        </div>
        <!-- <el-button id="filter" icon="el-icon-my-filter">筛选</el-button> -->
        <el-button id="workhour" @click="isReportWorkHour = true">汇报工时</el-button>
        <el-button id="modify" type="warning" v-if="profile.isPM" @click="isModWorkHour = true">修改工时</el-button>
      </div>
      <div id="schedules__body">
        <div class="weekadys" v-for="(day, index) in weekdays" :key="`wd${index}`">{{day}}</div>
        <div class="dates" v-for="(date, index) in dates" :key="`d${index}`" :ref="`date-${index}`">
          {{date && `${date}号`}}
          <p class="event" v-for="e in schedules[date]" :key="e.id" @click="$router.push(`/project/${e.projectId}`)">
            {{e.projectName}} - {{e.desc}}
            <span :style="statusColor(e.status)">{{e.status}}</span>
          </p>
        </div>
      </div>
      <user-list :isVisible.sync="isShowUserList" :list="users.users" v-model="modWorkHourForm.members"></user-list>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { date } from '@/utils';
import MemberIcons from '@/components/MemberIcons';
import UserList from '@/components/UserListDialog';


export default {
  name: 'Schedule',
  components: {
    'member-icons': MemberIcons,
    'user-list': UserList,
  },
  data() {
    return {
      weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      schedules: {},
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      isReportWorkHour: false,
      isModWorkHour: false,
      isShowUserList: false,
      startEnd: '',
      workHourForm: {
        week: '',
        avaTime: 40,
      },
      modWorkHourForm: {
        week: '',
        avaTime: 40,
        members: [],
      },
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          let nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          return time.getTime() > date.getWeekEnd(nextWeek);
        },
      },
    };
  },
  computed: {
    ...mapState(['profile', 'rules', 'users']),
    dates() {
      let monthStart = date.getFirstDayPosOfMonth(this.year, this.month);
      let monthEnd = date.getDateNumOfMonth(this.year, this.month);
      return date.genCalendar(monthStart, monthEnd);
    },
  },
  methods: {
    ...mapMutations(['updateUsers']),
    statusColor(status) {
      let color = status === '开始' ? '#259B24' : '#E6434C';
      return { color };
    },
    preMonth() {
      if (this.month - 1 === 0) {
        this.year--;
        this.month = 12;
      } else {
        --this.month;
      }
      this.getSchedules(this.year, this.month);
    },
    nextMonth() {
      if (this.month + 1 === 13) {
        ++this.year;
        this.month = 1;
      } else {
        ++this.month;
      }
      this.getSchedules(this.year, this.month);
    },
    getSchedules(year, month) {
      (year && month) ?
        this.$api.$sche.getSchedules((data) => {
          this.schedules = data;
        }, year, month)
        :
        this.$api.$sche.getSchedules((data) => { this.schedules = data; });
    },
    reportWorkHour() {
      this.$refs.workHourForm.validate((valid) => {
        if (valid) {
          let data = {
            startTime: date.format(date.getWeekStart(this.workHourForm.week), 'yyyy-MM-dd'),
            endTime: date.format(date.getWeekEnd(this.workHourForm.week), 'yyyy-MM-dd'),
            avaTime: this.workHourForm.avaTime,
          };
          this.$api.$sche.updateWorkHour(() => {
            this.isReportWorkHour = false;
          }, data);
        } else {
          this.$message.error('请检查格式');
        }
      });
    },
    removeMember(id) { // 处理事件添加框的成员变动
      this.modWorkHourForm.members = this.modWorkHourForm.members.filter(val => val.id !== id);
    },
    modWorkHour() {
      this.$refs.modWorkHourForm.validate((valid) => {
        if (valid) {
          let data = {
            startTime: date.format(date.getWeekStart(this.modWorkHourForm.week), 'yyyy-MM-dd'),
            endTime: date.format(date.getWeekEnd(this.modWorkHourForm.week), 'yyyy-MM-dd'),
            avaTime: this.modWorkHourForm.avaTime,
            members: this.modWorkHourForm.members.map(u => u.id).join(','),
          };
          this.$api.$sche.updateWorkHourByPM(() => {
            this.isModWorkHour = false;
          }, data);
        } else {
          this.$message.error('请检查格式');
        }
      });
    },
  },
  mounted() {
    this.getSchedules();
    this.users.users.length === 0
      && this.$api.$users.getUsersList(users => this.updateUsers(users));
  },
};
</script>
<style lang="scss" scoped>
#schedules__wrapper {
  margin: 42px 54px 0 54px;
  box-sizing: border-box;
  div {
    box-sizing: border-box;
    color: $black;
  }
}
#schedules__header {
  @include setSize(100%, 32px);
  overflow: hidden;
  margin-bottom: 10px;
  text-align: center;
}

#schedules__range {
  width: 200px;
  margin-left: 220px;
  display: inline-block;
}

#pre-month {
  vertical-align: middle;
}

#year-month {
  display: inline-block;
  margin: 0 10px;
}

#filter,
#workhour,
#modify {
  @include setSize(80px, 32px);
  padding: 10px 0;
  font-size: 12px;
  float: right;
  margin-left: 18px;
}

#filter {
  @include flex(center);
  background-color: #fff;
  padding: 0;
  color: $black;
}

#workhour {
  background-color: $default;
  color: #fff;
}

#schedules__body {
  @include setSize(100%, 76.823vh);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 40px repeat(6, 1fr);
  border: 1px solid #ddd;
  border-right: none;
}
.weekadys {
  border-right: 1px solid #ddd;
  text-align: center;
  font-size: 14px;
  padding: 13px 0;
}
.dates {
  border-right: 1px solid #ddd;
  border-top: 1px solid #ddd;
  padding: 5px;
  font-size: 13px;
  overflow-y: auto;
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
}
.event {
  color: $default;
  font-size: 12px;
  cursor: pointer;
}
#report-workhour__ensure {
  margin-left: 20px;
}
</style>

<style lang="scss">
#schedules__header {
  i.el-icon-my-filter {
    font-size: 20px;
  }
}
</style>
