<template>
  <div class="plan__wrapper">
    <div class="edit__dialog">
      <el-popover ref="editPlan" placement="bottom" width="18.301vw" v-model="isEditVisible">
        <el-form :model="planForm" ref="planForm" :rules="rules" label-position="left" label-width="5vw">
          <el-form-item class="form__item" prop="planName" label="计划名">
            <sb-input v-model="planForm.planName" placeholder="计划名，3-10个字符"></sb-input>
          </el-form-item>
          <el-form-item class="form__item" label="进度">
            <el-slider id="process" v-model="planForm.process" show-input :show-input-controls="false" input-size="mini"></el-slider>
          </el-form-item>
          <div style="text-align: center">
            <el-button id="edit__cancel" @click="isEditVisible = false" type="text">取消</el-button>
            <el-button id="edit__ensure" @click="edit" type="text">确定</el-button>
          </div>
        </el-form>
      </el-popover>
    </div>
    <div class="plan__header">
      <div class="plan__name">{{plan.name}}</div>
      <el-button class="plan__del" icon="el-icon-close" type="text" v-if="profile.isPM" @click="isDelVisible = true"></el-button>
      <el-button class="plan__edit" icon="el-icon-edit" type="text" v-if="profile.isPM" v-popover:editPlan></el-button>
      <div class="plan__progress" :style="progress"></div>
    </div>
    <div class="events__container">
      <event v-for="e in plan.events" :key="e.id" :event="e"></event>
      <el-button id="add-event" icon="el-icon-circle-plus" type="text">添加新事件</el-button>
    </div>
    <div class="del__dialog" v-show="isDelVisible">
      <div class="dialog__content">
        <h2 class="dialog__title">确认删除此计划吗？</h2>
        <p>(该计划下的所有事件均会被删除!)</p>
        <div class="dialog__footer">
          <el-button icon="el-icon-error" type="text" id="del__cancel" @click="isDelVisible = false"></el-button>
          <el-button icon="el-icon-success" type="text" id="del__ensure" @click="$emit('deletePlan', plan.id)"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Popover } from 'element-ui';
import SBInput from '@/components/SBInput';
import Vue from 'vue';
import Event from './Event';
Vue.use(Popover);

export default {
  name: 'Plan',
  components: {
    event: Event,
    'sb-input': SBInput,
  },
  props: {
    plan: {
      type: Object,
      default() {
        return {
          id: 0,
          name: '',
          process: 0,
          events: [],
        };
      },
    },
  },
  data() {
    return {
      isEditVisible: false,
      isDelVisible: false,
      planForm: {
        planName: this.plan.name,
        process: this.plan.process,
      },
    };
  },
  computed: {
    ...mapState(['profile', 'rules']),
    progress() {
      return {
        width: `${this.plan.process}%`,
      };
    },
  },
  methods: {
    edit() {
      this.$refs.planForm.validate((valid) => {
        if (valid) {
          this.$emit('editPlan', this.plan.id, this.planForm);
          this.isEditVisible = false;
        } else {
          this.$message.error({ message: '请检查格式是否正确', center: true });
          return false;
        }
        return true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.plan__wrapper {
  @include setSize(250px, 79.427vh);
  position: relative;
  background-color: #eee;
  border-radius: 5px;
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
}
.plan__header {
  @include setSize(100%, 5.141vh);
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #ddd;
}
.plan__name {
  float: left;
  margin-left: 15px;
  color: $black;
  line-height: 40px;
  font-size: 14px;
}
.plan__del,
.plan__edit {
  float: right;
  margin-right: 8px;
  font-size: 18px;
  color: $black;
  &:hover {
    color: $default;
  }
}

.plan__progress {
  @include absBL(-2px, 0);
  width: 0;
  height: 4px;
  background-color: $success;
}

.events__container {
  height: 74vh;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #9e9e9e;
  }
}
#add-event {
  margin: 34px auto;
  color: $black;
  display: block;
  font-size: 12px;
}

#edit__cancel,
#edit__ensure {
  @include setSize(84px, 24px);
  padding: 0;
  font-size: 12px;
}

#edit__cancel {
  color: $black;
}

.del__dialog {
  @include absTL(0, 0);
  @include setSize(100%, 100%);
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;  
  z-index: 1000;
  text-align: center;  
  &:before {
    content: "";
    display: inline-block;
    @include setSize(0, 100%);
    vertical-align: middle;
  }
}
.dialog__content {
  display: inline-block;
}
.dialog__title {
  font-size: 20px;
  &+p {
    font-size: 12px;
  }
}
#del__cancel,
#del__ensure {
  font-size: 20px;
  color: #fff;
}
#del__cancel {
  margin-right: 50px;
}

</style>
<style lang="scss">
#process {
  .el-slider__input {
    width: 50px;
  }
  .el-slider__runway.show-input {
    margin-right: 60px;
  }
  .el-input__inner {
    border: none;
    outline: none;
  }
}

.form__item {
  & > label {
    font-size: 12px;
  }
}
</style>