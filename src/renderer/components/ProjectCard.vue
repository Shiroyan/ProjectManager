<template>
  <el-card class="project" @click.native="to">
    <div slot="header" class="header">
      <span class="project__name">{{name}}</span>
      <span class="project__begin-end">{{startTime}} - {{endTime}}</span>
    </div>
    <div>
      <div class="project__leader">
        <span class="project__label">负责人</span>
        <span class="project__value">{{leader}}</span>
      </div>
      <div class="project__members">
        <span class="project__label">成员</span>
        <span class="project__value">{{members}}</span>
      </div>
      <div class="project__process">
        <span class="project__label">进度</span>
        <span class="project__value">
          <el-progress id="progress" :text-inside="true" :stroke-width="16" :percentage="process" :status="process === 100 ? 'success': ''"></el-progress>
        </span>
      </div>
      <div class="project__stage">
        <span class="project__label">阶段</span>
        <span class="project__value">{{stage}}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    leader: { type: String, required: true },
    members: { type: String, required: true },
    process: { type: Number, required: true },
    stage: { type: String, required: true },
  },
  methods: {
    to() { this.$router.push(`/project/${this.id}`); },
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
  cursor: pointer;
  &:hover {
    background-color: $mask;
  }
}

.project__name {
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
  vertical-align: text-top;
  word-wrap: break-word;
  word-break: normal;
}

#progress {
  width: 180px;
}
</style>
