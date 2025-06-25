<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Time Slot Backend

A NestJS-based backend application for managing time slots with PostgreSQL database and Prisma ORM.

## Prerequisites

Before running this project, ensure you have the following installed on your machine:

- **Node.js** (v20 or higher) - [Download here](https://nodejs.org/)
- **Yarn** package manager - [Installation guide](https://yarnpkg.com/getting-started/install)
- **Docker** and **Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start with Docker (Recommended)

The easiest way to run this project is using Docker, which will set up everything automatically including the PostgreSQL database.

### 1. Clone the repository

```bash
git clone <repository-url>
cd time-slot-be
```

### 2. Start the application with Docker Compose

```bash
# Start all services (database + application)
yarn docker:compose:up

# Or using npm
npm run docker:compose:up
```

This command will:

- Start a PostgreSQL database container
- Build and start the NestJS application container
- Set up the network between containers
- Run on the following ports:
  - **Application**: http://localhost:3000
  - **Database**: localhost:5432
  - **Prisma Studio** (optional): http://localhost:5555

### 3. Run database migrations

```bash
# Generate Prisma client and run migrations
yarn db:setup

# Or using npm
npm run db:setup
```

### 4. Verify the setup

- Check if containers are running: `docker ps`
- View application logs: `yarn docker:compose:logs`
- Access the API at: http://localhost:3000

## Manual Setup (Without Docker)

If you prefer to run the project without Docker, follow these steps:

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd time-slot-be
yarn install
```

### 2. Set up PostgreSQL database

You'll need a PostgreSQL database running locally or remotely. Update the `DATABASE_URL` in your environment:

```bash
# Create a .env file
echo "DATABASE_URL=postgresql://username:password@localhost:5432/timeslot_db" > .env
```

### 3. Set up the database

```bash
# Generate Prisma client
yarn prisma:generate

# Run database migrations
yarn prisma:migrate
```

### 4. Start the application

```bash
# Development mode
yarn start:dev

# Production mode
yarn start:prod
```

## Available Scripts

### Development Scripts

```bash
# Start the application
yarn start                    # Production mode
yarn start:dev               # Development mode with hot reload
yarn start:debug             # Debug mode

# Build the application
yarn build

# Run tests
yarn test                    # Unit tests
yarn test:e2e               # End-to-end tests
yarn test:cov               # Test coverage

# Code quality
yarn lint                   # ESLint
yarn format                 # Prettier formatting
```

### Database Scripts

```bash
# Prisma commands
yarn prisma:generate        # Generate Prisma client
yarn prisma:migrate         # Run migrations
yarn prisma:studio          # Open Prisma Studio
yarn prisma:db:push         # Push schema changes
yarn prisma:db:seed         # Seed the database
```

### Docker Scripts

```bash
# Docker commands
yarn docker:build           # Build Docker image
yarn docker:run             # Run container
yarn docker:compose:up      # Start all services
yarn docker:compose:down    # Stop all services
yarn docker:compose:logs    # View logs
yarn docker:compose:studio  # Start Prisma Studio in Docker
```

## Project Structure

```
time-slot-be/
├── src/                    # Application source code
│   ├── app.controller.ts   # Main controller
│   ├── app.service.ts      # Main service
│   ├── app.module.ts       # Root module
│   └── main.ts            # Application entry point
├── prisma/                # Database schema and migrations
│   └── schema.prisma      # Prisma schema
├── test/                  # Test files
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose services
└── package.json           # Dependencies and scripts
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/timeslot_db

# Application
NODE_ENV=development
PORT=3000
```

## Database Configuration

The application uses PostgreSQL with the following default configuration:

- **Host**: localhost (or `postgres` in Docker)
- **Port**: 5432
- **Database**: timeslot_db
- **Username**: postgres
- **Password**: postgres

## Troubleshooting

### Common Issues

#### Port Conflicts

If you get port conflicts, modify the ports in `docker-compose.yml`:

- PostgreSQL: Change `5432:5432` to `5433:5432`
- App: Change `3000:3000` to `3001:3000`
- Prisma Studio: Change `5555:5555` to `5556:5555`

#### Database Connection Issues

1. Ensure PostgreSQL container is running: `docker ps`
2. Check logs: `yarn docker:compose:logs`
3. Verify DATABASE_URL in your `.env` file

#### Docker Issues

```bash
# Reset everything
yarn docker:compose:down
docker volume rm time-slot-be_postgres_data
yarn docker:compose:up
```

### Useful Commands

```bash
# View running containers
docker ps

# View logs for specific service
docker-compose logs app
docker-compose logs postgres

# Access database directly
docker exec -it time-slot-postgres psql -U postgres -d timeslot_db

# Restart services
yarn docker:compose:restart
```

## Development Workflow

1. **Start the development environment**:

   ```bash
   yarn docker:compose:up
   ```

2. **Make code changes** - The application will automatically reload in development mode

3. **Run tests**:

   ```bash
   yarn test
   ```

4. **Update database schema**:

   ```bash
   # After modifying prisma/schema.prisma
   yarn prisma:generate
   yarn prisma:migrate
   ```

5. **View database** (optional):
   ```bash
   yarn docker:compose:studio
   # Then visit http://localhost:5555
   ```

## Deployment

For production deployment, the project includes a multi-stage Dockerfile optimized for production builds. See the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

## Support

- **Documentation**: [NestJS Documentation](https://docs.nestjs.com)
- **Discord**: [NestJS Discord](https://discord.gg/G7Qnnhy)
- **Issues**: Create an issue in the project repository

## License

This project is licensed under the MIT License.

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)
