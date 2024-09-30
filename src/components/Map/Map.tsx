import { useEffect, useRef, useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Array de localizações predefinidas com latitudes, longitudes e títulos para os marcadores
const locations = [
  { id: 1, lat: -24.956, lng: -53.455, city: 'Cascavel', street: '123 Main St', distance: 0.5 },
  { id: 2, lat: -5.0811, lng: -42.7743, city: 'Teresina', street: '123 Main St', distance: 0.5 },
  { id: 3, lat: -15.781, lng: -47.93, city: 'Brasília', street: '123 Main St', distance: 0.5 }
];

const Map = () => {
  // Referência ao elemento HTML onde o mapa será renderizado
  const mapRef = useRef<HTMLDivElement>(null);

  // Estado para armazenar a localização atual do usuário
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Estado para armazenar qualquer mensagem de erro (ex: se a geolocalização falhar)
  const [error, setError] = useState<string | null>(null);

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
      zoom: 10 // Nível de zoom inicial
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
            setLocation({ lat: latitude, lng: longitude });
          },
          (err) => {
            // Em caso de erro, armazena a mensagem de erro no estado
            setError(err.message);
          }
        );
      } else {
        // Se o navegador não suporta geolocalização, define um erro
        setError('Geolocation não é suportado neste browser');
      }
    };

    getCurrentLocation();
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
        setError(`Erro ao carregar o Google Maps: ${e}`);
      });
  }, [loader, mapOptions]);

  // Hook `useEffect` que é acionado sempre que o mapa ou a localização do usuário muda
  useEffect(() => {
    // Se o mapa e a localização forem válidos, atualiza o mapa
    if (map && location) {
      // Centraliza o mapa na localização do usuário
      map.setCenter(location);
      // Adiciona um marcador na localização do usuário
      new google.maps.Marker({
        position: location,
        map
      });

      // Adiciona marcadores para as localizações predefinidas
      locations.forEach((loc) => {
        new google.maps.Marker({
          position: loc, // Posição da localização
          map: map, // Referência ao mapa
          title: loc.city, // Título do marcador (exibido quando o usuário passa o mouse)
          icon: {
            url: '/pin.svg', // Ícone personalizado para o marcador
            scaledSize: new google.maps.Size(30, 30) // Tamanho do ícone
          }
        });
      });
    }
  }, [map, location]); // Este hook depende do mapa e da localização

  return (
    <div>
      {/* Exibe a mensagem de erro, se houver */}
      {error && <p>Error: {error}</p>}
      {/* Div onde o mapa será renderizado */}
      <div ref={mapRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};

export default Map;
