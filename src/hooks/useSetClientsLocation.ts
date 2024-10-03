/* eslint-disable @typescript-eslint/no-explicit-any */
// Callback setar os clientes no mapa
const setClientsLocation = async (
  map: google.maps.Map,
  loc: ClientLocation,
  localDispatch: (action: any) => void
) => {
  if (map) {
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
      localDispatch({ clientSelected: loc, showClient: false });
    });
  }
};

export default setClientsLocation;
