docker compose down -v --remove-orphans


echo "Bringing stack back up"
docker compose up -d

echo "Waiting for postgres"
until docker exec -it padilla_postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
  sleep 1
done

echo "Running seeder"
docker compose run --rm padilla_db_seeder
