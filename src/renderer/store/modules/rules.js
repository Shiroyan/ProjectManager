import { isInputLegal, hasChinese } from '@/utils';

const valiAccount = (rule, value, cb) => {
  if (!isInputLegal(value)) {
    cb(new Error('包含非法字符'));
  } else if (hasChinese(value)) {
    cb(new Error('不能包含中文'));
  } else {
    cb();
  }
};

const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 6, max: 12, message: '长度6 - 12个字符', trigger: 'blur' },
    { validator: valiAccount, trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度6 - 12个字符', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 12, message: '长度3 - 12个字符', trigger: 'blur' },
  ],
  city: [
    { type: 'number', required: true, message: '请选择城市', trigger: 'change' },
  ],
  dep: [
    { type: 'number', required: true, message: '请选择部门', trigger: 'change' },
  ],
  job: [
    { type: 'number', required: true, message: '请选择岗位', trigger: 'change' },
  ],
};

const state = {
  account: rules.account,
  password: rules.password,
  newPwd: rules.password,
  oldPwd: rules.password,
  username: rules.username,
  city: rules.city,
  dep: rules.dep,
  job: rules.job,
};

export default {
  state,
};
