import { useState } from 'react';
import { Map, Filter } from '@/components';

interface Location {
  id: number;
  client: string;
  lat: number;
  lng: number;
  phone: number;
  email: string;
  street: string;
}

const Home = () => {
  // Estado para armazenar a localização atual do usuário
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Estado para armazenar a localização do cliente selecionado
  const [clientSelected, setClientSelected] = useState<{ lat: number; lng: number } | null>(null);

  // Estado do mapa
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain' | 'hybrid'>('roadmap');

  // Clientes próximos
  const [closeClients, setCloseClients] = useState<Location[]>([]);

  return (
    <div className="relative">
      <Filter
        clientsLocations={closeClients}
        setUserLocation={setUserLocation}
        userLocation={userLocation}
        setMapType={setMapType}
        mapType={mapType}
        setClientSelected={setClientSelected}
        setCloseClients={setCloseClients}
      />
      <Map
        clientsLocations={closeClients}
        setUserLocation={setUserLocation}
        userLocation={userLocation}
        mapType={mapType}
        clientSelected={clientSelected}
      />
    </div>
  );
};

export default Home;
