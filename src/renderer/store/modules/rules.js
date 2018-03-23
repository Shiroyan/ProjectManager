import { isInputLegal, hasChinese } from '@/utils';

function valiAccount(rule, value, cb) {
  if (!isInputLegal(value)) {
    cb(new Error('包含非法字符'));
  } else if (hasChinese(value)) {
    cb(new Error('不能包含中文'));
  } else {
    cb();
  }
}

function valiContractVal(rule, value, cb) {
  value = +value;
  if (value) {
    if (value < 0 || value > 1000000) {
      cb(new Error('金额范围0 ~ 1000000'));
    }
  } else {
    cb('请输入合同金额，必须为数字');
  }
}

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
  name: [// 项目名
    { required: true, message: '请输入项目名称', trigger: 'change' },
    { min: 3, max: 12, message: '长度3 - 12个字符', trigger: 'change' },
  ],
  firstParty: [// 甲方
    { required: true, message: '请输入甲方名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度2 - 20个字符', trigger: 'blur' },
  ],
  contractVal: [
    { required: true, message: '请输入合同金额', trigger: 'blur' },
    { validator: valiContractVal },
  ],
  contract: [
    { required: true, message: '请上传文件', trigger: 'blur' },
    { type: 'object', message: '请上传文件', trigger: 'blur' },
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
  name: rules.name,
  firstParty: rules.firstParty,
  contractVal: rules.contractVal,
};

export default {
  state,
};
