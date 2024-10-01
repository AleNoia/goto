/* eslint-disable react-hooks/rules-of-hooks */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  PhoneIcon,
  Search,
  LocateFixed,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import usePhoneFormatter from '@/hooks/usePhoneFormatter';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import fetchClientLocations from '@/hooks/useFetchClientLocations';
import getBrowsweLocation from '@/hooks/useGetBrowsweLocation';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/components/ui/menubar';
import { useState } from 'react';

// Schema de validação usando Yup para o campo de filtro
const schema = yup.object({
  filter: yup.string().required('Campo obrigatório') // Valida que o campo de filtro é obrigatório
});

interface FilterProps {
  clientsLocations: ClientLocation[];
  setUserLocation: (newValue: Adress) => void;
  setCloseClients: (newValue: ClientLocation[]) => void;
  setClientSelected: (newValue: { lat: number; lng: number }) => void;
  userLocation: Adress | null;
  setMapType: (newValue: MapType) => void;
  mapType: MapType;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
}

const Filter = ({
  clientsLocations,
  setUserLocation,
  userLocation,
  setMapType,
  mapType,
  setClientSelected,
  setCloseClients,
  setIsLoading,
  isLoading
}: FilterProps) => {
  const { VITE_GOOGLE_API } = import.meta.env; // A chave da API do Google
  const { toast } = useToast();
  const [showFilter, setShowFilter] = useState(true); // Estado para esconder/mostrar o filtro

  // Hook useForm do react-hook-form com a validação de yup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema) // Integração da validação do yup com react-hook-form
  });

  // Função chamada ao submeter o formulário, que recebe os dados válidos do formulário
  const onSubmit = async (data: { filter: string }) => {
    try {
      setIsLoading(true);
      // Faz uma requisição à Geocoding API para converter o termo de busca em coordenadas
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.filter)}&key=${VITE_GOOGLE_API}`
      );

      if (!response.ok) {
        toast({
          title: 'Erro ao obter localização',
          description: 'Tente novamente ou entre me contato com o suporte'
        });
        setIsLoading(false);
        throw new Error('Erro ao buscar a localização');
      }

      const result = await response.json();

      // Verifica se a API retornou resultados
      if (result.status === 'OK' && result.results.length > 0) {
        const { lat, lng } = result.results[0].geometry.location;
        const formatted_address = result.results[0].formatted_address;

        // Atualiza a localização do usuário com a nova coordenada
        setUserLocation({ lat, lng, formatted_address });

        // Simula o fetch de clientes com as coordenadas obtidas
        const response = await fetchClientLocations(lat, lng, setIsLoading);
        setCloseClients(response);
        setIsLoading(false);
      } else {
        toast({
          title: 'Nenhuma localização encontrada',
          description: 'Tente novamente ou entre me contato com o suporte'
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: 'Erro ao obter localização',
        description: 'Tente novamente ou entre me contato com o suporte'
      });
      console.error('Erro ao obter localização via Google Geocoding API:', error);
      setIsLoading(false);
    }
  };

  // Alterna o tipo de mapa
  const handleToggleMapType = (type: MapType) => {
    setMapType(type);
  };

  if (!showFilter) {
    return (
      <div className="absolute top-3 left-3 z-50 ">
        <Button onClick={() => setShowFilter(true)} variant="outline" className="py-5">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  if (showFilter) {
    return (
      <Card className="w-full max-w-full top-0 left-0 mx-auto absolute z-40 sm:max-w-lg sm:top-3 sm:left-3 animate-[slideIn_400ms_ease-in-out]">
        <CardHeader className="flex flex-row gap-3 items-center pb-3">
          <Button className="p-3" onClick={() => setShowFilter(false)} variant="outline">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-lg">
            {userLocation?.formatted_address ? userLocation.formatted_address : 'Filtro'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col mb-4">
              <div className="flex space-x-2 mb-1 w-full">
                <Input
                  placeholder="Pesquise por um endereço, CEP ou geolocalização"
                  {...register('filter')}
                />
                <Button type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {errors.filter && (
                <p className="text-red-500 text-sm w-full">{errors.filter.message}</p>
              )}
            </div>
          </form>

          <div className="w-full flex gap-2 justify-between mb-4">
            <Button
              className="w-min gap-2"
              onClick={() => {
                reset();
                getBrowsweLocation(setIsLoading, setUserLocation, setCloseClients);
              }}
            >
              <LocateFixed className="h-5 w-5" />
              <span>Minha localização</span>
            </Button>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger onClick={() => handleToggleMapType('roadmap')}>Mapa</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <div
                      className="items-top flex space-x-2"
                      onClick={() => handleToggleMapType('terrain')}
                    >
                      <Checkbox id="terms1" checked={mapType === 'terrain'} />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms1"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Ativar relevo
                        </label>
                      </div>
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger onClick={() => handleToggleMapType('satellite')}>
                  Satélite
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <div
                      className="items-top flex space-x-2"
                      onClick={() => handleToggleMapType('hybrid')}
                    >
                      <Checkbox id="terms1" checked={mapType === 'hybrid'} />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms1"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Ativar marcadores
                        </label>
                      </div>
                    </div>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          <ul className="space-y-4 overflow-auto max-h-[39vh] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent sm:max-h-[50vh]">
            {isLoading &&
              [1, 2, 3, 4].map((item) => {
                return <Skeleton key={item} className="h-[158px] w-full" />;
              })}
            {clientsLocations.map((address) => (
              <li
                key={address.id}
                className="border rounded-lg p-4 mr-1 cursor-pointer"
                onClick={() => setClientSelected({ lat: address.lat, lng: address.lng })}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <p className="font-semibold">{address.client}</p>
                    <p className="text-sm text-gray-600 font-semibold">{address.street}</p>
                    <span className="text-sm text-gray-500">{address.email}</span>
                    <span className="text-sm text-gray-500">
                      {usePhoneFormatter(address.phone)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {userLocation &&
                      Intl.NumberFormat('pt-BR').format(
                        Number(address.distance.toFixed(2)) || 0
                      )}{' '}
                    km
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="flex space-x-2">
                    <a href={`tel:${address.phone}`}>
                      <Button size="sm" variant="outline">
                        <PhoneIcon className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href={`mailto:${address.email}`}>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 " />
                      </Button>
                    </a>
                  </div>
                  <a
                    href={`https://www.google.com.br/maps?q=${address.lat},${address.lng}`}
                    target="_blank"
                  >
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Como chegar aqui
                    </Button>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }
};
export default Filter;
