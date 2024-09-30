import { useState } from 'react';
import { useForm } from 'react-hook-form'; // Importa o React Hook Form
import { yupResolver } from '@hookform/resolvers/yup'; // Importa o resolver do yup para integração com react-hook-form
import * as yup from 'yup'; // Importa o yup para validação de schema
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NavigationIcon, PhoneIcon } from 'lucide-react';

// Interface de endereços para tipar os dados
interface Address {
  id: number;
  lat: number;
  lng: number;
  street: string;
  city: string;
  distance: number;
}

// Schema de validação usando Yup para o campo de filtro
const schema = yup.object({
  filter: yup.string().required('Campo obrigatório') // Valida que o campo de filtro é obrigatório
});

export default function Filter() {
  // Hook useForm do react-hook-form com a validação de yup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema) // Integração da validação do yup com react-hook-form
  });

  const [addresses] = useState<Address[]>([
    { id: 1, lat: -24.956, lng: -53.455, city: 'Cascavel', street: '123 Main St', distance: 0.5 },
    { id: 2, lat: -5.0811, lng: -42.7743, city: 'Teresina', street: '123 Main St', distance: 0.5 },
    { id: 3, lat: -15.781, lng: -47.93, city: 'Brasília', street: '123 Main St', distance: 0.5 }
  ]);

  // Função chamada ao submeter o formulário, que recebe os dados válidos do formulário
  const onSubmit = (data: { filter: string }) => {
    console.log('Dados filtrados:', data.filter);
  };

  // Função para limpar o campo de filtro
  const clearFilter = () => reset({ filter: '' });

  return (
    <Card className="w-full max-w-lg mx-auto absolute top-16 left-3 z-40">
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="w-min text-lg">Filtro</CardTitle>
        <Button className="w-min" onClick={clearFilter}>
          Minha localização
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-4">
            <div className="flex space-x-2 mb-2 w-full">
              <Input
                placeholder="Pesquise por um endereço, CEP ou geolocalização"
                {...register('filter')}
              />
              <Button type="submit">Pesquisar</Button>
            </div>
            {errors.filter && (
              <p className="text-red-500 text-sm w-full">{errors.filter.message}</p>
            )}
          </div>
        </form>
        <ul className="space-y-4">
          {addresses.map((address) => (
            <li key={address.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{address.street}</p>
                  <p className="text-sm text-gray-500">{address.city}</p>
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
}
