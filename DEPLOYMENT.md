# Deployment Guide (Vercel + Render)

This guide deploys the frontend to Vercel and the Spring Boot backend to Render.

## Prerequisites

- A MongoDB database (MongoDB Atlas recommended)
- A GitHub repository connected to Vercel and Render

## Backend on Render (Spring Boot)

### 1) Create a new Web Service

- Service type: Web Service
- Environment: Java
- Root Directory: Backend
- Build Command:
  - `./mvnw clean package -DskipTests`
- Start Command:
  - `java -jar target/Backend-0.0.1-SNAPSHOT.jar`

### 2) Add environment variables

Set these in Render > Environment:

- `MONGODB_URI` = your MongoDB connection string
- `JWT_SECRET` = a long random secret
- `CORS_ALLOWED_ORIGINS` = your Vercel URL(s), comma-separated
  - Example: `https://your-app.vercel.app,https://www.yourdomain.com`

Render provides `PORT` automatically. The backend reads it on startup.

### 3) Deploy

- Trigger a deploy from the Render dashboard
- Note the backend URL (example: `https://your-service.onrender.com`)

## Frontend on Vercel (Vite)

### 1) Import the repo in Vercel

- Framework: Vite
- Root Directory: project root (Bankmanagement)
- Build Command: `pnpm run build`
- Output Directory: `dist`

### 2) Set environment variables

In Vercel > Project Settings > Environment Variables:

- `VITE_API_URL` = Render backend URL + `/api`
  - Example: `https://your-service.onrender.com/api`

### 3) Deploy

- Trigger a deploy in Vercel
- Visit the Vercel URL and test login

## CORS Notes

CORS is configured from the environment variable `CORS_ALLOWED_ORIGINS`.
Use a comma-separated list if you need multiple origins.

## Smoke Test

- Open the Vercel site
- Try login or account fetch
- Check Render logs for any errors
