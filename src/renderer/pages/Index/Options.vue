<template>
  <div>
    <div id="options__wrapper">
      <div class="options__list" v-for="(o, i) in optionsList" :key="i">
        <div class="list-title">{{o.title}}</div>
        <div class="list-item__wrapper" v-for="d in o.data" :key="d.id" :class="{'list-item__wrapper--edit': `${o.type}-${d.id}` === showEdit}" v-if="!(o.type==='job'&& d.id === 5)">
          <div class="list-item">
            <div class="list-item__left">{{d.name}}</div>
            <div class="list-item__right">
              <el-button icon="el-icon-edit" type="text" class="edit" @click="o.curId = d.id; o.curName = d.name; showEdit = `${o.type}-${d.id}`"></el-button>
              <el-button icon="el-icon-delete" type="text" class="delete" @click="showConfirmDialog(o.type, d.id)"></el-button>
            </div>
          </div>
          <div class="list-item--edit">
            <div class="list-item__left">
              <el-input v-model="o.curName"></el-input>
            </div>
            <div class="list-item__right">
              <el-button type="text" icon="el-icon-check" class="save" @click="update(o.type, o.curId, {name: o.curName})"></el-button>
              <el-button type="text" icon="el-icon-close" class="cancel" @click="showEdit = ''"></el-button>
            </div>
          </div>
        </div>
        <div class="list-item--add" v-show="showInput === o.type">
          <div class="list-item__left">
            <el-input v-model="o.curName"></el-input>
          </div>
          <div class="list-item__right">
            <el-button type="text" icon="el-icon-check" class="save" @click="add(o.type, {name: o.curName})"></el-button>
            <el-button type="text" icon="el-icon-close" class="cancel" @click="showInput = ''"></el-button>
          </div>
        </div>
        <el-button icon="el-icon-circle-plus" type="text" class="add-list-item" @click="showInput = o.type; o.curName='';">添加</el-button>
      </div>
      <div id="stage-list" class="options__list">
        <div class="list-title">项目阶段</div>
        <el-collapse v-model="activeStage" class="stage-list__wrapper">
          <el-collapse-item v-for="s in stages.stages" :key="s.id" :title="s.name" :name="s.id" class="stage-list__item">
            <div class="body">
              <div>
                <span class="label">分类</span>
                <span class="content" v-if="s.status === 1">进行中</span>
                <span class="content" v-else-if="s.status === 2">立项中</span>
                <span class="content" v-else>已结项</span>
              </div>
              <div>
                <span class="label">描述</span>
                <span class="content">
                  {{s.desc}}
                </span>
              </div>
            </div>
            <div class="footer">
              <el-button type="text" class="edit" @click="showStageDialog('edit', s)">编辑</el-button>
              <el-button type="text" class="delete" @click="showConfirmDialog('stage', s.id)">删除</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-button icon="el-icon-circle-plus" type="text" class="add-list-item" @click="showStageDialog('add')">添加</el-button>
      </div>
      <el-dialog :visible.sync="isShowStage" custom-class="stage-form" width="30%">
        <el-form :model="stageForm" :rules="rules" ref="stageForm" label-position="left">
          <el-form-item label="阶段名称" prop="stageName">
            <el-input v-model="stageForm.stageName" placeholder="阶段名称"></el-input>
          </el-form-item>
          <el-form-item label="阶段描述" prop="stageDesc">
            <el-input type="textarea" v-model="stageForm.stageDesc" resize="none" placeholder="阶段描述"></el-input>
          </el-form-item>
          <el-form-item label="阶段分类" prop="stageStatus">
            <el-radio v-model="stageForm.stageStatus" :label="1">进行中</el-radio>
            <el-radio v-model="stageForm.stageStatus" :label="2">立项中</el-radio>
            <el-radio v-model="stageForm.stageStatus" :label="3">已结项</el-radio>
          </el-form-item>
          <div style="text-align: center; margin-top: 20px;">
            <el-button type="text" size="small" @click="isShowStage = false" class="cancel">取消</el-button>
            <el-button type="primary" size="small" @click="ensure" class="ensure">
              {{stageForm.mode === 'edit' ? '确定' : '创建'}}
            </el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Options',
  data() {
    return {
      showInput: '',
      showEdit: '',
      activeStage: 1,
      isShowStage: false,
      stageForm: {
        mode: 'add',
        id: -1,
        stageName: '',
        stageDesc: '',
        stageStatus: 1,
      },
    };
  },
  computed: {
    ...mapState(['options', 'stages', 'tags', 'rules']),
    optionsList() {
      return [
        {
          type: 'dep',
          title: '部门',
          data: this.options.deps,
          curId: -1,
          curName: '',
        },
        {
          type: 'job',
          title: '岗位',
          data: this.options.jobs,
          curId: -1,
          curName: '',
        },
        {
          type: 'city',
          title: '城市',
          data: this.options.citys,
          curId: -1,
          curName: '',
        },
        {
          type: 'tag',
          title: '标签',
          data: this.tags.tags,
          curId: -1,
          curName: '',
        },
      ];
    },
  },
  methods: {
    ...mapMutations(['updateOptions', 'updateTags', 'updateStages']),
    showStageDialog(mode, data) {
      if (mode === 'edit') {
        this.stageForm = {
          id: data.id,
          stageName: data.name,
          stageDesc: data.desc,
          stageStatus: data.status,
        };
      } else {
        this.stageForm = {
          id: -1,
          stageName: '',
          stageDesc: '',
          stageStatus: 1,
        };
      }
      this.stageForm.mode = mode;
      this.isShowStage = true;
    },
    getOptions() {
      this.$api.$users.options((data) => {
        this.updateOptions(data);
      });
    },
    getStages() {
      this.$api.$projects.getStages(stages => this.updateStages(stages));
    },
    getTags() {
      this.$api.$events.getTags((tags) => {
        this.updateTags(tags);
      });
    },
    updateData(type) {
      switch (type) {
        case 'dep':
        case 'city':
        case 'job':
          this.getOptions(); break;
        case 'tag':
          this.getTags(); break;
        case 'stage':
          this.getStages(); break;
        default:
      }
    },
    showConfirmDialog(type, id) {
      this.$confirm('此操作将永久删除该选项, 是否继续?', '警告', {
        type: 'error',
        confirmButtonClass: 'confirm-delete',
      }).then(() => {
        this.delete(type, id);
      });
    },
    add(type, data) {
      if (!data.name) {
        this.$message.error('资料不能为空');
        return;
      }
      this.$api.$options.add(type, data, () => {
        this.showInput = '';
        this.isShowStage = false;
        this.updateData(type);
      });
    },
    update(type, id, data) {
      if (!data.name || !id) {
        this.$message.error('资料不能为空');
        return;
      }
      this.$api.$options.update(type, id, data, () => {
        this.showEdit = '';
        this.isShowStage = false;
        this.updateData(type);
      });
    },
    delete(type, id) {
      if (!id) {
        this.$message.error('id不能为空');
        return;
      }
      this.$api.$options.delete(type, id, () => this.updateData(type));
    },
    ensure() {
      this.$refs.stageForm.validate((valid) => {
        if (valid) {
          let data = {
            name: this.stageForm.stageName,
            desc: this.stageForm.stageDesc,
            status: this.stageForm.status,
          };
          let { id } = this.stageForm;
          this.stageForm.mode === 'edit' ?
            this.update('stage', id, data) : this.add('stage', data);
        } else {
          this.$message.error('资料不能为空');
        }
      });
    },
  },
  mounted() {
    this.getOptions();
    this.getStages();
    this.getTags();
  },
};
</script>

