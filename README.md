# Mollapara Social Welfare Association — Backend API

> মোল্লাপাড়া সমাজ কল্যাণ সংস্থা — RESTful API Server

## Live Link

> 🔗 Coming Soon

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | — | Runtime |
| Express | 5.1 | Web framework |
| TypeScript | 5.9 | Type safety |
| Prisma | 7.8 | ORM |
| PostgreSQL | — | Database |
| Zod | 4.3 | Request validation |
| Cloudinary | 2.9 | Image hosting |
| JSON Web Token | 9.0 | Authentication |
| bcryptjs | 3.0 | Password hashing |
| Nodemailer | 8.0 | Email sending |
| Multer | 2.0 | File upload handling |
| express-rate-limit | 8.5 | Rate limiting |

## Features

- JWT-based authentication with access & refresh tokens (httpOnly cookies)
- Role-based access control (ADMIN, MODERATOR, MEMBER)
- Request validation via Zod schemas
- Image upload & management via Cloudinary
- Email notifications (password reset, etc.)
- Pagination, filtering, and search support
- Rate limiting on auth endpoints
- Global error handling with structured responses

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema (16 models)
│   ├── seed.ts                 # Seed data
│   └── migrations/
├── src/
│   ├── server.ts               # Entry point
│   ├── app.ts                  # Express app setup
│   ├── config/index.ts         # Environment config
│   ├── errors/
│   │   ├── AppError.ts         # Custom error class
│   │   └── globalErrorHandler.ts
│   ├── middlewares/
│   │   ├── auth.ts             # JWT auth + RBAC
│   │   └── validateRequest.ts  # Zod validation wrapper
│   ├── shared/
│   │   ├── catchAsync.ts       # Async error wrapper
│   │   ├── fileUploader.ts     # Multer + Cloudinary
│   │   ├── paginationHelper.ts
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── sendEmail.ts        # Nodemailer transporter
│   │   └── sendResponse.ts     # Standardized JSON response
│   └── app/
│       ├── routes/index.ts     # Central route registrar
│       └── modules/            # 16 domain modules
│           ├── auth/
│           ├── user/
│           ├── news/
│           ├── fund/
│           ├── gallery/
│           ├── galleryCategory/
│           ├── upcomingEvent/
│           ├── complain/
│           ├── contact/
│           ├── bloodDonor/
│           ├── bloodRequest/
│           ├── scholarship/
│           ├── video/
│           ├── costing/
│           ├── monthlyChanda/
│           └── projectFund/
├── .env
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- Cloudinary account (for image uploads)
- Gmail app password (for email notifications)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/club-backend.git
cd club-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:5000/api/v1
DATABASE_URL="postgresql://user:password@localhost:5432/club_db?schema=public"
API_SECRET=your_cloudinary_api_secret
API_KEY=your_cloudinary_api_key
CLOUD_NAME=your_cloudinary_cloud_name
SALT_ROUND=12
JWT_SECRET=your_strong_jwt_secret_at_least_64_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d
APP_PASSWORD=your_gmail_app_password
SUPPORT_EMAIL=your_email@gmail.com
```

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login (rate limited: 10/15min) |
| POST | `/auth/logout` | No | Logout |
| POST | `/auth/refresh-token` | No | Refresh access token |
| POST | `/auth/change-password` | Yes | Change password |
| POST | `/auth/forgot-password` | No | Request password reset (rate limited: 5/hr) |
| POST | `/auth/reset-password` | No | Reset password with token |
| GET | `/auth/profile` | Yes | Get current user profile |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/create` | Admin | Create user |
| GET | `/users` | Admin | Get all users (paginated) |
| GET | `/users/:id` | Yes | Get user by ID |
| PATCH | `/users/:id` | Owner/Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |
| PATCH | `/users/:id/approve` | Admin | Approve user |
| PATCH | `/users/:id/reject` | Admin | Reject user |
| PATCH | `/users/:id/role` | Admin | Change user role |

### News

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/news` | Yes | Create news article |
| GET | `/news` | No | Get all news |
| GET | `/news/:id` | No | Get news by ID |
| PATCH | `/news/:id` | Yes | Update news |
| DELETE | `/news/:id` | Admin | Delete news |

### Gallery

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/gallery/upload` | Admin | Upload image |
| GET | `/gallery` | No | Get all gallery images |
| GET | `/gallery/:id` | No | Get image by ID |
| PATCH | `/gallery/:id` | Admin | Update image |
| DELETE | `/gallery/:id` | Admin | Delete image |

### Funds & Donations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/funds` | Yes | Create fund/donation |
| GET | `/funds` | Yes | Get all funds |
| GET | `/funds/:id` | Yes | Get fund by ID |
| PATCH | `/funds/:id` | Yes | Update fund |
| DELETE | `/funds/:id` | Yes | Delete fund |
| PATCH | `/funds/:id/status` | Yes | Update fund status |

### Blood Donors & Requests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/donors/create` | No | Register as blood donor |
| GET | `/donors` | No | Get all donors |
| GET | `/donors/:id` | No | Get donor by ID |
| PATCH | `/donors/:id` | Yes | Update donor info |
| DELETE | `/donors/:id` | Yes | Delete donor |
| POST | `/blood-requests` | No | Request blood |
| GET | `/blood-requests` | No | Get all requests |
| GET | `/blood-requests/:id` | No | Get request by ID |
| PATCH | `/blood-requests/:id` | Yes | Update request |
| DELETE | `/blood-requests/:id` | Yes | Delete request |

### Other Modules

| Module | Base Path | Endpoints |
|--------|-----------|-----------|
| Gallery Categories | `/gallery-categories` | CRUD |
| Upcoming Events | `/events` | CRUD |
| Complaints | `/complains` | CRUD |
| Contacts | `/contacts` | CRUD |
| Scholarships | `/scholarships` | CRUD (apply, list) |
| Videos | `/videos` | CRUD |
| Costings | `/costings` | CRUD |
| Monthly Chanda | `/monthly-chandas` | CRUD |
| Project Funds | `/project-funds` | CRUD |

## Database Models

16 models: `User`, `Post` (News), `Fund`, `Gallery`, `GalleryCategory`, `UpcomingEvent`, `Complain`, `Contact`, `Donor`, `BloodRequest`, `ScholarshipApplication`, `Video`, `Costing`, `MonthlyChanda`, `ProjectFund`, `RefreshToken`

## Scripts

```bash
npm run dev              # Start dev server with hot reload
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npx prisma db seed       # Seed database
npx prisma studio        # Open Prisma Studio (database GUI)
```

## License

MIT — Rasel Hasan
