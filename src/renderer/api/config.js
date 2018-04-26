import env from '@/env';

let baseUrl = ''; // eslint-disable-line
const backupUrl = 'http://172.16.11.200:3000';

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

export {
  backupUrl,
};
