<template>
  <div>
    <div id="schedules__wrapper">
      <div id="schedules__header">
        <div id="schedules__range"></div>
        <el-button id="filter" icon="el-icon-my-filter">筛选</el-button>
        <el-button id="workhour">汇报工时</el-button>
        <el-button id="modify" type="warning" v-if="profile.isPM">修改工时</el-button>
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { date } from '@/utils';


export default {
  name: 'Schedule',
  data() {
    return {
      weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dates: date.genCalendar(),
      schedules: {},
    };
  },
  computed: {
    ...mapState(['profile']),
  },
  methods: {
    statusColor(status) {
      let color = status === '开始' ? '#259B24' : '#E6434C';
      return { color };
    },
    getSchedules(year, month) {
      (year && month) ?
        this.$api.$sche.getSchedules((data) => {
          this.schedules = data;
        }, year, month)
        :
        this.$api.$sche.getSchedules((data) => { this.schedules = data; });
    },
  },
  mounted() {
    this.getSchedules();
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
  @include setSize(1212px, 590px);
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
</style>

<style lang="scss">
#schedules__header {
  i.el-icon-my-filter {
    font-size: 20px;
  }
}
</style>
