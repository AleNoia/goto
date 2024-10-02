import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useToast } from '@/hooks/use-toast';
import { useLocalState, useLocalDispatch } from '@/hooks/Context';
import getBrowsweLocation from '@/hooks/useGetBrowsweLocation';

const Map = () => {
  const localDispatch = useLocalDispatch();
  const { clientSelected, mapType, userLocation, clientsLocations } = useLocalState(); // Contexto com os dados
  const { toast } = useToast(); // Notificação
  const mapRef = useRef<HTMLDivElement>(null); // Referência ao elemento HTML onde o mapa será renderizado
  const [userMarker, setUserMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(
    null
  ); // Estado para armazenar a referência do marcador da localização do usuário
  const [map, setMap] = useState<google.maps.Map | null>(null); // Estado para armazenar a instância do mapa Google
  const { VITE_GOOGLE_API } = import.meta.env; // Obtenção da chave da API do Google Maps das variáveis de ambiente

  // Uso do `useMemo` para criar o Loader da API do Google Maps. Isso evita recriação desnecessária
  const loader = useMemo(() => {
    return new Loader({
      apiKey: VITE_GOOGLE_API,
      version: 'weekly',
      libraries: ['places', 'marker']
    });
  }, [VITE_GOOGLE_API]);

  // Configurações do mapa, incluindo o centro e o nível de zoom inicial
  const mapOptions = useMemo(
    () => ({
      mapId: 'GOTO_MAP_ID',
      center: { lat: -15.7801, lng: -47.9292 },
      zoom: 10,
      mapTypeControl: false,
      fullscreenControl: false
    }),
    []
  );

  // Hook `useEffect` para carregar o Google Maps usando o Loader
  useEffect(() => {
    loader
      .importLibrary('maps')
      .then(({ Map }) => {
        const newMap = new Map(mapRef.current!, mapOptions);
        setMap(newMap);
      })
      .catch((e: Error) => {
        toast({ title: 'Erro ao carregar o Google Maps', description: `${e}` });
      });
  }, [loader, mapOptions, toast]);

  // Hook `useEffect` para obter a localização do usuário quando o componente é montado
  useEffect(() => {
    getBrowsweLocation(localDispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Callback para sair do modo streetoverview do google
  const exitStreetOverView = useCallback(() => {
    if (map) {
      // Verifica se o Street View está ativo e desativa
      const streetView = map.getStreetView();
      if (streetView && streetView.getVisible()) {
        streetView.setVisible(false); // Sai do Street View
      }
    }
  }, [map]);

  // Callback para atualizar a localização do usuário e os clientes próximos
  const updateUserMarker = useCallback(async () => {
    if (map && userLocation) {
      exitStreetOverView();
      if (userMarker) userMarker.map = null; // Se já existe um marcador anterior, remove-o
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;

      // Cria um novo marcador para a localização atualizada do usuário
      const newUserMarker = new AdvancedMarkerElement({
        position: userLocation,
        map,
        title: 'Sua localização'
      });

      map.setCenter(userLocation); // Centraliza o mapa na nova localização do usuário
      map.setZoom(13); // Zoom no mapa
      setUserMarker(newUserMarker); // Atualiza o estado com o novo marcador

      // Adiciona os marcadores para as localizações predefinidas
      clientsLocations.forEach((loc: ClientLocation) => {
        const beachFlagImg = document.createElement('img');
        beachFlagImg.src = '/pin.svg';
        beachFlagImg.style.width = '40px';
        beachFlagImg.style.height = '40px';

        const clientMarker = new google.maps.marker.AdvancedMarkerElement({
          map, // Referência ao mapa
          position: { lat: loc.lat, lng: loc.lng }, // Posição da localização
          title: loc.client, // Título do marcador
          content: beachFlagImg // Ícone do marcador
        });

        // Adiciona o listener para o evento de clique
        clientMarker.addListener('click', () => {
          localDispatch({ clientSelected: loc });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, userLocation, exitStreetOverView, userMarker, clientsLocations]);

  // Define o tipo de mapa
  useEffect(() => {
    if (map) map.setMapTypeId(mapType);
  }, [map, mapType]);

  // Define o centro do mapa de acordo com o cliente selecionado
  const updateMapForClient = useCallback(async () => {
    if (map) {
      map.setCenter({ lat: clientSelected.lat, lng: clientSelected.lng });
      map.setZoom(17);
      exitStreetOverView();
    }
  }, [map, clientSelected, exitStreetOverView]);

  // useEffect que atualzia a localizacao do usuario
  useEffect(() => {
    if (map && userLocation) updateUserMarker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, userLocation]);

  // useEffect que atualzia a localizacao dos clientes próximos
  useEffect(() => {
    if (map && clientSelected) updateMapForClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, clientSelected]);

  //Div onde o mapa será renderizado
  return <div ref={mapRef} className="w-screen h-screen overflow-hidden" />;
};

export default Map;
