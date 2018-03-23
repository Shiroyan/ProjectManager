import axios from 'axios';
import { Loading, Notification } from 'element-ui';
import router from '../router';

const loading = Loading.service;
const notify = Notification;

const baseURL = 'http://localhost:3000';
axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const get = (url, successCb) => {
  axios({
    method: 'GET',
    url,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    withCredentials: true,
    crossDomain: true,
  }).then(successCb).catch();
};
const post = (url, successCb, data = {}) => {
  let params = new URLSearchParams();
  for (let key in data) { // eslint-disable-line
    params.append(key, data[key]);
  }
  axios({
    method: 'POST',
    url,
    data: params,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    withCredentials: true,
    crossDomain: true,
  }).then(successCb).catch();
};
const put = (url, successCb, data = {}) => {
  axios({
    method: 'PUT',
    url,
    data,
    headers: {
      'Content-type': 'application/json',
    },
    withCredentials: true,
    crossDomain: true,
  }).then(successCb).catch();
};
const $delete = axios.delete;

let loadingInstance;

//#region  请求拦截器，打开loading动画
axios.interceptors.request.use((config) => {
  let text = config.url.indexOf('login') !== -1 ? '登录中 . . .' : '加载中 . . .';
  let loadingConfig = {
    lock: true,
    text,
    spinner: 'coffee-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'coffee-loading__wrapper',
  };
  loadingInstance = loading(loadingConfig);
  return config;
}, error => Promise.reject(error));
//#endregion

//#region  响应拦截器，统一处理错误返回，关闭loading动画
axios.interceptors.response.use((res) => {
  loadingInstance.close();
  res.data.msg && notify({
    title: res.data.msg,
    type: 'success',
  });
  return res.data;
}, (error) => {
  let response = error ? error.response : { data: { error: '网络错误' }, status: 0 };
  loadingInstance.close();
  let { data, status } = response;
  notify.error({
    title: data.error || '未知错误',
  });
  switch (status) {
    case 401:
      router.push('/login');
      break;
    default:
  }
  return Promise.reject(`${status}-${data.error}`);
});
//#endregion

//#region 用户接口
const usersApi = {
  options(successCb) {
    get('/users/options', successCb);
  },
  register(data, successCb) {
    post('users/register', successCb, data);
  },
  login(data, successCb) {
    post('users/login', successCb, data);
  },
  autoLogin(successCb) {
    post('users/autologin', successCb);
  },
  logout() {
    post('users/logout', () => {
      router.push('/login');
    });
  },
  updateProfile(data, successCb) {
    put('/users/profile', successCb, data);
  },
  updateProfileByAdmin(uid, data, successCb) {
    put(`/users/profile/${uid}`, successCb, data);
  },
  getProfile(successCb) {
    get('/users/profile', successCb);
  },
  modifyPwd(data, successCb) {
    put('/users/password', successCb, data);
  },
};
//#endregion

//#region 项目接口
const projectsApi = {
  getAllProjects(type, successCb) {
    get(`/projects?type=${type}`, successCb);
  },
};
//#endregion

export default {
  $users: usersApi,
  $projects: projectsApi,
};
