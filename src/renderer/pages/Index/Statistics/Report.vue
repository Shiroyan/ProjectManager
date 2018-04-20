<template>
  <div id="report__wrapper">
    <el-popover ref="findHistory" placement="bottom" width="18.301vw" v-model="isFindHistory">
      <div id="find-history__dialog">
        <p>起止时间</p>
        <date-time-picker v-model="historyStartEnd"></date-time-picker>
        <div style="text-align: center">
          <el-button id="find__cancel" @click="isFindHistory = false" type="text">取消</el-button>
          <el-button id="find__ensure" @click="findHistoryReport" type="text">确定</el-button>
        </div>
      </div>
    </el-popover>
    <div class="btns">
      <el-button id="find-history" class="btn" icon="el-icon-my-history" plain v-popover:findHistory>查找记录</el-button>
    </div>
    <div id="report__header">
      <div class="report__item" id="report__timerange">
        <div class="report__label">起止时间</div>
        <i class="el-icon-time"></i>
        <span class="report__val">{{report.startTime}}</span> ~
        <i class="el-icon-time"></i>
        <span class="report__val">{{report.endTime}}</span>
      </div>
      <template v-if="type==='plan'">
        <div class="report__item--inline">
          <div class="report__label">可用/计划</div>
          <span class="report__val">{{report.avaTime}}h</span> /
          <span class="report__val">{{report.planTime}}h</span>
        </div>
        <div class="report__item--inline">
          <div class="report__label" title="> 0,忙 < 0,闲">空闲预警</div>
          <span class="report__val" :style="busyTimeColor">{{report.busyTime}}h</span>
        </div>
      </template>
      <template v-else>
        <div class="report__item">
          <div class="report__item--inline">
            <div class="report__label">可用/计划/实际/核准</div>
            <span class="report__val">{{report.avaTime}}h</span> /
            <span class="report__val">{{report.planTime}}h</span> /
            <span class="report__val">{{report.realTime}}h</span> /
            <span class="report__val">{{report.approval}}h</span>
          </div>
          <div class="report__item--inline">
            <div class="report__label" title="> 0,忙 < 0,闲">空闲预警</div>
            <span class="report__val" :style="busyTimeColor">{{report.busyTime}}h</span>
          </div>
          <div class="report__item--inline">
            <div class="report__label">忙闲/优差持续</div>
            <span class="report__val">{{report.busyCnt}}</span> /
            <span class="report__val">{{report.badCnt}}</span>
          </div>
        </div>
        <div class="report__item">
          <div class="report__item--inline">
            <div class="report__label" title="计划偏差值(实际-计划) >= 8 标绿 <=-8 标红">计划偏差值</div>
            <span class="report__val" :style="planOffsetColor">{{report.planOffset}}h</span>
          </div>
          <div class="report__item--inline">
            <div class="report__label" title="实际偏差值(实际-可用) >= 8 标绿 <=-8 标红">实际偏差值(今周/上周)</div>
            <span class="report__val" :style="realOffsetColor">{{report.realOffset}}h</span> /
            <span class="report__val" :style="lRealOffsetColor">{{report.lastWeekRealOffset}}h</span>
          </div>
          <div class="report__item--inline">
            <div class="report__label" title="核准/实际">效率(今周/上周)</div>
            <span class="report__val" :style="effectColor">{{report.effect}}</span> /
            <span class="report__val" :style="lEffectColor">{{report.lastWeekEff}}</span>
          </div>
        </div>
      </template>
    </div>
    <div id="report__chart" ref="chart">
    </div>
    <div v-if="report.projects.length === 0" class="no-data-tips">暂无数据</div>
  </div>
</template>

<script>
import ECharts from 'echarts/lib/echarts';
import Pie from 'echarts/lib/chart/pie';
import Tooltip from 'echarts/lib/component/tooltip';
import VisualMap from 'echarts/lib/component/visualMap';
import DateTimePicker from '@/components/DateTimePicker';
import { date } from '@/utils';

