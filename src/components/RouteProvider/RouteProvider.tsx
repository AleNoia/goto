import { Suspense } from 'react';
import { v4 as uuid } from 'uuid';
import { Routes, Route } from 'react-router-dom';

import useRoutes from '../../routes';

const RouteProvider = () => {
  const { publicRoutes } = useRoutes();

  return (
    <Suspense>
      <Routes>
        {publicRoutes.map(({ component, path }) => {
          const Element = component;
          return <Route key={uuid()} path={path} element={<Element />} />;
        })}
      </Routes>
    </Suspense>
  );
};

export default RouteProvider;
