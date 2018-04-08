const state = {
  citys: [],
  deps: [],
  jobs: [],
  roles: [],
};

const mutations = {
  updateOptions(state, options) {
    state.citys = options.citys;
    state.deps = options.deps;
    state.jobs = options.jobs;
    state.roles = options.roles;
  },
};

export default {
  state,
  mutations,
};
