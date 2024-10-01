import { useState } from 'react';
import { Map, Filter } from '@/components';

const Home = () => {
  // Estado para armazenar a localização atual do usuário
  const [userLocation, setUserLocation] = useState<Adress | null>(null);

  // Estado para armazenar a localização do cliente selecionado
  const [clientSelected, setClientSelected] = useState<ClientLocation | null>(null);

  // Estado do mapa
  const [mapType, setMapType] = useState<MapType>('roadmap');

  // Clientes próximos
  const [closeClients, setCloseClients] = useState<ClientLocation[]>([]);

  // Estado para verificar se está tendo loading nas requisições
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative">
      <Filter
        clientsLocations={closeClients}
        setUserLocation={setUserLocation}
        userLocation={userLocation}
        setMapType={setMapType}
        mapType={mapType}
        clientSelected={clientSelected}
        setClientSelected={setClientSelected}
        setCloseClients={setCloseClients}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
      <Map
        clientsLocations={closeClients}
        setUserLocation={setUserLocation}
        userLocation={userLocation}
        mapType={mapType}
        clientSelected={clientSelected}
        setCloseClients={setCloseClients}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default Home;
