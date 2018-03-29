<template>
  <div class="member-icons__wrapper">
    <transition-group mode="out-in" name="el-fade-in" :duration="250">
      <user-avatar class="member-icon" v-for="m in list" :key="m.id" :username="m.username" :job="m.jobId">
        <div slot="mask" class="op__remove" @click="$emit('remove', m.id)" v-if="showRemove">
          <i class="el-icon-minus"></i>
        </div>
      </user-avatar>
    </transition-group>
    <div class="op__add" @click="$emit('add')" v-if="showAdd">
      <i class="el-icon-plus"></i>
    </div>
  </div>
</template>

<script>
import UserAvatar from './UserAvatar';

export default {
  name: 'member-icons',
  components: {
    'user-avatar': UserAvatar,
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
    showAdd: {
      type: Boolean,
      default: true,
    },
    showRemove: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.member-icons__wrapper {
  text-align: left;
  display: inline-block;
  vertical-align: middle;
}

.member-icon,
.op__remove,
.op__add {
  @include setSize(36px, 36px);
  box-sizing: border-box;
  border-radius: 18px;
  color: #fff;
  display: inline-block;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
  vertical-align: middle;
}

.member-icon {
  margin-right: 8px;
  overflow: hidden;
}

.member-icon,
.op__add {
  background-color: $default;
  position: relative;
  &:hover {
    .op__remove {
      display: block;
      transition: all 0.3s ease-in-out;
    }
  }
}

.op__add {
  font-size: 18px;
  font-weight: bolder;
  padding-top: 1px;
  &:hover {
    opacity: 0.9;
  }
}

.op__remove {
  @include absTL(0, 0);
  background-color: rgba(0, 0, 0, 0.7);
  display: none;
  font-size: 24px;
  font-weight: bolder;
}
</style>

