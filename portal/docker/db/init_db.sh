set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE trading;
    CREATE TABLE IF NOT EXISTS game (
        id TEXT PRIMARY KEY,
        maxPlayers NUMERIC,
        active BOOL,
        startDate TIMESTAMP,
        endDate TIMESTAMP,
      );
EOSQL
