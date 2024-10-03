import { Map, Filter } from '@/components';
import { LocalStateProvider } from '@/hooks/Context';

const Home: React.FC = () => {
  return (
    <LocalStateProvider
      initialValues={{
        userLocation: null, // Estado para armazenar a localização atual do usuário
        clientSelected: null, // Estado para armazenar a localização do cliente selecionado
        mapType: 'roadmap', // Estado do mapa
        clientsLocations: [], // Clientes próximos
        isLoading: false, // Estado para verificar se está tendo loading nas requisições
        showClients: true // Verifica se os clientes devem ser listados ou não
      }}
    >
      <div className="relative">
        <Filter />
        <Map />
      </div>
    </LocalStateProvider>
  );
};

export default Home;
