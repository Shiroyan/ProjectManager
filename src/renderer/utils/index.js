import Vue from 'vue';
import env from '@/env';

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
 * 获取cookie
 * @param {string} key cookie的key
 */
function getCookie(key) {
/*   if (env.NOW === env.WEB) {
  }
  let cookies = Vue.prototype.$electron.remote.session.defaultSession.cookies;
  return (new Promise((resolve, reject) => {
    let cookie;
    cookies && cookies.get({ name: key }, (error, cookies) => {
      console.log(cookies);
      cookie = cookies[0];
      cookie && cookie.value ?
        resolve(cookie.value) : reject('token not found');
    });
  }));
*/
  let cookies = document.cookie.replace(/\s*/g, '').split(';');
  let o = {};
  cookies.length !== 0 && cookies.forEach((cookie) => {
    let temp = cookie.split('=');
    let key = temp[0];
    let val = temp[1];
    o[key] = val;
  });
  return o[key];
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
  /**
   * 获取当月最后一天
   */
  getLastDateOfMonth() {
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  },
  /**
   * 计算当月第一天在日历中的位置, 不传参数即为当月
   * @param {number} year 年份
   * @param {number} month 从1开始， 1~12
   */
  getFirstDayPosOfMonth(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
    return new Date(year, month - 1, 1).getDay();
  },
  /**
   * 计算一个月中有多少天， 不传参数即为当月
   * @param {number} year 年份
   * @param {number} month, 从0开始， 1 ~ 12
   */
  getDateNumOfMonth(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
    return new Date(year, month, 0).getDate();
  },
  /**
   * 生成日历数组空白为undefined, 不传参数即为当月
   * @param {number} monthStart 第一天在日历中的第几天
   * @param {number} monthEnd 当月有几天
   */
  genCalendar(monthStart = date.getFirstDayPosOfMonth(), monthEnd = date.getDateNumOfMonth()) {
    let dates = [];
    dates.length = 42; // 6 X 7 日历
    for (let index = monthStart, dateNum = 1; dateNum <= monthEnd; ++index, ++dateNum) {
      dates[index] = `${dateNum}`;
    }
    return dates;
  },
};


export {
  getCookie,
  isInputLegal,
  hasChinese,
  date,
};
