import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages/Index';
import Projects from '@/pages/Index/Projects';
import Schedule from '@/pages/Index/Schedule';
import Users from '@/pages/Index/Users';
import Statistics from '@/pages/Index/Statistics';
import Options from '@/pages/Index/Options';
import Daily from '@/pages/Index/Daily';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import ForgetPwd from '@/pages/ForgetPwd';
import Project from '@/pages/Project';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      components: { alive: Index },
      children: [
        {
          path: '',
          name: 'Projects',
          component: Projects,
        },
        {
          path: 'project/',
          redirect: '',
        },
        {
          path: 'project/:projectId',
          name: 'Project',
          component: Project,
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
        {
          path: 'options',
          component: Options,
        },
        {
          path: 'daily',
          component: Daily,
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
      path: '/projects',
      redirect: '/',
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
