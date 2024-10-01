import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import useRoutes from '../../routes';

const RouteProvider = () => {
  const { publicRoutes } = useRoutes();

  return (
    <Suspense>
      <Routes>
        {publicRoutes.map(({ component, path }) => {
          const Element = component;
          return <Route key={path} path={path} element={<Element />} />;
        })}
      </Routes>
    </Suspense>
  );
};

export default RouteProvider;
