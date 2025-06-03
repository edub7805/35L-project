# 35L Project

This is a full-stack web application built with React (frontend) and Spring Boot (backend). The application uses MongoDB as its database and is styled with Tailwind CSS.

## Project Structure

- `my-app/`: Frontend React application
- `backend/`: Spring Boot backend application

## Prerequisites

- Node.js (v16 or higher)
- Java 17 or higher
- MongoDB
- Maven

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/edub7805/35L-project
cd 35L-project
```

### 2. Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd my-app
npm install
npm run dev
```

The frontend development server will start on `http://localhost:5173`

We recommend using VS Code to start the backend and your local terminal to start the frontend.

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- ESLint

### Backend
- Spring Boot 3.4.5
- MongoDB
- Maven
- Lombok

## Development

- Frontend development server runs on `http://localhost:5173`
- Backend server runs on `http://localhost:8080`
- MongoDB should be running locally on the default port (27017)

## Building for Production

### Frontend
```bash
cd my-app
npm run build
```

### Backend
```bash
cd backend
mvn clean package
```

