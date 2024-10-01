const clientsLocationsMock = [
  {
    id: 1,
    client: 'Client 1',
    lat: -24.956,
    lng: -53.455,
    phone: 99984771567,
    email: 'client1@email.com',
    street: 'Rua de Cascavel',
    city: 'Cascavel',
    state: 'PA' // Cascavel, PA (Pará)
  },
  {
    id: 2,
    client: 'Client 2',
    lat: -5.0811,
    lng: -42.7743,
    phone: 99984771567,
    email: 'client2@email.com',
    street: 'Rua de Teresina',
    city: 'Teresina',
    state: 'PI' // Teresina, PI (Piauí)
  },
  {
    id: 3,
    client: 'Client 3',
    lat: -15.781,
    lng: -47.93,
    phone: 40028922,
    email: 'client3@email.com',
    street: 'Rua de Brasília',
    city: 'Brasília',
    state: 'DF' // Brasília, DF
  },
  {
    id: 4,
    client: 'Client 4',
    lat: -25.4284,
    lng: -49.2733,
    phone: 99984771567,
    email: 'client4@email.com',
    street: 'Rua de Curitiba',
    city: 'Curitiba',
    state: 'PR' // Curitiba, PR (Paraná)
  },
  {
    id: 5,
    client: 'Client 5',
    lat: -24.96,
    lng: -53.46,
    phone: 99888776655,
    email: 'client5@email.com',
    street: 'Rua Nova de Cascavel',
    city: 'Cascavel',
    state: 'PA' // Cascavel, PA (Pará)
  },
  {
    id: 6,
    client: 'Client 6',
    lat: -5.0891,
    lng: -42.7893,
    phone: 99812345678,
    email: 'client6@email.com',
    street: 'Rua Nova de Teresina',
    city: 'Teresina',
    state: 'PI' // Teresina, PI (Piauí)
  },
  {
    id: 7,
    client: 'Client 7',
    lat: -5.0802,
    lng: -42.7974,
    phone: 99984771568,
    email: 'client7@email.com',
    street: 'Avenida Miguel Rosa',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 8,
    client: 'Client 8',
    lat: -5.0903,
    lng: -42.7555,
    phone: 99984771569,
    email: 'client8@email.com',
    street: 'Rua dos Lábios',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 9,
    client: 'Client 9',
    lat: -5.0921,
    lng: -42.7723,
    phone: 99984771570,
    email: 'client9@email.com',
    street: 'Rua Dom Severino',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 10,
    client: 'Client 10',
    lat: -5.0867,
    lng: -42.7958,
    phone: 99984771571,
    email: 'client10@email.com',
    street: 'Rua Dr. Pedro Freitas',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 11,
    client: 'Client 11',
    lat: -5.0784,
    lng: -42.7809,
    phone: 99984771572,
    email: 'client11@email.com',
    street: 'Avenida José dos Reis',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 12,
    client: 'Client 12',
    lat: -5.0713,
    lng: -42.7644,
    phone: 99984771573,
    email: 'client12@email.com',
    street: 'Rua Barão de Gurguéia',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 13,
    client: 'Client 13',
    lat: -5.0765,
    lng: -42.7542,
    phone: 99984771574,
    email: 'client13@email.com',
    street: 'Avenida João XXIII',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 14,
    client: 'Client 14',
    lat: -24.9493,
    lng: -53.4678,
    phone: 99984771575,
    email: 'client14@email.com',
    street: 'Rua São Paulo',
    city: 'Cascavel',
    state: 'PA'
  },
  {
    id: 15,
    client: 'Client 15',
    lat: -24.9401,
    lng: -53.4759,
    phone: 99984771576,
    email: 'client15@email.com',
    street: 'Avenida Brasil',
    city: 'Cascavel',
    state: 'PA'
  },
  {
    id: 16,
    client: 'Client 16',
    lat: -24.9422,
    lng: -53.4604,
    phone: 99984771577,
    email: 'client16@email.com',
    street: 'Rua Comendador D. Mendes',
    city: 'Cascavel',
    state: 'PA'
  },
  {
    id: 17,
    client: 'Client 17',
    lat: -24.9367,
    lng: -53.4548,
    phone: 99984771578,
    email: 'client17@email.com',
    street: 'Rua da Paz',
    city: 'Cascavel',
    state: 'PA'
  },
  {
    id: 18,
    client: 'Client 18',
    lat: -24.9254,
    lng: -53.4455,
    phone: 99984771579,
    email: 'client18@email.com',
    street: 'Avenida Paraná',
    city: 'Cascavel',
    state: 'PA'
  },
  {
    id: 19,
    client: 'Client 19',
    lat: -5.0943,
    lng: -42.7705,
    phone: 99984771580,
    email: 'client19@email.com',
    street: 'Rua Getúlio Vargas',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 20,
    client: 'Client 20',
    lat: -5.0755,
    lng: -42.7597,
    phone: 99984771581,
    email: 'client20@email.com',
    street: 'Rua 13 de Maio',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 21,
    client: 'Client 21',
    lat: -5.0801,
    lng: -42.7498,
    phone: 99984771582,
    email: 'client21@email.com',
    street: 'Rua São João',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 22,
    client: 'Client 22',
    lat: -24.9319,
    lng: -53.4751,
    phone: 99984771583,
    email: 'client22@email.com',
    street: 'Rua São Cristóvão',
    city: 'Cascavel',
    state: 'PA'
  },
  {
    id: 23,
    client: 'Client 23',
    lat: -24.9348,
    lng: -53.4524,
    phone: 99984771584,
    email: 'client23@email.com',
    street: 'Rua Hélio Nunes',
    city: 'Cascavel',
    state: 'PA'
  },
  {
    id: 24,
    client: 'Client 24',
    lat: -5.0863,
    lng: -42.7796,
    phone: 99984771585,
    email: 'client24@email.com',
    street: 'Rua Professora Lúcia Nunes',
    city: 'Teresina',
    state: 'PI'
  },
  {
    id: 25,
    client: 'Client 25',
    lat: -5.0895,
    lng: -42.7804,
    phone: 99984771586,
    email: 'client25@email.com',
    street: 'Rua São Sebastião',
    city: 'Teresina',
    state: 'PI'
  }
];

export default clientsLocationsMock;
