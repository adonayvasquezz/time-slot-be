# Time Slot Backend

A NestJS-based backend application for managing time slots with PostgreSQL database, Prisma ORM, Auth0 authentication, and Google Calendar integration.

## 🚀 Quick Start

### Prerequisites

- Node.js (v20+)
- Docker & Docker Compose
- Git

### 1. Clone and Start

```bash
git clone <repository-url>
cd time-slot-be

# Start with Docker (recommended)
npm run docker:compose:up

# Setup database
npm run db:setup
```

### 2. Access the Application

- **API**: http://localhost:3000
- **Database**: localhost:5432
- **Prisma Studio**: http://localhost:5555

## 📋 Features

### ✅ Core Features

- **Event Management**: CRUD operations for time slots
- **User Management**: Auth0 integration with JWT authentication
- **Conflict Detection**: Prevents overlapping events (local + Google Calendar)
- **Google Calendar Sync**: Automatic synchronization with Google Calendar
- **Database**: PostgreSQL with Prisma ORM

### ✅ Security

- Auth0 JWT authentication
- User-specific event filtering
- Secure token handling

### ✅ Integration

- Google Calendar API integration
- Real-time conflict detection
- Automatic event synchronization

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/timeslot_db

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=your-api-identifier
AUTH0_ISSUER=https://your-tenant.auth0.com/

# Application
NODE_ENV=development
PORT=3000
```

### Auth0 Setup

1. Create an Auth0 application
2. Configure API with RS256 signing
3. Set audience and issuer in environment variables
4. Frontend sends JWT in `Authorization: Bearer <token>` header

### Google Calendar Setup

1. Enable Google Calendar API
2. Configure OAuth2 credentials
3. Frontend provides access token in `X-Google-Token` header
4. Automatic sync on CRUD operations

## 📡 API Endpoints

### Events

```bash
GET    /events                    # List user events
POST   /events                    # Create event
GET    /events/:id                # Get specific event
PATCH  /events/:id                # Update event
DELETE /events/:id                # Delete event
```

### Google Calendar

```bash
GET    /events/google-calendar/list    # List Google Calendar events
POST   /events/sync/google-calendar    # Sync all events
```

## 📚 API Documentation

The API is fully documented with Swagger/OpenAPI. Access the interactive documentation at:

**Swagger UI**: http://localhost:3000/api/docs

### Features

- ✅ **Interactive Documentation**: Test endpoints directly from the browser
- ✅ **Request/Response Examples**: See exact data structures
- ✅ **Authentication**: Bearer token support with "Authorize" button
- ✅ **Error Responses**: All possible error codes documented
- ✅ **Models**: Complete Event and DTO schemas

### Usage

1. Start the application: `npm run docker:compose:up`
2. Open: http://localhost:3000/api/docs
3. Click "Authorize" to add your Bearer token
4. Test any endpoint directly from the UI

## 🔄 Event Conflict Detection

The system prevents overlapping events by checking:

1. **Local Database**: Events stored in PostgreSQL
2. **Google Calendar**: Events in user's Google Calendar
3. **Real-time Validation**: Before creating/updating events

### Conflict Types Detected

- Partial overlaps
- Complete containment
- Event wrapping

### Error Response

```json
{
  "statusCode": 409,
  "message": "Event conflicts with existing events: Meeting"
}
```

## 🏗️ Project Structure

```
src/
├── events/                 # Event management
│   ├── controllers/        # API endpoints
│   ├── services/          # Business logic
│   ├── repositories/      # Data access
│   └── entities/          # Data models
├── google/                # Google Calendar integration
├── common/                # Shared utilities
└── prisma/               # Database configuration
```

## 🐳 Docker Commands

```bash
# Start all services
npm run docker:compose:up

# View logs
npm run docker:compose:logs

# Stop services
npm run docker:compose:down

# Prisma Studio
npm run docker:compose:studio
```

## 📝 Available Scripts

### Development

```bash
npm run start:dev          # Development mode
npm run build              # Build application
npm run test               # Run tests
npm run lint               # Code linting
```

### Database

```bash
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
npm run db:setup           # Setup database
```

### Docker

```bash
npm run docker:build       # Build image
npm run docker:compose:up  # Start services
npm run docker:compose:down # Stop services
```

## 🔒 Authentication Flow

1. **Frontend**: Obtains JWT from Auth0
2. **API Request**: Sends JWT in `Authorization` header
3. **Backend**: Validates JWT and extracts user info
4. **User Context**: Events filtered by user ID
5. **Google Token**: Optional `X-Google-Token` for Calendar sync

## 🔄 Google Calendar Integration

### Automatic Sync

- **Create**: Event created locally → Created in Google Calendar
- **Update**: Event updated locally → Updated in Google Calendar
- **Delete**: Event deleted locally → Deleted from Google Calendar

### Manual Sync

```bash
POST /events/sync/google-calendar
Authorization: Bearer <google-access-token>
```

### Conflict Detection

- Checks both local database and Google Calendar
- Prevents creation of conflicting events
- Provides detailed error messages

## 🛠️ Development

### Local Setup (without Docker)

```bash
# Install dependencies
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run start:dev
```

## 🚨 Troubleshooting

### Common Issues

**Port Conflicts**

```bash
# Modify docker-compose.yml ports
PostgreSQL: 5433:5432
App: 3001:3000
Prisma Studio: 5556:5555
```

**Database Connection**

```bash
# Check containers
docker ps

# View logs
npm run docker:compose:logs

# Reset database
docker volume rm time-slot-be_postgres_data
npm run docker:compose:up
```

**Auth0 Issues**

- Verify environment variables
- Check JWT format: `Bearer <token>`
- Ensure audience and issuer match Auth0 config

**Google Calendar Issues**

- Verify access token permissions
- Check token expiration
- Ensure Google Calendar API is enabled
