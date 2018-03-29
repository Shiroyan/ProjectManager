<template>
  <div class="plan__wrapper">
    <div class="plan-edit__dialog">
      <el-popover ref="updatePlan" placement="bottom" width="18.301vw" v-model="isUpdatePlan">
        <el-form :model="planUpdateForm" ref="planUpdateForm" :rules="rules" label-position="left" label-width="5vw">
          <el-form-item class="form__item" prop="planName" label="计划名">
            <sb-input v-model="planUpdateForm.planName" placeholder="计划名，3-10个字符"></sb-input>
          </el-form-item>
          <el-form-item class="form__item" label="进度">
            <el-slider id="process" v-model="planUpdateForm.process" show-input :show-input-controls="false" input-size="mini"></el-slider>
          </el-form-item>
          <div style="text-align: center">
            <el-button id="edit__cancel" @click="isUpdatePlan = false" type="text">取消</el-button>
            <el-button id="edit__ensure" @click="updatePlan" type="text">确定</el-button>
          </div>
        </el-form>
      </el-popover>
    </div>
    <div class="plan__header">
      <div class="plan__name">{{plan.name}}</div>
      <el-button class="plan__del" icon="el-icon-close" type="text" v-if="profile.isPM" @click="isDelPlan = true"></el-button>
      <el-button class="plan__edit" icon="el-icon-edit" type="text" v-if="profile.isPM" v-popover:updatePlan></el-button>
      <div class="plan__progress" :style="progress"></div>
    </div>
    <div class="events__container">
      <event v-for="e in plan.events" :key="e.id" :event="e" @updateEvent="updateEvent(e)" @deleteEvent="deleteEvent(e.id)" @finishEvent="finishEvent"></event>
      <el-button id="add-event" icon="el-icon-circle-plus" type="text" v-if="profile.isPM" @click="isAddEvent = true">添加新事件</el-button>
    </div>
    <div class="del__dialog" v-show="isDelPlan">
      <div class="dialog__content">
        <h2 class="dialog__title">确认删除此计划吗？</h2>
        <p>(该计划下的所有事件均会被删除!)</p>
        <div class="dialog__footer">
          <el-button icon="el-icon-error" type="text" id="del__cancel" @click="isDelPlan = false"></el-button>
          <el-button icon="el-icon-success" type="text" id="del__ensure" @click="$emit('deletePlan', plan.id)"></el-button>
        </div>
      </div>
    </div>
    <div class="add-event__dialog" v-show="isAddEvent">
      <div class="dialog__content">
        <el-form :model="eventAddForm" ref="eventAddForm" :rules="rules" label-position="top">
          <el-form-item class="form__item" prop="desc" label="事件内容">
            <el-input type="textarea" :rows="3" placeholder="0 - 200个字符" v-model="eventAddForm.desc" resize="none"></el-input>
          </el-form-item>
          <el-form-item class="form__item" label="成员" prop="members">
            <member-icons :list="eventAddForm.members" @add="isShowUserList = true" @remove="removeMember"></member-icons>
          </el-form-item>
          <el-form-item class="form__item" label="起止时间" prop="startEnd">
            <date-time-picker id="time-range" v-model="eventAddForm.startEnd" :pickerOptions="pickerOptions"></date-time-picker>
          </el-form-item>
          <el-form-item class="form__item" label="计划时间" prop="planTime">
            <el-input-number v-model="eventAddForm.planTime" size="mini" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item class="form__item" label="标签" prop="tags">
            <tag v-model="eventAddForm.tags"></tag>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog__footer">
        <el-button type="text" id="add__cancel" @click="isAddEvent = false">取消</el-button>
        <el-button type="text" id="add__ensure" @click="ensure('eventAddForm')">创建</el-button>
      </div>
      <user-list :isVisible.sync="isShowUserList" :list="userList" v-model="eventAddForm.members" :appendToBody="false"></user-list>
    </div>
    <el-dialog :visible.sync="isUpdateEvent" center width="37vw" custom-class="edit-event__dialog" top="5vh">
      <el-form :model="eventUpdateForm" ref="eventUpdateForm" :rules="rules" label-position="left" label-width="7.321vw" :disabled="!profile.isPM">
        <el-form-item class="form__item" prop="desc" label="事件内容">
          <el-input type="textarea" :rows="3" placeholder="0 - 200个字符" v-model="eventUpdateForm.desc" resize="none"></el-input>
        </el-form-item>
        <el-form-item class="form__item" label="成员" prop="members">
          <member-icons :list="eventUpdateForm.members" @add="isShowUserList = true" @remove="removeMember2" :showAdd="profile.isPM" :showRemove="profile.isPM"></member-icons>
        </el-form-item>
        <el-form-item class="form__item" label="起止时间">
          <div id="time-range">
            <i class="el-icon-time"></i> {{eventUpdateForm.startTime}} ~ {{eventUpdateForm.endTime}}
          </div>
        </el-form-item>
        <el-form-item class="form__item form__item--inline" label="计划时间" prop="planTime">
          <el-input-number v-model="eventUpdateForm.planTime" size="mini" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item class="form__item form__item--inline" label="实际时间" prop="realTime">
          <el-input-number v-model="eventUpdateForm.realTime" size="mini" :controls="false"></el-input-number>
        </el-form-item>
        <br />
        <el-form-item class="form__item form__item--inline" label="核准时间" prop="approval">
          <el-input-number v-model="eventUpdateForm.approval" size="mini" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item class="form__item form__item--inline" label="系数(核准/实际)" prop="ratio">
          <el-input-number v-model="eventUpdateForm.ratio" size="mini" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item class="form__item" label="进度" prop="process">
          <el-slider id="process" v-model="eventUpdateForm.process" show-input :show-input-controls="false" input-size="mini"></el-slider>
        </el-form-item>
        <el-form-item class="form__item" label="是否完成">
          <el-checkbox v-model="eventUpdateForm.isFinished"></el-checkbox>
        </el-form-item>
        <el-form-item class="form__item" label="标签" prop="tags">
          <tag v-model="eventUpdateForm.tags" :showAdd="profile.isPM"></tag>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="profile.isPM">
        <div class="dialog__footer">
          <el-button type="text" id="edit__cancel" @click="isUpdateEvent = false">取消</el-button>
          <el-button type="info" id="edit__ensure" @click="ensure('eventUpdateForm')">确定</el-button>
        </div>
      </div>
      <user-list :isVisible.sync="isShowUserList" :list="userList" v-model="eventUpdateForm.members"></user-list>
    </el-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Popover } from 'element-ui';
