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
    cb();
  } else {
    cb(new Error('请输入合同金额，必须为数字'));
  }
}
function valiRatio(rule, value, cb) {
  value = +value;
  if (value) {
    if (value < 0 || value > 2) {
      cb(new Error('系数范围0 ~ 2'));
    }
    cb();
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
    { min: 2, max: 12, message: '长度2 - 12个字符', trigger: 'blur' },
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
  role: [
    { type: 'number', required: true, message: '请选择角色', trigger: 'change' },
  ],
  name: [// 项目名
    { required: true, message: '请输入项目名称', trigger: 'change' },
    { min: 3, max: 25, message: '长度3 - 25个字符', trigger: 'change' },
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
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'blur' },
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'blur' },
  ],
  stageId: [
    { required: true, message: '不能为空' },
    { required: true, message: '请选择阶段' },
  ],
  planName: [
    { required: true, message: '请输入计划名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度3-20个字符', trigger: 'blur' },
  ],
  desc: [
    { required: true, message: '请输入事件内容', trigger: 'blur' },
    { max: 200, message: '不得超过200个字符', trigger: 'blur' },
  ],
  members: [
    { required: true, type: 'array', min: 1, message: '至少要有1个成员' },
  ],
  startEnd: [
    { required: true, type: 'array', min: 2, message: '请选择起止时间' },
  ],
  planTime: [
    { required: true, message: '不能为空' },
    { type: 'number', message: '进度为数字' },
  ],
  tags: [
    { required: true, type: 'array', min: 1, message: '请至少选择一个标签' },
  ],
  process: [
    { required: true, type: 'number', message: '请设置进度' },
  ],
  ratio: [
    { required: true, type: 'number', message: '请设置系数' },
  ],
  week: [
    { required: true, message: '请选择起止日期' },
  ],
  avaTime: [
    { required: true, type: 'number', message: '请设置工时' },
  ],
  stageName: [
    { required: true, type: 'string', message: '请填写阶段名' },
  ],
  stageDesc: [
    { required: true, type: 'string', message: '请填写阶段描述' },
  ],
  stageStatus: [
    { required: true, type: 'number', message: '请选择类别' },
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
  contract: rules.contract,
  startTime: rules.startTime,
  endTime: rules.endTime,
  process: rules.process,
  stageId: rules.stageId,
  planName: rules.planName,
  desc: rules.desc,
  members: rules.members,
  leaders: rules.members,
  startEnd: rules.startEnd,
  planTime: rules.planTime,
  realTime: rules.planTime,
  approval: rules.planTime,
  ratio: rules.ratio,
  tags: rules.tags,
  week: rules.week,
  avaTime: rules.avaTime,
  stageName: rules.stageName,
  stageDesc: rules.stageDesc,
  stageStatus: rules.stageStatus,
};

export default {
  state,
};
