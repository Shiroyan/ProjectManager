import env from '@/env';

let baseUrl = ''; // eslint-disable-line

switch (env.NOW) {
  case env.WEB:
    baseUrl = ''; break;
  case env.DEV:
    baseUrl = 'http://localhost:3000'; break;
  case env.CLIENT:
    baseUrl = 'http://119.29.163.209'; break; //#gitignore
  default:
}

export default baseUrl;
