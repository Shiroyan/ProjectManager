import env from '@/env';

let baseUrl = ''; // eslint-disable-line

//http://119.29.163.209

switch (env.NOW) {
  case env.WEB:
    baseUrl = ''; break;
  case env.DEV:
    baseUrl = 'http://localhost:3000'; break;
  case env.CLIENT:
    baseUrl = 'http://dltech.f3322.net:8888'; break; //#gitignore
  default:
}

export default baseUrl;
