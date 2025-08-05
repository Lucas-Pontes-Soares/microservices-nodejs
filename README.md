## Como rodar?

- Inicializar o Broker (rabbitmq) - rodar: ./ docker compose up -d
- Inicializar o servidor app-orders: ./app-orders, docker compuse up -d
- Rodar localmente: cd ./app-orders, npm run dev
- Abrir interface do banco: cd ./app-orders, npx drizzle-kit studio