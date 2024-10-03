const exitStreetOverView = async (map: google.maps.Map) => {
  if (map) {
    // Verifica se o Street View está ativo e desativa
    const streetView = map.getStreetView();
    if (streetView && streetView.getVisible()) {
      streetView.setVisible(false); // Sai do Street View
    }
  }
};

export default exitStreetOverView;
