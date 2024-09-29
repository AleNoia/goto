import publicRoutes from './public.routes';
import adminRoutes from './admin.routes';
import userRoutes from './user.routes';

const useRoutes = () => {
  return {
    publicRoutes,
    adminRoutes,
    userRoutes
  };
};

export default useRoutes;
