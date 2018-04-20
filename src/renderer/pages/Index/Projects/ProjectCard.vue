<template>
  <el-card class="project" @click.native="to">
    <div slot="header" class="header">
      <span class="project__name">{{data.name}}</span>
      <span class="project__begin-end">{{data.startTime}} - {{data.endTime}}</span>
    </div>
    <div>
      <div class="project__leader">
        <span class="project__label">负责人</span>
        <span class="project__value">{{data.leaders.join(',')}}</span>
      </div>
      <div class="project__members">
        <span class="project__label">成员</span>
        <span class="project__value">{{data.members.join(',')}}</span>
      </div>
      <div class="project__process">
        <span class="project__label">进度</span>
        <span class="project__value">
          <el-progress id="progress" :text-inside="true" :stroke-width="16" :percentage="+data.process" :status="data.process === 100 ? 'success': ''"></el-progress>
        </span>
      </div>
      <div class="project__stage">
        <span class="project__label">阶段</span>
        <span class="project__value">{{data.stage}}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    to() { this.$router.push(`/project/${this.data.id}`); },
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  overflow: hidden;
}

.project {
  @include setSize(300px, 220px);
  display: inline-block;
  margin-right: 30px;
  margin-bottom: 30px;
  cursor: pointer;
  &:hover {
    background-color: $mask;
  }
}

.project__name {
  width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  float: left;
  vertical-align: middle;
  color: $black;
}

.project__begin-end {
  font-size: 12px;
  color: $tips;
  float: right;
  line-height: 17px;
}

.project__label {
  color: $tips;
  width: 50px;
}
.project__value {
  color: $black;
}

.project__label,
.project__value {
  font-size: 12px;
  display: inline-block;
  line-height: 17px;
}

.project__leader,
.project__members,
.project__process,
.project__stage {
  margin-bottom: 12px;
}

.project__members .project__value {
  width: 200px;
  max-height: 50px;
  vertical-align: text-top;
  word-wrap: break-word;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

#progress {
  width: 180px;
}
</style>
