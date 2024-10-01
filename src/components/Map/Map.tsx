import { useEffect, useRef, useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useToast } from '@/hooks/use-toast';

// Array de localizações predefinidas com latitudes, longitudes e títulos para os marcadores

interface Location {
  id: number;
  lat: number;
  lng: number;
  street: string;
  client: string;
  phone: number;
  email: string;
}

interface MapProps {
  clientsLocations: Location[];
  setUserLocation: (newValue: { lat: number; lng: number; formatted_address?: string }) => void;
  userLocation: { lat: number; lng: number } | null;
  mapType: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
  clientSelected: { lat: number; lng: number } | null;
}

const Map = ({
  clientsLocations,
  setUserLocation,
  userLocation,
  mapType,
  clientSelected
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
      mapTypeControl: false // Desativa os botões de alternância de tipo de mapa (satélite e mapa)
    };
  }, []);

  // Hook `useEffect` para obter a localização do usuário quando o componente é montado
  useEffect(() => {
    const getCurrentLocation = () => {
      // Verifica se o navegador suporta geolocalização
      if (navigator.geolocation) {
        // Obtém a posição atual do usuário
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Atualiza o estado com a localização do usuário
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (err) => {
            // Em caso de erro, armazena a mensagem de erro no estado
            if (err.message === 'User denied geolocation prompt') {
              return toast({
                title: 'Acesso de geolocalização negado',
                description: 'Conceda acesso para identificarmos a geolocalização'
              });
            }
            toast({
              title: 'Ocorreu algum erro',
              description: 'Entre me contato com o suporte'
            });

            console.error(err.message);
          }
        );
      } else {
        // Se o navegador não suporta geolocalização, define um erro
        toast({
          title: 'Ocorreu algum erro',
          description: 'Este navegador não suporta geolocalização'
        });
      }
    };

    getCurrentLocation();
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

  // Hook useEffect que é acionado sempre que o mapa ou a localização do usuário mudar
  useEffect(() => {
    // Se o mapa e a localização forem válidos, atualiza o mapa
    if (map && userLocation) {
      // Se já existe um marcador anterior, remove-o
      if (userMarker) {
        userMarker.setMap(null); // Remove o marcador atual do mapa
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

  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapType); // Define o tipo de mapa
    }
  }, [map, mapType]);

  useEffect(() => {
    if (map) {
      map.setCenter(clientSelected || mapOptions.center); // Define o centro do mapa de acordo com o cliente selecionado
    }
  }, [map, clientSelected, mapOptions.center]);

  //Div onde o mapa será renderizado
  return <div ref={mapRef} className="w-screen h-screen" />;
};

export default Map;
