#!/bin/sh

set -e # Sai imediatamente se um comando falhar.

echo "🚀 Iniciando aplicação NestJS com TypeORM..."

# --- Função para Aguardar o Banco de Dados ---
wait_for_db() {
    echo "⏳ Aguardando banco de dados PostgreSQL ficar disponível..."

    DB_HOST="${DATABASE_HOST:-postgres}" # 'postgres' é o nome do serviço no docker-compose
    DB_PORT="${DATABASE_PORT:-5432}"
    DB_USER="${DATABASE_USER:-postgres}"
    DB_NAME="${DATABASE_DB:-yourdatabase}" # Ajuste para o nome do seu banco de dados padrão

    if [ -n "$DATABASE_URL" ]; then
        echo "Usando DATABASE_URL para extrair credenciais de espera."
        DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p' || echo "$DB_HOST")
        DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p' || echo "$DB_PORT")
        DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*\/\/\([^:]*\):.*/\1/p' || echo "$DB_USER")
        DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\/[^/]*\/\([^?]*\).*/\1/p' || echo "$DB_NAME")
    fi

    echo "Parâmetros de conexão para espera: Host=$DB_HOST, Porta=$DB_PORT, Usuário=$DB_USER, Banco=$DB_NAME"

    local timeout=30
    local count=0
    while ! nc -z "$DB_HOST" "$DB_PORT" >/dev/null 2>&1; do
        if [ $count -ge $timeout ]; then
            echo "❌ ERRO: Timeout aguardando a porta do banco de dados $DB_HOST:$DB_PORT."
            exit 1
        fi
        echo "🔄 Porta do banco de dados não disponível ainda, aguardando 1 segundo... ($((timeout - count))s restantes)"
        sleep 1
        count=$((count + 1))
    done
    echo "✅ Porta do banco de dados $DB_HOST:$DB_PORT está aberta."

    count=0
    while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
        if [ $count -ge $timeout ]; then
            echo "❌ ERRO: Timeout aguardando o banco de dados $DB_NAME em $DB_HOST:$DB_PORT estar pronto."
            exit 1
        fi
        echo "🔄 Banco de dados ainda não pronto para comandos SQL, aguardando 1 segundo... ($((timeout - count))s restantes)"
        sleep 1
        count=$((count + 1))
    done
    echo "✅ Banco de dados $DB_NAME está disponível e pronto para comandos SQL!"
}

run_typeorm_migrations() {
    echo "🗄️ Executando migrações do TypeORM..."

    if npm run migration:run; then
        echo "✅ Migrações TypeORM executadas com sucesso!"
    else
        echo "⚠️ ATENÇÃO: Falha ao executar migrações TypeORM. Verifique os logs acima para detalhes."
    fi
}

# --- Função Principal ---
main() {
    # 1. Aguarda o banco de dados
    wait_for_db

    # 2. Executa migrações TypeORM
    # A execução das migrações só ocorre se a conexão com o DB for bem-sucedida.
    run_typeorm_migrations

    echo "🎉 Preparação concluída. Iniciando aplicação..."

    # Executa o comando principal passado como argumento (ex: dumb-init npm run dev)
    exec "$@"
}

# --- Execução do Script ---
if [ "$1" = "migrate" ]; then
    echo "Modo de migrações manual detectado."
    wait_for_db 
    run_typeorm_migrations
    echo "Operação de migrações manual concluída."
    exit 0
fi

main "$@"