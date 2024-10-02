# Goto

**Goto** é um projeto que oferece funcionalidades de mapeamento, permitindo que os usuários visualizem locais e interajam com eles de maneira intuitiva. Este projeto é desenvolvido com React e utiliza várias bibliotecas para otimizar a experiência do usuário.

## Funcionalidades

- **Visualização de Mapa**: Utiliza a API do Google Maps para mostrar locais selecionados.
- **Localização do Usuário**: Permite que os usuários obtenham sua localização atual e vejam locais próximos.
- **Filtros de Clientes**: Os usuários podem filtrar e selecionar clientes em sua área.
- **Rota até o Local**: Oferece a opção de calcular a rota até um local específico.

## Dependências

### Dependências Principais

- `@googlemaps/js-api-loader`: Carrega a API do Google Maps de forma assíncrona, facilitando a integração do mapa no projeto.
- `react`: Biblioteca principal para a construção da interface do usuário.
- `react-dom`: Responsável por interagir com a DOM e renderizar componentes React.
- `framer-motion`: Biblioteca para animações que permite criar transições suaves e interações dinâmicas.
- `react-hook-form`: Facilita a manipulação de formulários, gerenciamento de estado e validações.
- `yup`: Biblioteca para validação de esquemas, frequentemente usada em conjunto com `react-hook-form`.
- `tailwindcss`: Framework CSS utilitário que permite estilização rápida e responsiva.
- `constate`: Utilizada para gerenciar estado global de forma simples, facilitando a comunicação entre componentes.

### Dependências de Desenvolvimento

- `typescript`: Adiciona tipagem estática ao JavaScript, melhorando a robustez e a manutenção do código.
- `vite`: Ferramenta de construção rápida para projetos front-end, otimizando o desenvolvimento.
- `eslint`: Ferramenta para identificar e corrigir problemas de qualidade de código, garantindo consistência no estilo.
- `prettier`: Formata o código automaticamente, promovendo a legibilidade e a padronização.
- `husky`: Permite que scripts sejam executados em hooks do Git, como pré-commit, para garantir que o código siga as diretrizes estabelecidas.

## Como Começar

Para começar a usar o projeto, clone o repositório e execute os seguintes comandos:

```bash
npm install
npm run dev
```
