# Consultation Practice Learning Platform

A full-stack platform built with React, Node.js, Prisma, Redis, and OpenAI GPT-4o.

## Features
- **Candidate Assessment**: Interactive consultation practice with AI-driven scoring and feedback.
- **Admin Management**: Create scenarios, questions, and manage users.
- **Trainer View**: Review all submissions and platform analytics.
- **AI Evaluation**: Real-time evaluation using GPT-4o based on a business consultation rubric.

## Tech Stack
- **Frontend**: React (Vite) + TypeScript + TailwindCSS + Zustand
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Cache**: Redis (Rate limiting + Sessions)
- **AI**: OpenAI GPT-4o

## Prerequisites
- Node.js (v18+)
- Docker (for PostgreSQL & Redis)
- OpenAI API Key

## Getting Started

### 1. Start Dependencies
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your OPENAI_API_KEY and DATABASE_URL
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Credentials
- **Admin**: `admin@consult.com` / `admin123`
- **Trainer/Candidate**: (To be created by Admin)