export default {
  name: 'Report',
  components: {
    'date-time-picker': DateTimePicker,
  },
  props: {
    report: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: 'plan',
    },
  },
  data() {
    return {
      historyStartEnd: [],
      isFindHistory: false,
      pie: undefined,
    };
  },
  computed: {
    busyTimeColor() {
      return this.getFontColor(this.report.busyTime);
    },
    planOffsetColor() {
      return this.getFontColor(this.report.planOffset);
    },
    realOffsetColor() {
      return this.getFontColor(this.report.realOffset);
    },
    lRealOffsetColor() {
      return this.getFontColor(this.report.lastWeekRealOffset);
    },
    effectColor() {
      return this.getFontColor(this.report.effect, true);
    },
    lEffectColor() {
      return this.getFontColor(this.report.lastWeekEff, true);
    },
    planChartData() {
      let data = this.report.projects.map((project) => {
        let { planTime, realTime, name, id } = project;
        if (this.type === 'real') {
          return { value: realTime, name, id };
        }
        return { value: planTime, name, id };
      });
      return data;
    },
    approvalData() {
      if (this.type === 'real') {
        let data = this.report.projects.map((project) => {
          let { approval, name, id } = project;
          return { value: approval, name, id };
        });
        return data;
      }
      return [];
    },
  },
  methods: {
    getFontColor(val, ragneChange = false) {
      let color = '#5e5e5e';
      let greenLimit = ragneChange ? 1.2 : 8;
      let redLimit = ragneChange ? 0.8 : -8;
      if (val >= greenLimit) { // >=8 忙，标绿
        color = '#259B24';
      }
      if (val <= redLimit) { // <=-8 闲, 标红
        color = '#E51C23';
      }
      return { color };
    },
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
    findHistoryReport() {
      let isValid = this.valiDate(this.historyStartEnd);
      if (isValid) {
        let { startTime, endTime } = isValid;
        this.$emit('findHistoryReport', startTime, endTime, this.type);
      }
    },
  },
  updated() {
    if (this.type === 'plan') {
      this.pie && this.pie.setOption({
        series: [{
          data: this.planChartData,
        }],
      });
    } else {
      this.pie && this.pie.setOption({
        series: [
          {
            data: this.approvalData,
          },
          {
            data: this.planChartData,
          }],
      });
    }
  },
  mounted() {
    let seriesName = '计划时间';
    if (this.type === 'real') {
      seriesName = '实际时间';
    }
    let formatter = `{projectName|{b}}\n{label|${seriesName}}   {per|{c}h}\n{label|占比}   {per|{d}%}`;

    let option = {
      backgroundColor: '#fff',

      tooltip: {
        trigger: 'item',
        padding: 10,
        textStyle: {
          lineHeight: 20,
        },
        extraCssText: 'text-align:center;',
        formatter: '{a} <br/>{b} : {c}h <br/ > 占比 {d}%',
      },

      visualMap: {
        show: false,
        min: -10,
        max: 50,
        inRange: {
          colorLightness: [0, 0.8],
        },
      },
      series: [

      ],
    };

    let baseSeries = {
      name: seriesName,
      type: 'pie',
      radius: '70%',
      center: ['45%', '50%'],
      data: [],

      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200;
      },
    };


    this.pie = ECharts.init(this.$refs.chart);

    if (this.type === 'plan') {
      let temp = Object.assign({}, baseSeries);
      let formatter = '{projectName|{b}}\n{label|计划时间}   {per|{c}h}\n{label|占比}   {per|{d}%}';
      let planSerie = Object.assign(temp, {
        name: '计划时间',
        roseType: 'radius',
        label: {
          normal: {
            formatter,
            backgroundColor: '#fff',
            width: 150,
            height: 100,
            padding: [15, 20],
            borderWidth: 1,
            borerColor: '#ddd',
            shadowColor: '#dedede',
            shadowBlur: 5,
            textStyle: {
              fontSize: 14,
              color: '#5E5E5E',
              lineHeight: 30,
              align: 'center',
            },
            rich: {
              projectName: {
                color: '#5E5E5E',
                fontSize: 16,
                align: 'center',
              },
              label: {
                color: '#9e9e9e',
                fontSize: 14,
                align: 'center',
              },
              per: {
                fontWeight: 'bold',
                align: 'center',
                fontSize: 14,
              },
            },
          },
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: '#5E5E5E',
            },
            smooth: 0.2,
            length: 20,
            length2: 20,
          },
        },
        itemStyle: {
          normal: {
            color: '#3f51b5',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      });
      option.series.push(planSerie);
      this.pie.setOption(option);
    } else {
      let temp1 = Object.assign({}, baseSeries);
      let temp2 = Object.assign({}, baseSeries);
      let formatter1 = '{projectName|{b}}\n{label|实际时间}   {per|{c}h}\n{label|占比}   {per|{d}%}';
      let formatter2 = '{projectName|{b}}\n{label|核准时间}   {per|{c}h}\n{label|占比}   {per|{d}%}';

      let realSeries = Object.assign(temp1, {
        name: '实际时间',
        radius: ['40%', '55%'],
        label: {
          normal: {
            formatter: formatter1,
            backgroundColor: '#fff',
            width: 150,
            height: 100,
            padding: [15, 20],
            borderWidth: 1,
            borerColor: '#ddd',
            shadowColor: '#dedede',
            shadowBlur: 5,
            textStyle: {
              fontSize: 14,
              color: '#5E5E5E',
              lineHeight: 30,
              align: 'center',
            },
            rich: {
              projectName: {
                color: '#5E5E5E',
                fontSize: 16,
                align: 'center',
              },
              label: {
                color: '#9e9e9e',
                fontSize: 14,
                align: 'center',
              },
              per: {
                fontWeight: 'bold',
                align: 'center',
                fontSize: 14,
              },
            },
          },
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: '#5E5E5E',
            },
            smooth: 0.2,
            length: 20,
            length2: 20,
          },
        },
      });
      let approvalSeries = Object.assign(temp2, {
        name: '核准时间',
        radius: [0, '30%'],

        label: {
          normal: {
            position: 'inner',
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      });
      option.series.push(approvalSeries, realSeries);
      this.pie.setOption(option);
    }

    this.pie.on('click', ({ data }) => {
      let { id } = data;
      id && this.$router.push(`/project/${id}`);
    });
  },
};
</script>

<style lang="scss" scoped>
#report__wrapper {
  padding-left: 10px;
  position: relative;
}
.report__item {
  margin-bottom: 20px;
}
.report__item--inline {
  display: inline-block;
  margin-right: 80px;
}
.report__label {
  color: $tips;
  display: inline-block;
  margin-right: 20px;
  font-size: 14px;
}
#report__timerange {
  .el-icon-time,
  .report__val {
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px;
  }
  .el-icon-time {
    font-size: 16px;
  }
}
.report__val {
  color: $black;
  font-size: 14px;
}
#report__chart {
  @include setSize(73.206vw, 67.661vh);
  overflow: auto;
}

.btns {
  width: 100%;
  overflow: hidden;
  #find-history {
    float: right;
    margin-right: 60px;
    &:hover,
    &:focus {
      color: $default;
      border-color: $default;
    }
  }
  .btn {
    @include setSize(110px, 32px);
    padding: 6px;
    font-size: 13px;
  }
}
.no-data-tips {
  @include absTL(200px, 400px);
  font-size: 18px;
  color: $tips;
}
</style>
