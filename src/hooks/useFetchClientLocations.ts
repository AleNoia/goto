import calculateDistance from '@/hooks/useCalculateDistance';
import clientsLocationsMock from '@/utils/mockFetchClientsLocation';

// Função para simular fetch de localização de clientes
const fetchClientLocations = async (
  userLat: number,
  userLng: number,
  setIsLoading: (value: boolean) => void
): Promise<ClientLocation[]> => {
  return new Promise<ClientLocation[]>((resolve) => {
    setIsLoading(true); // Inicia o loading
    setTimeout(() => {
      // Filtra e organiza os clientes em ordem crescente de distância
      const filteredClients = clientsLocationsMock
        .map((client) => {
          const distance = calculateDistance(userLat, userLng, client.lat, client.lng);
          return { ...client, distance: Number(distance) }; // Adiciona a distância ao objeto do cliente
        })
        .filter((client) => client.distance <= 200) // Filtra clientes a 200 km ou menos
        .sort((a, b) => a.distance - b.distance); // Organiza por distância (mais próximos primeiro)

      resolve(filteredClients); // Retorna os clientes filtrados e organizados
      setIsLoading(false); // Finaliza o loading
    }, 2000); // 2 segundos de espera
  });
};

export default fetchClientLocations;
