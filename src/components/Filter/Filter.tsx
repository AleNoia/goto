/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NavigationIcon, PhoneIcon, Search, LocateFixed } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import usePhoneFormatter from '@/hooks/usePhoneFormatter';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
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

interface Location {
  id: number;
  lat: number;
  lng: number;
  street: string;
  client: string;
  distance: number;
  phone: number;
  email: string;
}

interface FilterProps {
  clientsLocations: Location[];
  setUserLocation: (newValue: { lat: number; lng: number; formatted_address?: string }) => void;
  setCloseClients: (newValue: Location[]) => void; // Alterado para Location[]
  setClientSelected: (newValue: { lat: number; lng: number }) => void;
  userLocation: { lat: number; lng: number; formatted_address?: string } | null;
  setMapType: (newValue: 'roadmap' | 'satellite' | 'terrain' | 'hybrid') => void;
  mapType: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
}

const Filter = ({
  clientsLocations,
  setUserLocation,
  userLocation,
  setMapType,
  mapType,
  setClientSelected,
  setCloseClients
}: FilterProps) => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  // Hook useForm do react-hook-form com a validação de yup
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema) // Integração da validação do yup com react-hook-form
  });

  // Função para obter coordenadas de um endereço ou CEP usando a Geocoding API
  const { VITE_GOOGLE_API } = import.meta.env; // A chave da API do Google

  // Função para simular fetch de localização de clientes
  const fetchClientLocations = async (_lat: number, _lng: number) => {
    // Simula o tempo de espera do fetch
    return new Promise<Location[]>((resolve) => {
      setIsLoading(true);
      setTimeout(() => {
        resolve(clientsLocations);
        setIsLoading(false);
      }, 2000); // 2 segundos de espera
    });
  };

  // Função para obter a localização usando a Geolocation API do Google
  async function getGoogleLocation() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${VITE_GOOGLE_API}`,
        {
          method: 'POST' // A Google API espera uma requisição POST
        }
      );

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        toast({
          title: 'Erro ao obter localização',
          description: 'Tente novamente ou entre me contato com o suporte'
        });
        setIsLoading(false);
        throw new Error('Falha ao obter a localização');
      }

      // Converte a resposta em JSON
      const data = await response.json();

      // Extrai a localização (latitude e longitude)
      const { lat, lng } = data.location;

      // Retorna a localização
      setIsLoading(false);
      return setUserLocation({ lat, lng });
    } catch (error) {
      toast({
        title: 'Erro ao obter localização',
        description: 'Tente novamente ou entre me contato com o suporte'
      });
      console.error('Erro ao obter localização via Google Maps Geolocation API:', error);
      setIsLoading(false);
    }
  }

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
        const clientLocations = await fetchClientLocations(lat, lng);
        setCloseClients(clientLocations);
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

  const handleToggleMapType = (type: 'roadmap' | 'satellite' | 'terrain' | 'hybrid') => {
    setMapType(type);
  };

  return (
    <Card className="w-full max-w-lg mx-auto absolute top-3 left-3 z-40">
      <CardHeader className="flex flex-col justify-between items-center pb-3">
        <CardTitle className="text-lg w-full">
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
          <Button className="w-min gap-2" onClick={() => getGoogleLocation()}>
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

        <ul className="space-y-4 overflow-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
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
                  <span className="text-sm text-gray-500">{usePhoneFormatter(address.phone)}</span>
                </div>
                <span className="text-sm text-gray-500">{address.distance} km de você</span>
              </div>
              <div className="flex space-x-2 mt-2">
                <Button size="sm" variant="outline">
                  <NavigationIcon className="h-4 w-4 mr-2" />
                  Enviar e-mail
                </Button>
                <Button size="sm" variant="outline">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
export default Filter;
