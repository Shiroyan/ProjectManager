<template>
  <div>
    <el-carousel indicator-position="none" :autoplay="false" height="93.5vh" @change="tabChange">
      <el-carousel-item name="eval" id="eval__wrapper">
        <el-date-picker id="eval-year" v-model="year" @change="yearChange" type="year" align="center" placeholder="选择年份" format="yyyy 年" prefix-icon="none">
        </el-date-picker>
        <div id="add-eval__wrapper">
          <el-button @click="showAddEval" icon="el-icon-edit-outline" type="primary" id="add-eval" size="small">月度评价</el-button>
        </div>
        <div v-if="JSON.stringify(evaluation) === '{}'" id="no-evaluation-tips">
          暂无数据
        </div>
        <div id="eval-content__wrapper">
          <div class="eval__item" v-for="(e, key) in evaluation" :key="key">
            <el-button icon="el-icon-delete" type="text" class="del-eval" @click="delEval(12 - key)"></el-button>
            <el-button icon="el-icon-edit" type="text" class="edit-eval" @click="showEditEval(e, 12 - key)"></el-button>
            <div class="eval__month">{{`${12 - key}月`}}</div>
            <div class="eval__content">
              <div class="eval__content-item" v-for="i in e" :key="i.id">
                <span class="project-name">{{i.name}}</span>
                <el-rate class="project-ratio" :max="2" v-model="i.ratio" disabled show-score text-color="#ff9900" score-template="{value}">
                </el-rate>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item name="table" id="table__wrapper">
        <el-date-picker id="table-date" v-model="tableDate" @change="tableDateChange" type="month" align="center" placeholder="选择月份" format="yyyy 年 MM 月" prefix-icon="none">
        </el-date-picker>
        <el-table :data="tableData" id="evaluation__table" height="87vh">
          <template v-for="(h, index) in tableHeaders">
            <el-table-column :key="index" v-if="h.sub" :label="h.label" align="center" class-name="table-column">
              <el-table-column v-for="(s, index) in h.sub" :key="index" :prop="s.prop" :label="s.label" align="center"></el-table-column>
            </el-table-column>
            <el-table-column :key="index" v-else :prop="h.prop" :label="h.label" :fixed="h.prop === 'username'" align="center"></el-table-column>
          </template>
        </el-table>
      </el-carousel-item>
    </el-carousel>
    <el-dialog :visible.sync="isVisible" width="30%" custom-class="eval-dailog__wrapper" top="8vh">
      <div slot="title">
        <el-date-picker id="eval-month" v-model="month" @change="monthChange" type="month" align="center" placeholder="选择月份" format="yyyy 年 MM 月" prefix-icon="none">
        </el-date-picker>
      </div>
      <div class="form__item" v-for="(p, index) in projects" :key="index">
        <div class="form__label">{{p.name}}</div>
        <el-input-number v-model.number="p.ratio" :step="0.1" :controls="false" size="mini"></el-input-number>
      </div>
      <div slot="footer">
        <div style="text-align: center">
          <el-button plain size="small" @click="isVisible = false">取消</el-button>
          <el-button type="primary" size="small" @click="addOrUpdateEval">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { date } from '@/utils';

const ADD = 'add';
const EDIT = 'edit';

