<template>
  <div id="projects__wrapper">
    <el-tabs v-model="tab" @tab-click="handleClick">
      <el-tab-pane label="进行中" name="1">
        <h2 v-if="projects1.length===0" class="no-data-tips">暂无数据</h2>
        <project-card v-for="project in projects1" :key="project.id" :id="project.id" :name="project.name" :startTime="project.startTime" :endTime="project.endTime" :leader="project.leader" :members="project.members" :process="+project.process" :stage="project.stage">
        </project-card>
      </el-tab-pane>
      <el-tab-pane label="立项中" name="2">
        <h2 v-if="projects2.length===0" class="no-data-tips">暂无数据</h2>
        <project-card v-for="project in projects2" :key="project.id" :id="project.id" :name="project.name" :startTime="project.startTime" :endTime="project.endTime" :leader="project.leader" :members="project.members" :process="+project.process" :stage="project.stage">
        </project-card>
      </el-tab-pane>
      <el-tab-pane label="已结项" name="3">
        <h2 v-if="projects3.length===0" class="no-data-tips">暂无数据</h2>
        <project-card v-for="project in projects3" :key="project.id" :id="project.id" :name="project.name" :startTime="project.startTime" :endTime="project.endTime" :leader="project.leader" :members="project.members" :process="+project.process" :stage="project.stage">
        </project-card>
      </el-tab-pane>
    </el-tabs>
    <el-button icon="el-icon-circle-plus" id="add-project" @click="isVisible = true">新增项目</el-button>
    <project-dialog :isVisible.sync="isVisible"></project-dialog>
  </div>
</template>

<script>
import ProjectCard from '@/components/ProjectCard';
import ProjectDialog from '@/components/ProjectDialog';

export default {
  name: 'Projects',
  components: {
    'project-card': ProjectCard,
    'project-dialog': ProjectDialog,
  },
  data() {
    return {
      tab: '1',
      projects1: [], //  进行中的项目
      projects2: [], //  立项中的项目
      projects3: [], //  已结项的项目
      hadReqest: ['project1'], //  控制TAB的请求，已请求过的不再请求
      isVisible: false,
    };
  },
  methods: {
    handleClick(tab, event) {
      let type = tab.name;
      let propName = `projects${type}`;
      !this.hadReqest.includes(propName)
        && this.$api.$projects.getAllProjects(type, ({ projects }) => {
          this[propName] = projects;
          this.hadReqest.push(propName);
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$api.$projects.getAllProjects(1, ({ projects }) => {
        vm.projects1 = projects;
      });
    });
  },
};
</script>
<style lang="scss" scoped>
#add-project {
  @include absTR(54px, 248px);
  @include setSize(94px, 36px);
  padding: 0;
  text-align: center;
  font-size: 12px;
  color: $black;
  &:hover,
  &:focus {
    color: $default;
    background-color: $mask;
  }
}
.no-data-tips {
  margin: 200px auto 0 auto;
  width: 200px;
  color: $tips;
}
</style>
<style lang="scss">
#add-project {
  i[class^="el-icon"] {
    font-size: 24px !important;
    vertical-align: middle;
  }
  span {
    display: inline-block;
    color: #2e2e2e;
    vertical-align: text-bottom;
  }
}
</style>


