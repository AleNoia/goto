import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LocateFixed, ChevronUp, ChevronDown, SearchX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import fetchClientLocations from '@/hooks/useFetchClientLocations';
import getBrowsweLocation from '@/hooks/useGetBrowsweLocation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalDispatch, useLocalState } from '@/hooks/Context';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/components/ui/menubar';
import { useState } from 'react';
import ClientCard from 'components/ClientCard';

const slideInAnimation = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: [10, 0],
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  exit: { y: -50, opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }
};

// Schema de validação usando Yup para o campo de filtro
const schema = yup.object({
  filter: yup.string().required('Campo obrigatório') // Valida que o campo de filtro é obrigatório
});

const Filter = () => {
  const localDispatch = useLocalDispatch();
  const { clientSelected, mapType, userLocation, clientsLocations, isLoading } = useLocalState();
  const { VITE_GOOGLE_API } = import.meta.env; // A chave da API do Google
  const { toast } = useToast();
  const [showFilter, setShowFilter] = useState(true); // Estado para esconder/mostrar o filtro
  const [showClients, setShowClients] = useState(true); // Estado para esconder/mostrar a listagem dos clientes

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
      localDispatch({ clientSelected: null });

      // Faz uma requisição à Geocoding API para converter o termo de busca em coordenadas
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.filter)}&key=${VITE_GOOGLE_API}`
      );

      if (!response.ok) {
        toast({
          title: 'Erro ao obter localização',
          description: 'Tente novamente ou entre me contato com o suporte'
        });
        localDispatch({ isLoading: false });
        throw new Error('Erro ao buscar a localização');
      }

      const result = await response.json();

      // Verifica se a API retornou resultados
      if (result.status === 'OK' && result.results.length > 0) {
        const { lat, lng } = result.results[0].geometry.location;
        const formatted_address = result.results[0].formatted_address;

        // Atualiza a localização do usuário com a nova coordenada
        localDispatch({ userLocation: { lat, lng, formatted_address } });

        // Simula o fetch de clientes com as coordenadas obtidas
        const response = await fetchClientLocations(lat, lng, localDispatch);
        localDispatch({ clientsLocations: response });
        localDispatch({ isLoading: false });
      } else {
        toast({
          title: 'Nenhuma localização encontrada',
          description: 'Tente novamente ou entre me contato com o suporte'
        });
        localDispatch({ isLoading: false });
      }
    } catch (error) {
      toast({
        title: 'Erro ao obter localização',
        description: 'Tente novamente ou entre me contato com o suporte'
      });
      console.error('Erro ao obter localização via Google Geocoding API:', error);
      localDispatch({ isLoading: false });
    }
  };

  // Alterna o tipo de mapa
  const handleToggleMapType = (type: MapType) => {
    localDispatch({ mapType: type });
  };

  if (!showFilter) {
    return (
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideInAnimation}
          className="absolute top-3 left-3 z-50"
        >
          <Card className="p-6 bg-white flex gap-3 items-center rounded-lg">
            <Button onClick={() => setShowFilter(true)} variant="outline" className="p-3">
              <ChevronDown className="h-4 w-4" />
            </Button>
            <p className="font-bold">
              {clientSelected?.client || userLocation?.formatted_address || 'Filtro'}
            </p>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (showFilter) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideInAnimation}
        className="absolute top-0 left-0 z-40 sm:top-3 sm:left-3 sm:max-w-lg w-full"
      >
        <Card className="max-w-full mx-auto">
          <CardHeader className="flex flex-row gap-3 items-center pb-3">
            <Button className="p-3" onClick={() => setShowFilter(false)} variant="outline">
              <ChevronUp className="h-4 w-4" />
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
                  setShowClients(true);
                  getBrowsweLocation(localDispatch);
                }}
              >
                <LocateFixed className="h-5 w-5" />
                <span>Minha localização</span>
              </Button>
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger onClick={() => handleToggleMapType('roadmap')}>
                    Mapa
                  </MenubarTrigger>
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
              {showClients &&
                clientsLocations.map((address: ClientLocation) => (
                  <ClientCard
                    clientSelected={address}
                    setShowClients={setShowClients}
                    userLocation={userLocation}
                  />
                ))}
              {!showClients && clientSelected && (
                <ClientCard
                  clientSelected={clientSelected}
                  setShowClients={setShowClients}
                  userLocation={userLocation}
                />
              )}
              {clientsLocations.length > 0 && (
                <Button
                  onClick={() => setShowClients(!showClients)}
                  variant="outline"
                  className="w-full flex gap-2 relative"
                >
                  {showClients ? 'Esconder clientes' : 'Mostrar clientes'}
                  <span className="text-xs bg-gray-200 rounded-md font-semibold px-2 py-1 absolute right-1 top-1">
                    {clientsLocations.length}
                  </span>
                </Button>
              )}
              {clientsLocations.length === 0 && !isLoading && (
                <div className="flex flex-col mt-5 items-center">
                  <SearchX className="h-16 w-16 text-gray-400" />
                  <p className="font-medium text-gray-400 text-sm">Nenhum cliente encontrado</p>
                </div>
              )}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
};
export default Filter;
