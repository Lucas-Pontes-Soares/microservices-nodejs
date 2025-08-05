## Como rodar?

- Inicializar o Broker (rabbitmq) - rodar: ./ docker compose up -d
- Inicializar o banco de dados app-orders: ./app-orders, docker compose up -d
- Rodar localmente: cd ./app-orders, npm run dev
- Abrir interface do banco: cd ./app-orders, npx drizzle-kit studio