<style lang="scss" scoped>
#options__wrapper {
  @include setSize(1268px, 91.145vh);
  box-sizing: border-box;
  margin: 2.604vh auto 0 auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  & div {
    box-sizing: border-box;
  }
  & > div {
    text-align: center;
    border-right: 1px solid #ddd;
    overflow-y: auto;
    overflow-x: hidden;
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
    &:last-child {
      border: none;
    }
  }
}
.list-title {
  font-size: 16px;
  color: $black;
  margin-bottom: 2.6vh;
  padding: 10px;
  text-align: left;
}

.list-item__wrapper {
  @include setSize(100%, 6.51vh);
  padding: 10px;
  position: relative;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}

.list-item {
  @include setSize(100%, 100%);
  @include flex(space-between);
}

.list-item__left {
  color: $tips;
  max-width: 60%;
}

.list-item__right {
  font-size: 14px;
  .edit,
  .save {
    color: $default;
  }
  .delete {
    color: $danger;
  }
  .cancel {
    color: $black;
  }
}

.list-item--edit {
  @include absTL(0, 0);
  padding-right: 10px;
  background-color: #fff;
  width: 0;
  display: none;
}
.list-item__wrapper--edit {
  & > .list-item--edit {
    @include setSize(100%, 100%);
    @include flex(space-between);
    transition: width 0.3s ease-in-out;
  }
}

.list-item--add {
  @include setSize(100%, 6.51vh);
  @include flex(space-between);
  padding-right: 10px;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
}
.add-list-item {
  margin-top: 2.6vh;
}

#stage-list {
  overflow-x: hidden;
  .stage-list__wrapper {
    border: none;
  }
  .stage-list__item {
    text-align: left;
    color: $tips;
    border-bottom-color: #ddd;
    padding: 0 10px;
  }
  .label {
    color: $tips;
    font-size: 12px;
    margin-right: 5px;
  }
  .content {
    color: $black;
    font-size: 12px;
  }
  .footer {
    text-align: right;
    margin-top: 20px;
  }
  .edit {
    color: $default;
    font-size: 12px;
  }
  .delete {
    color: $danger;
    font-size: 12px;
  }
}
</style>
<style lang="scss">
#stage-list .el-collapse-item__header {
  color: $tips;
}
.stage-form {
  .el-input,
  .el-textarea {
    width: 60%;
  }
  .cancel {
    margin-right: 20px;
  }
  .ensure {
  }
  .el-form-item__error {
    left: 30%;
  }
}
</style>


