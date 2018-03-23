const state = {
  users: [],
};

const mutations = {
  updateUsers(state, users) {
    state.users = users;
  },
};

export default {
  state,
  mutations,
};
