const state = {
  tags: [],
};

const mutations = {
  updateTags(state, data) {
    state.tags = data;
  },
};


export default {
  state,
  mutations,
};
