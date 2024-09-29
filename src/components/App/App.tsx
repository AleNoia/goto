import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import RouteProvider from '../RouteProvider';
import './input.css';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouteProvider />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
