# Docker Setup for Time Slot Backend

This document explains how to use Docker with your NestJS + Prisma application.

## Quick Start

### 1. Start the entire stack (Database + App)

```bash
npm run docker:compose:up
```

### 2. View logs

```bash
npm run docker:compose:logs
```

### 3. Stop the stack

```bash
npm run docker:compose:down
```

## Available Scripts

### Prisma Scripts

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:db:push` - Push schema changes to database
- `npm run prisma:db:seed` - Seed the database

### Docker Scripts

- `npm run docker:build` - Build the Docker image
- `npm run docker:run` - Run the container
- `npm run docker:compose:up` - Start all services
- `npm run docker:compose:down` - Stop all services
- `npm run docker:compose:logs` - View logs
- `npm run docker:compose:studio` - Start Prisma Studio in Docker

### Development Scripts

- `npm run db:setup` - Generate Prisma client and run migrations

## Services

### PostgreSQL Database

- **Port**: 5432
- **Database**: timeslot_db
- **Username**: postgres
- **Password**: postgres
- **Container**: time-slot-postgres

### NestJS Application

- **Port**: 3000
- **Container**: time-slot-app
- **URL**: http://localhost:3000

### Prisma Studio (Optional)

- **Port**: 5555
- **Container**: time-slot-prisma-studio
- **URL**: http://localhost:5555
- **Start with**: `npm run docker:compose:studio`

## Environment Variables

The Docker setup uses these default values:

- `DATABASE_URL`: `postgresql://postgres:postgres@postgres:5432/timeslot_db`
- `NODE_ENV`: `production`

## Database Setup

After starting the containers, you may need to run migrations:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

## Troubleshooting

### Port Conflicts

If you get port conflicts, you can modify the ports in `docker-compose.yml`:

- PostgreSQL: Change `5432:5432` to `5433:5432`
- App: Change `3000:3000` to `3001:3000`
- Prisma Studio: Change `5555:5555` to `5556:5555`

### Database Connection Issues

1. Ensure PostgreSQL container is running: `docker ps`
2. Check logs: `npm run docker:compose:logs`
3. Verify DATABASE_URL in your `.env` file

### Reset Everything

```bash
# Stop and remove containers
npm run docker:compose:down

# Remove volumes (WARNING: This will delete all data)
docker volume rm time-slot-be_postgres_data

# Start fresh
npm run docker:compose:up
```
