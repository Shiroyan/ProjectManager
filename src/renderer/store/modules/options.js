import profile from './profile';

const state = {
  citys: [],
  deps: [],
  jobs: [],
  roles: [],
};

const mutations = {
  updateOptions(state, options) {
    if (profile.state.isAdmin) {
      state.deps = options.deps;
      state.jobs = options.jobs;
      state.roles = options.roles;
    } else {
      state.deps = options.deps.filter(temp => temp.id !== 0);
      state.jobs = options.jobs.filter(temp => temp.id !== 0);
      state.roles = options.roles.filter(temp => temp.id !== 0);
    }
    state.citys = options.citys;
  },
};

export default {
  state,
  mutations,
};
