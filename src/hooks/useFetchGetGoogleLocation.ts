import fetchClientLocations from '@/hooks/useFetchClientLocations';
import { toast } from './use-toast';

async function getGoogleLocation(
  setIsLoading: (value: boolean) => void,
  setUserLocation: (value: Adress) => void,
  setCloseClients: (newValue: ClientLocation[]) => void
) {
  const { VITE_GOOGLE_API } = import.meta.env; // A chave da API do Google

  try {
    setIsLoading(true);
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
      setIsLoading(false);
      throw new Error('Falha ao obter a localização');
    }

    // Converte a resposta em JSON
    const data = await response.json();

    // Extrai a localização (latitude e longitude)
    const { lat, lng } = data.location;

    // Retorna a localização
    setUserLocation({ lat, lng });

    // Simula o fetch de clientes com as coordenadas obtidas
    const result = await fetchClientLocations(lat, lng, setIsLoading);
    setCloseClients(result);
    setIsLoading(false);
  } catch (error) {
    toast({
      title: 'Erro ao obter localização',
      description: 'Tente novamente ou entre me contato com o suporte'
    });
    console.error('Erro ao obter localização via Google Maps Geolocation API:', error);
    setIsLoading(false);
  }
}

export default getGoogleLocation;
