import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages/Index';
import Projects from '@/pages/Projects';
import Schedule from '@/pages/Schedule';
import Users from '@/pages/Users';
import Statistics from '@/pages/Statistics';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import ForgetPwd from '@/pages/ForgetPwd';
import Project from '@/pages/Project';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/',
          component: Projects,
        },
        {
          path: 'schedule',
          component: Schedule,
        },
        {
          path: 'users',
          component: Users,
        },
        {
          path: 'statistics',
          component: Statistics,
        },
      ],
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/forgetPwd',
      name: 'ForgetPwd',
      component: ForgetPwd,
    },
    {
      path: '/project/:projectId',
      name: 'Project',
      component: Project,
    },
    {
      path: '/project',
      redirect: '/index',
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
