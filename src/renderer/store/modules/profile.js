const state = {
  userId: '',
  username: '',
  cityId: '',
  cityName: '',
  depId: '',
  depName: '',
  jobId: '',
  jobName: '',
  role: -1,
};

const mutations = {
  updateProfile(state, data) {
    let { userId, username, cityId, cityName, depId, depName, jobId, jobName, role } = data;
    state.userId = userId;
    state.username = username;
    state.cityId = cityId;
    state.cityName = cityName;
    state.depId = depId;
    state.depName = depName;
    state.jobId = jobId;
    state.jobName = jobName;
    state.role = role;
    state.isPM = jobId === 5 || role === 0;
    state.isAdmin = role === 0;
  },
};


export default {
  state,
  mutations,
};
