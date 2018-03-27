<template>
  <div id="tag-list__wrapper">
    <el-tag class="tag" :key="tag.id" v-for="tag in _tags" closable size="mini" :color="colors[tag.id]" :disable-transitions="false" @close="remove(tag.id)">
      {{tag.name}}
    </el-tag>
    <el-popover ref="tagList" placement="right">
      <div class="tag-list">
        <div v-for="t in tags.tags" :key="t.id" class="tag-list__tag" @click="add(t)" :style="{ backgroundColor: colors[t.id]}">{{t.name}}</div>
      </div>
    </el-popover>
    <el-button class="add-btn" type="text" icon="el-icon-circle-plus" size="small" v-popover:tagList></el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    value: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      /**
       **  根据传入的tagId 进行相应的着色
       */
      colors: [
        '#212121', //..管理员
        '#673ab7', //..Web
        '#f44336', //..JAVA
        '#1b5e20', //..Test
        '#e91e63', //..PM
        '#009688', //..Android
        '#2196f3', //..IOS
        '#f50057', //..UX
        '#f50057', //..UI
        '#ff9800', //..MKT
        '#1a237e', //..OPR
      ],
    };
  },
  computed: {
    ...mapState(['tags']),
    _tags: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      },
    },
  },
  methods: {
    remove(tagId) {
      this._tags = this._tags.filter(t => t.id !== tagId);
    },
    add(tag) {
      this._tags.indexOf(tag) === -1 && this._tags.push(tag);
    },
  },
};
</script>
<style lang="scss" scoped>
.tag-list {
  width: 230px;
}

.tag-list__tag {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  border: 1px solid rgba(64, 158, 255, 0.2);
  border-radius: 4px;
  padding: 0 5px;
  height: 18px;
  line-height: 18px;
}

.tag-list__tag,
.tag {
  cursor: pointer;
  color: #fff;
  margin: 5px 5px 0 0;
}

.add-btn {
  vertical-align: middle;
  font-size: 18px;
  color: $default;
}
</style>

<style lang="scss">
#tag-list__wrapper {
  .el-tag .el-icon-close {
    color: #fff !important;
    font-weight: bold !important;
  }
  .el-icon-close:hover {
    color: $black !important;
    background-color: #fff !important;
  }
}
</style>

