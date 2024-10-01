import { BrowserRouter } from 'react-router-dom';
import RouteProvider from '../RouteProvider';
import { Toaster } from '@/components/ui/toaster';
import './input.css';

const App = () => {
  return (
    <BrowserRouter>
      <RouteProvider />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
