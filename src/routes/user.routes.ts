import { lazy } from 'react';

const Home = lazy(() => import('../screens/Home'));
const Login = lazy(() => import('../screens/Login'));

const routes: Route[] = [
  {
    path: '*',
    component: Home
  },
  {
    path: '/',
    component: Home
  },
  {
    path: '/entrar',
    component: Login
  }
];

export default routes;
