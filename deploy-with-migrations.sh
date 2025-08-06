#!/bin/bash

set -e  # Encerra o script em caso de erro

echo "🔄 Subindo banco de dados (PostgreSQL)..."
docker compose -f docker-compose.prod.yml up -d postgres

echo "⏳ Aguardando banco de dados ficar saudável..."

# Aguarda até que o banco esteja saudável
until [ "$(docker inspect -f '{{.State.Health.Status}}' api-products-pg)" == "healthy" ]; do
  echo "⏳ Banco ainda não está pronto. Esperando..."
  sleep 2
done

echo "✅ Banco de dados está saudável."

echo "🧬 Executando migrations..."
docker compose -f docker-compose.migrations.yml run --rm migration-runner

echo "🧼 Removendo imagem do serviço migration-runner..."
docker image rm $(docker images -q --filter "label=com.docker.compose.service=migration-runner") || echo "⚠️ Imagem não encontrada ou já removida."

echo "🚀 Subindo aplicação em produção..."
docker compose -f docker-compose.prod.yml up --build -d api

echo "✅ Deploy finalizado com sucesso!"