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

const date = {
  getWeekStart(date) {
    let nowDate = date ? new Date(date) : new Date();
    let dayOfWeek = nowDate.getDay() || 7;
    let dayOfMon = nowDate.getDate();
    nowDate.setDate(dayOfMon - dayOfWeek + 1); // eslint-disable-line
    nowDate.setHours(0);
    nowDate.setMinutes(0);
    nowDate.setSeconds(0);
    nowDate.setMilliseconds(0);
    return nowDate;
  },
  getWeekEnd(date) {
    let nowDate = date ? new Date(date) : new Date();
    let dayOfWeek = nowDate.getDay() || 7;
    let dayOfMon = nowDate.getDate();
    nowDate.setDate(dayOfMon + (7 - dayOfWeek));
    nowDate.setHours(23);
    nowDate.setMinutes(59);
    nowDate.setSeconds(59);
    nowDate.setMilliseconds(999);
    return nowDate;
  },
  format(date, fmt) {
    let o = {
      'M+': date.getMonth() + 1, //  月份
      'd+': date.getDate(), //  日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); // eslint-disable-line
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {  // eslint-disable-line
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));  // eslint-disable-line
      }
    }
    return fmt;
  },
};


export {
  getCookie,
  isInputLegal,
  hasChinese,
  date,
};
