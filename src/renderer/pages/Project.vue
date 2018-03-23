<template>
  <div>
    <h1>ProjectId: {{projectId}}</h1>
    <el-button @click="$router.go(-1)"></el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectId: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.projectId = to.params.projectId;
    });
  },
};
</script>