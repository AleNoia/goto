import { lazy } from 'react';

const Home = lazy(() => import('../screens/Home'));

const routes: Route[] = [
  {
    path: '*',
    component: Home
  },
  {
    path: '/',
    component: Home
  }
];

export default routes;
