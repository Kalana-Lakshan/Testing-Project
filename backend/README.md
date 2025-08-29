# MedSync Backend

A Node.js backend application built with TypeScript and Express.js for the MedSync medical synchronization platform.

## 📁 Project Structure

```
backend/
├── src/                    # Source code directory
│   ├── handlers/          # Request handlers (empty - ready for implementation)
│   ├── models/            # Data models and database queries
│   │   └── user.model.ts  # User model with database operations
│   ├── router/            # API routes (empty - ready for implementation)
│   ├── db.ts              # Database connection configuration
│   └── index.ts           # Main application entry point
├── dist/                  # Compiled JavaScript output (auto-generated)
├── node_modules/          # Dependencies (auto-generated)
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Installation and how to run backend

1. **Clone the repository and navigate to backend directory:**
   ```bash
   cd Project-MedSync/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration values.

4. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Configuration

Create a `.env` file in the backend root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.sampleURLofSuperbase.supabase.co:0000/postgres

update the **DATABASE_URL** with actual URL in superbase Direct connection and update the **[YOUR-PASSWORD]** with actual password in that URL
```


## 🛠 Available Scripts

### Development

```bash
# Start development server with watch mode
npm run dev
```
This command:
- Compiles TypeScript to JavaScript
- Starts the server with nodemon for auto-restart on changes
- Watches for TypeScript changes and recompiles automatically

### Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Individual Scripts

```bash
# Build only (compile TypeScript)
npm run build

# Clean and build
npm run build
```

## 🗄️ Database

The application uses PostgreSQL as the database with the `postgres` library for database operations.

### Database Connection

- Database connection is configured in `src/db.ts`
- Uses connection string from `DATABASE_URL` environment variable
- Throws error if `DATABASE_URL` is not provided

<!--### Current Models

- **User Model** (`src/models/user.model.ts`):-->

## 📡 API Structure

The application is structured to support a clean API architecture:

- **Handlers**: Request handlers and business logic (ready for implementation)
- **Models**: Database operations and data models
- **Router**: API route definitions (ready for implementation)

### Current Endpoints

Currently, the main server is set up but no active endpoints are configured. The application listens on port 8000.

## 🔧 Technology Stack

- **Runtime**: Node.js with ES Modules
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with `postgres` library
- **Build Tools**: TypeScript Compiler, Rimraf
- **Development**: Nodemon for auto-restart

## 📦 Dependencies

### Production Dependencies

- `express`: Web framework
- `postgres`: PostgreSQL client
- `typescript`: TypeScript compiler
- `rimraf`: Cross-platform rm -rf

### Development Dependencies

- `nodemon`: Development server with auto-restart
- `ts-node`: TypeScript execution engine
- `@types/express`: Express TypeScript definitions
- `@types/node`: Node.js TypeScript definitions

## 🚦 Development Workflow

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Make changes to TypeScript files in `src/`**

3. **The server automatically restarts on file changes**

4. **For production deployment:**
   ```bash
   npm run build
   npm start
   ```

## 🔒 Security Notes

- Never commit `.env` files to version control (added in .gitignore)
- Always use `.env.example` as a template
- Keep database credentials secure
- Use environment variables for sensitive configuration

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Ensure PostgreSQL is running
   - Verify `DATABASE_URL` in `.env` file
   - Check database credentials and network connectivity

2. **Build Errors:**
   - Run `npm run build` to check TypeScript compilation errors
   - Ensure all dependencies are installed with `npm install`


### Development Tips

- Use `npm run build` to check for TypeScript errors
- Check the `dist/` folder for compiled JavaScript output
- Monitor server logs for runtime errors
- Use database client tools to verify database operations

## 🔄 Next Steps

The current backend is a foundation ready for development. Consider implementing:

1. API routes in `src/router/`
2. Request handlers in `src/handlers/`
3. Additional models in `src/models/`
4. Middleware for authentication, logging, etc.
5. Error handling and validation
6. API documentation
7. Testing suite

## 📞 Support

For issues and questions related to the backend setup, please check the troubleshooting section or consult the development team.
