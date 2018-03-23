const state = {
  stages: [],
};

const mutations = {
  updateStages(state, data) {
    state.stages = data;
  },
};


export default {
  state,
  mutations,
};