import SBInput from '@/components/SBInput';
import MemberIcons from '@/components/MemberIcons';
import UserList from '@/components/UserList';
import DateTimePicker from '@/components/DateTimePicker';
import { date } from '@/utils';
import Vue from 'vue';
import Event from './Event';
import Tags from './Tags';
Vue.use(Popover);

export default {
  name: 'Plan',
  components: {
    event: Event,
    'sb-input': SBInput,
    'member-icons': MemberIcons,
    'user-list': UserList,
    'date-time-picker': DateTimePicker,
    tag: Tags,
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
    userList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      isUpdatePlan: false,
      isDelPlan: false,
      isAddEvent: false,
      isUpdateEvent: false,
      isShowUserList: false,
      planUpdateForm: {
        planName: this.plan.name,
        process: this.plan.process,
      },
      eventAddForm: {
        desc: '',
        startTime: '',
        endTime: '',
        members: [],
        planTime: 0,
        tags: [],
        startEnd: [],
      },
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          let cur = time.getTime();
          let monday = date.getWeekStart();
          let sunday = date.getWeekEnd();
          return cur > sunday || cur < monday;
        },
      },
      eventUpdateForm: {
        desc: '',
        startTime: '',
        endTime: '',
        members: [],
        planTime: 0,
        tags: [],
        startEnd: [],
      },
    };
  },
  computed: {
    ...mapState(['profile', 'rules', 'tags']),
    progress() {
      return {
        width: `${this.plan.process}%`,
      };
    },
  },
  methods: {
    updatePlan() {
      this.$refs.planUpdateForm.validate((valid) => {
        if (valid) {
          this.$emit('updatePlan', this.plan.id, this.planUpdateForm);
          this.isUpdatePlan = false;
        } else {
          this.$message.error({ message: '请检查格式是否正确', center: true });
          return false;
        }
        return true;
      });
    },
    removeMember(id) { // 处理事件添加框的成员变动
      this.eventAddForm.members = this.eventAddForm.members.filter(val => val.id !== id);
    },
    removeMember2(id) { // 处理事件编辑框的成员变动
      this.eventUpdateForm.members = this.eventUpdateForm.members.filter(val => val.id !== id);
    },
    ensure(formName) { // 事件创建、编辑按钮回调
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this[formName].planId = this.plan.id;
          let data = Object.assign({}, this[formName]); //  拷贝对象
          data.members = data.members.map(u => u.id).join(',');
          data.tags = data.tags.map(t => t.id).join(',');
          if (formName === 'eventAddForm') {
            data.startTime = data.startEnd[0]; //  处理请求数据
            data.endTime = data.startEnd[1];
            delete data.startEnd;
            this.$emit('createEvent', data);
            this.isAddEvent = false;
          } else {
            data.isFinished = +data.isFinished;
            delete data.startEnd;
            this.$emit('updateEvent', data, () => {
              this.isUpdateEvent = false;
            });
          }
        } else {
          this.$message.error({ message: '请检查格式', center: true });
        }
      });
    },
    updateEvent(e) {
      this.eventUpdateForm = Object.assign({}, e);
      this.isUpdateEvent = true;
    },
    deleteEvent(eventId) {
      this.$confirm('此操作将永久删除该事件, 是否继续?', '警告', {
        type: 'error',
        confirmButtonClass: 'confirm-delete',
      }).then(() => {
        this.$emit('deleteEvent', eventId, this.plan.id);
      });
    },
    finishEvent(eventId, isFinished) {
      this.$emit('finishEvent', eventId, this.plan.id, isFinished);
    },
  },
};
</script>
<style lang="scss" scoped>
.plan__wrapper {
  @include setSize(250px, 77.427vh);
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
  .dialog__content {
    display: inline-block;
  }
  .dialog__title {
    font-size: 20px;
    & + p {
      font-size: 12px;
    }
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

.add-event__dialog {
  @include absTL(40px, 2%);
  @include setSize(96%, auto);
  box-sizing: border-box;
  border-radius: 5px;
  background-color: #fff;
  padding: 11px 11px 5px 11px;
  .form__item {
    padding-bottom: 20px;
    margin-bottom: 5px;
    width: 100%;
    border-bottom: 1px solid #ddd;
  }
  .dialog__footer {
    margin-top: 10px 0 0 0;
    text-align: right;
  }
}
#add__cancel {
  margin-right: 20px;
  color: $black;
}
#add__ensure,
#add__cancel {
  font-size: 12px;
}

.edit-event__dialog {
  .form__item {
    padding-bottom: 20px;
    margin-bottom: 10px;
    width: 80%;
  }
  .form__item--inline {
    display: inline-block;
    width: auto;
    margin-right: 20px;
  }
  .el-input-number--mini {
    width: 70px;
  }
  .el-dialog--center .el-dialog__body {
    padding-bottom: 0;
  }
  #time-range {
    display: inline-block;
  }
}
#edit__ensure {
  background-color: $default !important;
  color: #fff;
  border: none;
  &:hover {
    opacity: 0.9;
  }
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

.add-event__dialog {
  .el-form-item__label {
    line-height: 20px;
    padding: 0 !important;
    margin-bottom: 5px;
  }
  .el-textarea {
    font-size: 12px;
  }
  .el-textarea__inner {
    padding-left: 12px;
    padding-right: 12px;
  }
  .el-input-number--mini {
    width: 60px;
  }
  .el-range-editor.el-input__inner {
    width: 100% !important;
  }
  .el-range-input {
    font-size: 12px;
  }
}
.edit-event__dialog {
  .el-dialog__body {
    padding-bottom: 0 !important;
  }
}
.confirm-delete {
  background-color: $danger !important;
  color: #fff !important;
  border: none !important;
}
</style>