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
  isPM: false,
  isAdmin: false,
};

const mutations = {
  updateProfile(state, data) {
    let { userId, username, cityId, cityName, depId, depName, jobId, jobName, role,
      isAdmin, isPM } = data;
    state.userId = userId;
    state.username = username;
    state.cityId = cityId;
    state.cityName = cityName;
    state.depId = depId;
    state.depName = depName;
    state.jobId = jobId;
    state.jobName = jobName;
    state.role = role;
    state.isPM = isPM;
    state.isAdmin = isAdmin;
  },
};


export default {
  state,
  mutations,
};
