# SimpleEMS — Employee Management System

A basic Employee Management System built with React + Chakra UI (frontend), Django REST Framework (backend), and PostgreSQL (database).

## Stack

- **Frontend**: React 18, Chakra UI
- **Backend**: Django 4.2, Django REST Framework
- **Database**: PostgreSQL 15
- **Deployment**: Docker + Docker Compose

## Quick Start

```bash
# Copy env file
cp .env.example .env

# Start everything
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin: http://localhost:8000/admin

## Features

- Employee CRUD (Create, Read, Update, Delete)
- Department management
- Search by name, email, position, department
- Filter by status and department
- Dashboard with employee stats

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees/` | List employees |
| POST | `/api/employees/` | Create employee |
| GET | `/api/employees/{id}/` | Get employee |
| PUT | `/api/employees/{id}/` | Update employee |
| DELETE | `/api/employees/{id}/` | Delete employee |
| GET | `/api/employees/stats/` | Dashboard stats |
| GET | `/api/departments/` | List departments |
| POST | `/api/departments/` | Create department |
