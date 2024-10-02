/* eslint-disable @typescript-eslint/no-explicit-any */
import calculateDistance from '@/hooks/useCalculateDistance';
import clientsLocationsMock from '@/utils/mockFetchClientsLocation';

// Função para simular fetch de localização de clientes
const fetchClientLocations = async (
  userLat: number,
  userLng: number,
  localDispatch: (action: any) => void
): Promise<ClientLocation[]> => {
  return new Promise<ClientLocation[]>((resolve) => {
    localDispatch({ isLoading: true }); // Inicia o loading
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
      localDispatch({ isLoading: false }); // Finaliza o loading
    }, 2000); // 2 segundos de espera
  });
};

export default fetchClientLocations;
