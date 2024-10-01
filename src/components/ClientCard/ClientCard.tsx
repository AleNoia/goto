import { Button } from '@/components/ui/button';
import { PhoneIcon, MapPin, Mail } from 'lucide-react';
import usePhoneFormatter from '@/hooks/usePhoneFormatter';

interface FilterProps {
  clientSelected: ClientLocation;
  setShowClients: (newValue: boolean) => void;
  setClientSelected: (newValue: ClientLocation) => void;
  userLocation: Adress | null;
}

const ClientCard = ({
  clientSelected,
  setShowClients,
  setClientSelected,
  userLocation
}: FilterProps) => {
  const getDirectionsUrl = () => {
    if (userLocation) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      const destination = `${clientSelected.lat},${clientSelected.lng}`;
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    }
    // Caso não tenha a localização do usuário, ainda cria o link para o destino
    return `https://www.google.com.br/maps?q=${clientSelected.lat},${clientSelected.lng}`;
  };

  return (
    <li
      key={clientSelected.id}
      className="border rounded-lg p-4 mr-1 cursor-pointer"
      onClick={() => {
        setShowClients(false);
        setClientSelected(clientSelected);
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <p className="font-semibold">{clientSelected.client}</p>
          <p className="text-sm text-gray-600 font-semibold">{clientSelected.street}</p>
          <span className="text-sm text-gray-500">{clientSelected.email}</span>
          <span className="text-sm text-gray-500">{usePhoneFormatter(clientSelected.phone)}</span>
        </div>
        <span className="text-sm text-gray-500">
          {userLocation &&
            Intl.NumberFormat('pt-BR').format(Number(clientSelected.distance.toFixed(2)) || 0)}{' '}
          km
        </span>
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex space-x-2">
          <a href={`tel:${clientSelected.phone}`}>
            <Button size="sm" variant="outline">
              <PhoneIcon className="h-4 w-4" />
            </Button>
          </a>
          <a href={`mailto:${clientSelected.email}`}>
            <Button size="sm" variant="outline">
              <Mail className="h-4 w-4 " />
            </Button>
          </a>
        </div>
        <a href={getDirectionsUrl()} target="_blank">
          <Button size="sm" variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Como chegar aqui
          </Button>
        </a>
      </div>
    </li>
  );
};
export default ClientCard;
