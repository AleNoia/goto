import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useToast } from '@/hooks/use-toast';
import getBrowsweLocation from '@/hooks/useGetBrowsweLocation';

interface MapProps {
  clientsLocations: ClientLocation[];
  setUserLocation: (newValue: Adress) => void;
  userLocation: { lat: number; lng: number } | null;
  mapType: MapType;
  clientSelected: { lat: number; lng: number } | null;
  setCloseClients: (newValue: ClientLocation[]) => void;
  setIsLoading: (value: boolean) => void;
}

const Map = ({
  clientsLocations,
  setUserLocation,
  userLocation,
  mapType,
  clientSelected,
  setCloseClients,
  setIsLoading
}: MapProps) => {
  const { toast } = useToast();

  // Referência ao elemento HTML onde o mapa será renderizado
  const mapRef = useRef<HTMLDivElement>(null);

  // Estado para armazenar a referência do marcador da localização do usuário
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);

  // Estado para armazenar a instância do mapa Google
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Obtenção da chave da API do Google Maps das variáveis de ambiente
  const { VITE_GOOGLE_API } = import.meta.env;

  // Uso do `useMemo` para criar o Loader da API do Google Maps. Isso evita recriação desnecessária
  const loader = useMemo(() => {
    return new Loader({
      apiKey: VITE_GOOGLE_API, // Chave da API do Google
      version: 'weekly', // Versão semanal da API
      libraries: ['places'] // Carrega a biblioteca de "places"
    });
  }, [VITE_GOOGLE_API]);

  // Configurações do mapa, incluindo o centro e o nível de zoom inicial
  const mapOptions = useMemo(() => {
    return {
      center: {
        lat: -15.7801, // Coordenada de latitude inicial
        lng: -47.9292 // Coordenada de longitude inicial (Brasília)
      },
      zoom: 10, // Nível de zoom inicial
      mapTypeControl: false, // Desativa os botões de alternância de tipo de mapa (satélite e mapa)
      fullscreenControl: false // Desativa os botões de tela cheia
    };
  }, []);

  // Hook `useEffect` para obter a localização do usuário quando o componente é montado
  useEffect(() => {
    getBrowsweLocation(setIsLoading, setUserLocation, setCloseClients);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hook `useEffect` para carregar o Google Maps usando o Loader
  useEffect(() => {
    loader
      .load() // Carrega a API do Google Maps
      .then((google) => {
        // Cria uma nova instância do mapa dentro do elemento `mapRef`
        const newMap = new google.maps.Map(mapRef.current!, mapOptions);
        // Armazena a instância do mapa no estado
        setMap(newMap);
      })
      .catch((e: Error) => {
        // Se houver erro ao carregar o Google Maps, define a mensagem de erro
        toast({
          title: 'Erro ao carregar o Google Maps',
          description: `${e}`
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader, mapOptions]);

  const exitStreetOverView = useCallback(() => {
    if (map) {
      // Verifica se o Street View está ativo e desativa
      const streetView = map.getStreetView();
      if (streetView && streetView.getVisible()) {
        streetView.setVisible(false); // Sai do Street View
      }
    }
  }, [map]);

  // Hook useEffect que é acionado sempre que o mapa ou a localização do usuário mudar
  useEffect(() => {
    // Se o mapa e a localização forem válidos, atualiza o mapa
    if (map && userLocation) {
      exitStreetOverView();
      // Se já existe um marcador anterior, remove-o
      if (userMarker) {
        userMarker.setMap(null); // Remove o marcador atual do usuário do mapa
      }

      // Cria um novo marcador para a localização atualizada do usuário
      const newUserMarker = new google.maps.Marker({
        position: userLocation, // Posição do usuário
        map, // Referência ao mapa
        title: 'Sua localização' // Título do marcador
      });

      // Centraliza o mapa na nova localização do usuário
      map.setCenter(userLocation);

      // Atualiza o estado com o novo marcador
      setUserMarker(newUserMarker);

      // Adiciona os marcadores para as localizações predefinidas
      clientsLocations.forEach((loc) => {
        new google.maps.Marker({
          position: loc, // Posição da localização
          map, // Referência ao mapa
          title: loc.client, // Título do marcador
          icon: {
            url: '/pin.svg', // Ícone personalizado para a localização
            scaledSize: new google.maps.Size(40, 40) // Tamanho do ícone
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, userLocation, clientsLocations]); // Este hook depende do mapa, da localização do usuário e das localizações

  // Define o tipo de mapa
  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapType);
    }
  }, [map, mapType]);

  // Define o centro do mapa de acordo com o cliente selecionado
  useEffect(() => {
    if (map) {
      map.setCenter(clientSelected || mapOptions.center);
      map.setZoom(17);
      exitStreetOverView();
    }
  }, [map, clientSelected, mapOptions.center, exitStreetOverView]);

  //Div onde o mapa será renderizado
  return <div ref={mapRef} className="w-screen h-screen overflow-hidden" />;
};

export default Map;