export default {
  data() {
    return {
      month: new Date(),
      year: new Date(),
      tableDate: new Date(),
      evaluation: [],
      projects: [],
      title: `${new Date().getMonth() + 1} 月`,
      isVisible: false,
      mode: ADD,
      tableData: [],
      tableHeaders: [],
    };
  },
  methods: {
    getProjects() {
      let thisMonth = date.format(this.month, 'yyyy-MM');
      this.$api.$evaluation.getProjcets(thisMonth, (data) => {
        this.projects = [];
        data.forEach(({ id, name }) => {
          this.projects.push({
            id,
            name,
            ratio: 0,
          });
        });
      });
    },
    getAllEvaluation() {
      this.$api.$evaluation.getAll(this.year.getFullYear(), (data) => {
        this.evaluation = data;
      });
    },
    yearChange() {
      this.getAllEvaluation();
    },
    monthChange() {
      this.getProjects();
    },
    tabChange(now, origin) {
      let temp = new Date(this.tableDate.getFullYear(), this.tableDate.getMonth());
      if (now === 1 && this.tableData.length === 0) {
        this.getTable(temp);
      }
    },
    showAddEval() {
      this.getProjects();
      this.month = new Date();
      this.isVisible = true;
      this.mode = ADD;
    },
    showEditEval(projects, month) {
      this.mode = EDIT;
      this.month = new Date(this.year.getFullYear(), month - 1);
      this.projects = JSON.parse(JSON.stringify(projects));
      this.isVisible = true;
    },
    delEval(month) {
      month = new Date(this.year.getFullYear(), +month - 1);
      let data = {
        date: date.format(month, 'yyyy-MM'),
      };
      this.$confirm('此操作将永久删除该评价, 是否继续?', '警告', {
        type: 'error',
        confirmButtonClass: 'confirm-delete',
      }).then(() => this.$api.$evaluation.delete(data, () => this.getAllEvaluation()))
        .catch(() => { });
    },
    addOrUpdateEval() {
      //  验证输入
      let isLegal = true;
      for (let { ratio } of this.projects) {
        if (ratio === undefined || ratio === '') {
          isLegal = false;
        }
      }
      if (isLegal) {
        let tempDate = date.format(this.month, 'yyyy-MM');
        let data = {
          date: tempDate,
          detail: JSON.stringify(this.projects),
        };
        let cb = () => {
          this.isVisible = false;
          this.getAllEvaluation();
        };
        if (this.mode === ADD) {
          this.$api.$evaluation.add(data, cb);
        } else {
          this.$api.$evaluation.update(data, cb);
        }
      }
    },
    tableDateChange() {
      this.getTable(this.tableDate);
    },
    getTable(date) {
      this.$api.$evaluation.table(+date, (data) => {
        this.tableData = data.rows;
        this.tableHeaders = data.headers;
      });
    },
  },
  created() {
    this.getAllEvaluation();
  },
};
</script>

<style lang="scss" scoped>
#eval__wrapper {
  box-sizing: border-box;
  padding: 20px 140px 20px 80px;
  div {
    box-sizing: border-box;
  }
}
#add-eval__wrapper {
  text-align: right;
  margin-bottom: 40px;
}
#add-eval {
  background-color: $default;
  border: none;
  &:hover,
  &:focus {
    opacity: 0.9;
  }
}

.form__item {
  margin-bottom: 15px;
  @include flex(flex-start);
}
.form__label {
  width: 75%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 10px;
  font-size: 14px;
  color: $tips;
}

#eval-content__wrapper {
  max-height: 75vh;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0px;
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
.eval__item {
  @include flex(flex-start);
  @include setSize(100%, 200px);
  padding: 10px 30px;
  position: relative;
  border-top: 1px solid #ddd;
  &:first-child {
    border: none;
  }
  &:hover {
    background-color: #fafafa;
    opacity: 0.8;
    .edit-eval,
    .del-eval {
      display: block;
    }
  }
  .edit-eval,
  .del-eval {
    position: absolute;
    top: 20px;
    font-size: 20px;
    padding: 0;
    display: none;
  }

  .edit-eval {
    color: $default;
    right: 80px;
  }

  .del-eval {
    color: $danger;
    right: 40px;
    &:hover,
    &:focus {
      color: $danger;
    }
  }
}

.eval__month {
  width: 25%;
  font-size: 32px;
  color: $default;
}
.eval__content {
  width: 75%;
}
.eval__content-item {
  display: inline-block;
  margin: 0 40px 10px 0;
  font-size: 14px;
  line-height: 1.5;
  list-style-type: disc;
  width: 200px;
}
.project-name {
  width: 110px;
  color: $black;
  margin-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.project-name,
.project-ratio {
  display: inline-block;
  vertical-align: middle;
}
#no-evaluation-tips {
  margin-top: 200px;
  text-align: center;
  color: $black;
  font-size: 32px;
}
</style>

<style lang="scss" scoped>
#table__wrapper {
  box-sizing: border-box;
  overflow: auto;
}
#evaluation__table {
  width: 100%;
  overflow: auto;
}
</style>

<style lang="scss">
#eval-year,
#eval-month,
#table-date {
  border: none;
  font-size: 32px;
  padding: 0;
  margin-bottom: 10px;
}
#eval-month {
  font-size: 20px;
}
#table-date {
  font-size: 20px;
}
.eval-dailog__wrapper {
  max-height: 80vh;
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
  .el-input-number--mini {
    width: 20%;
  }
}
.el-table--border {
  th,
  td {
    border-color: #ccc !important;
  }
}
.confirm-delete {
  background-color: $danger !important;
  color: #fff !important;
  border: none !important;
}
</style>
