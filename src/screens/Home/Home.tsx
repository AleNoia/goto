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
  distance: number;
}

const clientsLocations = [
  {
    id: 1,
    client: 'Client 1',
    lat: -24.956,
    lng: -53.455,
    phone: 99984771567,
    email: 'client@email.com',
    street: 'Rua de Cascavel',
    distance: 0.5
  },
  {
    id: 2,
    client: 'Client 2',
    lat: -5.0811,
    lng: -42.7743,
    phone: 99984771567,
    email: 'client@email.com',
    street: 'Rua de Teresina',
    distance: 0.5
  },

  {
    id: 3,
    client: 'Client 3',
    lat: -15.781,
    lng: -47.93,
    phone: 40028922,
    email: 'client@email.com',
    street: 'Rua de Brasília',
    distance: 0.5
  },
  {
    id: 4,
    client: 'Client 4',
    lat: -25.4284,
    lng: -49.2733,
    phone: 99984771567,
    email: 'client@email.com',
    street: 'Rua de Curitiba',
    distance: 0.5
  }
];

const Home = () => {
  // Estado para armazenar a localização atual do usuário
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Estado para armazenar a localização do cliente selecionado
  const [clientSelected, setClientSelected] = useState<{ lat: number; lng: number } | null>(null);

  // Estado do mapa
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain' | 'hybrid'>('roadmap');

  // Clientes próximos
  const [closeClients, setCloseClients] = useState<Location[]>(clientsLocations);

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
