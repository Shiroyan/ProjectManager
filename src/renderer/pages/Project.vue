<template>
  <div id="project__wrapper">
    <el-tabs v-model="tab" @tab-click="handleClick" id="project__wrapper">
      <el-tab-pane label="基本信息" name="info">
        <div id="info__wrapper">
          <el-button type="danger" icon="el-icon-delete" id="delete" v-if="profile.role===0 || profile.role===1" @click="del">删除</el-button>
          <el-button icon="el-icon-edit" id="edit" v-if="profile.role===0 || profile.role===1" @click="edit">编辑</el-button>
          <div id="info__name" class="info__item">{{info.name}}</div>
          <p id="info__start-end" class="info__item">{{info.startTime}} ~ {{info.endTime}}</p>
          <div class="info__item">
            <div class="info__label">合同</div>
            <a id="info__contract" :href="`${baseUrl}${info.contract}`">附件</a>
            <div class="info__label">合同金额</div>
            <span id="info__contract-val">{{info.contractVal}}</span>
          </div>
          <div class="info__item">
            <div class="info__label">甲方</div>
            <p id="info__firstParty">{{info.firstParty}}</p>
          </div>
          <div class="info__item">
            <div class="info__label">负责人</div>
            <user-avatar id="info__leader" :username="info.leader.username" :job="info.leader.jobId">
            </user-avatar>
          </div>
          <div class="info__item">
            <div class="info__label">成员</div>
            <user-avatar class="info__members" v-for="u in info.members" :key="u.id" :username="u.username" :job="u.jobId"></user-avatar>
          </div>
          <div class="info__item">
            <div class="info__label">进度</div>
            <el-progress id="info__progress" :text-inside="true" :stroke-width="16" :percentage="info.process" :status="info.process === 100 ? 'success': ''"></el-progress>
          </div>
          <div class="info__item">
            <div class="info__label">阶段</div>
            <span id="info__stage">{{info.stageName}}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="计划" name="plans">
        <div id="plans__container">
          <div class="plan__wrapper"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Q & A" name="bugs" disabled>
      </el-tab-pane>
    </el-tabs>>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import UserAvatar from '@/components/UserAvatar';
import { baseUrl } from '@/api';

export default {
  components: {
    'user-avatar': UserAvatar,
  },
  data() {
    return {
      tab: 'info',
      projectId: '',
      info: {
        name: '',
        startTime: '',
        endTime: '',
        contract: '',
        contractVal: '',
        firstParty: '',
        leader: { username: '', jobId: 0 },
        members: [],
        process: 0,
        stageName: '',
      },
      baseUrl,
    };
  },
  computed: mapState(['profile']),
  methods: {
    handleClick(tab, name) {

    },
    getPlans() {

    },
    del() {

    },
    edit() {

    },
  },
  created() {
    this.projectId = this.$route.params.projectId;
    this.$api.$projects.getProjectInfo(this.projectId, (data) => {
      this.info = data;
    });
  },
};
</script>
<style lang="scss" scoped>
#info__wrapper {
  margin: 54px 0 0 62px;
  font-size: 14px;
  color: $black;
  position: relative;
}

#edit,
#delete {
  @include setSize(84px,32px);
  position: absolute;
  top: -30px;
  font-size: 12px;
  padding: 10px 0;
}

#edit {
  right: 328px;
  &:hover {
    background-color: #eee;
    color: $default;
  }
}

#delete {
  right: 224px;
}

.info__item {
  @include flex(flex-start);
  height: 36px;
  margin-bottom: 30px;
}
.info__label {
  width: 70px;
  color: $tips;
  vertical-align: middle;
}
#info__name {
  font-size: 28px;
  color: #212121;
}

#info__start-end {
  color: $tips;
  letter-spacing: 1px;
}

#info__leader,
.info__members {
  margin-right: 10px;
}

#info__contract {
  color: $default;
  cursor: pointer;
  text-decoration: underline;
  margin-right: 70px;
}
#info__contract-val {
  margin-left: 20px;
  color: #2e2e2e;
}
#info__progress {
  width: 180px;
}
#plans__container {
  margin-top: 54px;
}
.plan__wrapper {
  @include setSize(250px, 610px);
  background-color: #eee;
  border-radius: 5px;
}
</style>

<style lang="scss">
#project__wrapper {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__nav-wrap {
    width: 500px;
    margin: 0 auto;
  }
}
</style>