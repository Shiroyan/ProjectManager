import Vue from 'vue';

function isInputLegal(text) {
  let t = text.trim();
  let flag = (t == 'undefined') || (t == 'null') || (t == '') || (t == 'false') || (t == '0') || (t == '-0') || (t == 'NaN'); // eslint-disable-line
  flag = flag || t.includes(' ');
  return !flag;
}

function hasChinese(str) {
  let reg = /[\u4e00-\u9fa5]/;
  return reg.test(str);
}

/**
 * 获取cookie的方法为异步方法，故返回Promise以进行进一步操作
 * @param {string} key cookie的key
 */
function getCookie(key) {
  let cookies = Vue.prototype.$electron.remote.session.defaultSession.cookies;
  return (new Promise((resolve, reject) => {
    let cookie;
    cookies && cookies.get({ domain: 'localhost', name: key }, (error, cookies) => {
      cookie = cookies[0];
      cookie && cookie.value ?
        resolve(cookie.value) : reject('token not found');
    });
  }));
}

export {
  getCookie,
  isInputLegal,
  hasChinese,
};
