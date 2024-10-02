/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from './use-toast';
import fetchClientLocations from './useFetchClientLocations';
import getGoogleLocation from './useFetchGetGoogleLocation';

async function getCurrentLocation(localDispatch: (action: any) => void) {
  // Verifica se o navegador suporta geolocalização
  if (navigator.geolocation) {
    // Inicia o loading
    localDispatch({ isLoading: true });

    // Obtém a posição atual do usuário
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Atualiza o estado com a localização do usuário
        localDispatch({ userLocation: { lat: latitude, lng: longitude } });

        // Simula o fetch de clientes com as coordenadas obtidas
        try {
          const result = await fetchClientLocations(latitude, longitude, localDispatch);
          localDispatch({ clientsLocations: result });
        } catch (error) {
          toast({
            title: 'Erro ao obter clientes',
            description: 'Não foi possível obter a lista de clientes.'
          });
          console.error(error);
        } finally {
          localDispatch({ isLoading: false });
        }
      },
      (err) => {
        // Em caso de erro, armazena a mensagem de erro no estado
        if (err.message === 'User denied geolocation prompt') {
          toast({
            title: 'Acesso de geolocalização negado',
            description: 'Conceda acesso para identificarmos a sua geolocalização'
          });
        } else {
          // Caso de erro, tentaremos utilizar a geolocalização da API do Google
          getGoogleLocation(localDispatch).catch(() => {
            toast({
              title: 'Erro na geolocalização',
              description: 'Não foi possível obter a localização usando a API do Google.'
            });
          });
        }
        console.error(err.message);
        localDispatch({ isLoading: false }); // Certifique-se de parar o loading mesmo em caso de erro
      }
    );
  } else {
    // Se o navegador não suporta geolocalização, define um erro
    toast({
      title: 'Ocorreu algum erro',
      description: 'Este navegador não suporta geolocalização'
    });
    localDispatch({ isLoading: false }); // Certifique-se de parar o loading
  }
}

export default getCurrentLocation;
