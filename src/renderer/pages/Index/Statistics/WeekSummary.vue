<template>
  <div>
    <el-popover ref="findHistory" placement="bottom" width="18.301vw" v-model="isFindHistory">
      <div id="find-history__dialog">
        <p>起止时间</p>
        <date-time-picker v-model="historyStartEnd"></date-time-picker>
        <div style="text-align: center">
          <el-button id="find__cancel" @click="isFindHistory = false" type="text">取消</el-button>
          <el-button id="find__ensure" @click="findHistory" type="text">确定</el-button>
        </div>
      </div>
    </el-popover>
    <el-dialog :visible.sync="isGenReport" center width="27.818vw" custom-class="gen-report__dialog">
      <div id="content">
        <div class="form__item">
          <div class="form__label">时间</div>
          <date-time-picker v-model="reportStartEnd"></date-time-picker>
        </div>
        <div class="form__item">
          <div class="form__label">类型</div>
          <el-radio-group v-model="reportType">
            <el-radio label="plan">计划</el-radio>
            <el-radio label="real">实际</el-radio>
          </el-radio-group>
        </div>
        <p style="font-size:12px;color:#9e9e9e;margin:0;" v-show="reportType==='real'">* 实际表最新数据只有上周的~</p>
      </div>
      <div slot="footer">
        <el-button id="gen-report__ensure" plain @click="genReport">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isGenMonthReport" center width="27.818vw" custom-class="gen-report__dialog">
      <div style="text-align: center">
        <el-date-picker id="month-report__picker" v-model="month" :picker-options="onlyBeforeThisMonth" type="month" align="center" placeholder="选择月份" format="yyyy 年 MM 月"></el-date-picker>
      </div>
      <div slot="footer">
        <el-button id="gen-report__ensure" plain @click="genMonthReport">确认</el-button>
      </div>
    </el-dialog>
    <div class="btns">
      <el-button id="gen-month-report" class="btn" icon="el-icon-my-gen-report" plain @click="isGenMonthReport = true">生成月报</el-button>
      <el-button id="gen-report" class="btn" icon="el-icon-my-gen-report" plain @click="isGenReport = true">生成报表</el-button>
      <el-button id="find-history" class="btn" icon="el-icon-my-history" plain v-popover:findHistory>查找记录</el-button>
    </div>
    <h1 id="summary__time">{{sysChanges.startTime}} ~ {{sysChanges.endTime}}</h1>
    <div id="members__change">
      <p class="summary__title">人员变动</p>
      <div id="summary__new-members" class="summary__item">
        <div class="summary__label">新增</div>
        <span class="summary__value" v-for="(name, index) in sysChanges.newMembers" :key="index">{{name}}</span>
      </div>
      <div id="summary__del-members" class="summary__item">
        <div class="summary__label">离职</div>
        <span class="summary__value" v-for="(name, index) in sysChanges.delMembers" :key="index">{{name}}</span>
      </div>
    </div>
    <div id="projects__change">
      <p class="summary__title">项目动态</p>
      <div id="summary__new-projects" class="summary__item">
        <div class="summary__label">新增</div>
        <span class="summary__value" v-for="(name, index) in sysChanges.newProjects" :key="index">{{name}}</span>
      </div>
      <div id="summary__del-projects" class="summary__item">
        <div class="summary__label">删除</div>
        <span class="summary__value" v-for="(name, index) in sysChanges.delProjects" :key="index">{{name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import DateTimePicker from '@/components/DateTimePicker';
import { date } from '@/utils';

const LAST_DATE = date.getLastDateOfMonth();

export default {
  name: 'WeekSummary',
  components: {
    'date-time-picker': DateTimePicker,
  },
  props: {
    sysChanges: {
      type: Object,
      default() {
        return {
          startTime: '',
          endTime: '',
          newMembers: [],
          delMembers: [],
          newProjects: [],
          delProjects: [],
        };
      },
    },
  },
  data() {
    return {
      isFindHistory: false,
      isGenReport: false,
      isGenMonthReport: false,
      historyStartEnd: [],
      month: new Date(),
      reportStartEnd: [
        date.format(date.getWeekStart(), 'yyyy-MM-dd hh:mm:ss'),
        date.format(date.getWeekEnd(), 'yyyy-MM-dd hh:mm:ss'),
      ],
      reportType: 'plan',
      onlyBeforeThisMonth: {
        disabledDate(time) {
          return time > LAST_DATE;
        },
      },
    };
  },
  methods: {
    valiDate(data) {
      let startTime = data[0];
      let endTime = data[1];
      if (!startTime || !endTime) {
        this.$message.error({ message: '请选择日期', center: true });
        return false;
      }
      startTime = date.format(new Date(startTime), 'yyyy-MM-dd');
      endTime = date.format(new Date(endTime), 'yyyy-MM-dd');
      return { startTime, endTime };
    },
    findHistory() {
      let isValid = this.valiDate(this.historyStartEnd);
      if (isValid) {
        let { startTime, endTime } = isValid;
        this.$emit('findHistory', startTime, endTime);
      }
    },
    genReport() {
      let isValid = this.valiDate(this.reportStartEnd);
      if (isValid) {
        let { startTime, endTime } = isValid;
        this.$emit('genReport', startTime, endTime, this.reportType, () => {
          this.isGenReport = false;
        });
      }
    },
    genMonthReport() {
      let month = date.format(this.month, 'yyyy-MM');
      this.$emit('genMonthReport', month, () => {
        this.isGenMonthReport = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.btns {
  width: 100%;
  overflow: hidden;
  #find-history,
  #gen-report,
  #gen-month-report {
    float: right;
    margin-right: 15px;
    &:hover,
    &:focus {
      color: $default;
      border-color: $default;
    }
  }
  #gen-month-report {
    margin-right: 60px;
  }
  .btn {
    @include setSize(110px, 32px);
    padding: 6px;
    font-size: 13px;
  }
}

#summary__time,
#members__change,
#projects__change {
  margin-left: 10px;
  margin-top: 50px;
}
#summary__time {
  margin-top: 50px;
  font-size: 32px;
  color: #2e2e2e;
}
.summary__item {
  @include flex(flex-start);
  margin-bottom: 10px;
}
.summary__title {
  color: $tips;
  font-size: 16px;
  margin-bottom: 17px;
}
.summary__label {
  margin: 0 20px 0 65px;
  color: $black;
  font-size: 14px;
}
.summary__value {
  margin-right: 10px;
  color: #2e2e2e;
  font-size: 14px;
}
#find-history__dialog {
  text-align: center;
  margin: 10px auto 0 auto;
}
#find__cancel {
  color: $black;
  margin-right: 20px;
}
.form__item {
  margin-bottom: 30px;
}
.form__label {
  display: inline-block;
  margin-right: 40px;
  vertical-align: baseline;
  color: $tips;
}
</style>

<style lang="scss">
i.el-icon-my-history,
i.el-icon-my-gen-report {
  font-size: 20px !important;
  vertical-align: middle;
  & + span {
    vertical-align: middle;
  }
}

#find-history__dialog {
  .el-date-editor .el-range__close-icon {
    width: 0;
  }
}

#month-report__picker {
  border: none;
}
</style>

