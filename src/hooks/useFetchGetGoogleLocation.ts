/* eslint-disable @typescript-eslint/no-explicit-any */
import fetchClientLocations from '@/hooks/useFetchClientLocations';
import { toast } from './use-toast';

async function getGoogleLocation(localDispatch: (action: any) => void) {
  const { VITE_GOOGLE_API } = import.meta.env; // A chave da API do Google

  try {
    localDispatch({ isLoading: true });
    const response = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${VITE_GOOGLE_API}`,
      {
        method: 'POST'
      }
    );

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      toast({
        title: 'Erro ao obter localização',
        description: 'Tente novamente ou entre me contato com o suporte'
      });
      localDispatch({ isLoading: false });
      throw new Error('Falha ao obter a localização');
    }

    // Converte a resposta em JSON
    const data = await response.json();

    // Extrai a localização (latitude e longitude)
    const { lat, lng } = data.location;

    // Retorna a localização
    localDispatch({ userLocation: { lat, lng } });

    // Simula o fetch de clientes com as coordenadas obtidas
    const result = await fetchClientLocations(lat, lng, localDispatch);
    localDispatch({ clientsLocations: result });
    localDispatch({ isLoading: false });
  } catch (error) {
    toast({
      title: 'Erro ao obter localização',
      description: 'Tente novamente ou entre me contato com o suporte'
    });
    console.error('Erro ao obter localização via Google Maps Geolocation API:', error);
    localDispatch({ isLoading: false });
  }
}

export default getGoogleLocation;
