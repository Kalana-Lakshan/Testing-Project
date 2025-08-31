# MedSync - Medical Clinic Management System

A comprehensive medical clinic appointment and treatment management system built with modern web technologies.

## 🏥 Project Overview

MedSync is a full-stack web application designed to streamline clinic operations, manage patient appointments, and handle treatment records efficiently. The system provides a seamless experience for both healthcare providers and patients.

## 📁 Project Structure

```
Project-MedSync/
├── backend/                    # Node.js + TypeScript API server
│   ├── src/                   # Backend source code
│   ├── package.json           # Backend dependencies
│   └── README.md              # Backend setup guide
├── frontend/                   # React + TypeScript client
│   ├── src/                   # Frontend source code
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Frontend setup guide
├── database/                   # Database schemas and migrations
├── docs/                      # Project documentation
│   ├── DB_Project_Clinic_ERD.pdf
│   ├── Group 2 SRS.pdf
│   └── Project 1 - Clinic Appointment and Treatment Management System.pdf
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- npm

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Project-MedSync
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file
   npm run dev
   ```

   📖 **Detailed backend setup**: See [backend/README.md](backend/README.md)

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   📖 **Detailed frontend setup**: See [frontend/README.md](frontend/README.md)

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: postgres library
- **Build**: TypeScript Compiler

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React

## 📖 Documentation

- **System Requirements Specification**: [Group 2 SRS.pdf](Group%202%20SRS.pdf)
- **Project Overview**: [Project 1 - Clinic Appointment and Treatment Management System.pdf](Project%201%20-%20Clinic%20Appointment%20and%20Treatment%20Management%20System.pdf)
- **Database Design**: [DB_Project_Clinic_ERD.pdf](DB_Project_Clinic_ERD.pdf)

## 🔧 Development

### Running the Full Stack

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on: `http://localhost:8000`

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   Client runs on: `http://localhost:5173`

### Project Components

- **Backend API**: RESTful API for clinic management operations
- **Frontend Client**: React-based user interface
- **Database**: PostgreSQL for data persistence
- **Documentation**: Comprehensive system specifications

## 🎯 Features (Planned/In Development)

- Patient registration and management
- Appointment scheduling and tracking
- Treatment record management
- Healthcare provider dashboard
- Patient portal
- Reporting and analytics

## 📊 Database

The system uses PostgreSQL with a comprehensive schema designed for clinic management:
- Patient records
- Appointment scheduling
- Treatment history
- Healthcare provider information
- Billing and payments

Refer to the ERD document for detailed database design.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📁 Module References

- **Backend Development**: [backend/README.md](backend/README.md) - Complete API setup and development guide
- **Frontend Development**: [frontend/README.md](frontend/README.md) - React application setup and development
- **Database Schema**: Check the database/ directory for migrations and schema files

## 👥 Team Members

- **230365D** - LAKSHAN H.M.K. - [GitHub](https://github.com/Kalana-Lakshan)
- **230425M** - NAWAGAMUWA N.A.K. - [GitHub](https://github.com/ashiniKavindya)
- **230453V** - PADMASIRI G.R.H.D. - [GitHub](https://github.com/hasarangadinuj)
- **230518C** - RAKESHAN K.R.K. - [GitHub](https://github.com/KRakeesh04)
- **230611F** - SHAZAN M.S.M. - [GitHub](https://github.com/shazzann)

## 📞 Support

For technical issues or questions:
- Backend-related: Refer to [backend/README.md](backend/README.md) troubleshooting section
- Frontend-related: Refer to [frontend/README.md](frontend/README.md) development guide
