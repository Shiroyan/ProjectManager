const state = {
  citys: [],
  deps: [],
  jobs: [],
};

const mutations = {
  updateOptions(state, options) {
    state.citys = options.citys;
    state.deps = options.deps;
    state.jobs = options.jobs;
  },
};

export default {
  state,
  mutations,
};
