# brev.ly

A simple and fast URL shortener.

## Features

- Shorten long URLs
- Link analytics
- Export links to CSV

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS

### Backend

- Fastify
- TypeScript
- Drizzle ORM
- PostgreSQL
- Cloudflare R2 / AWS S3 for CSV Export storage

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- Docker and Docker Compose

### Running the application

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/lgbandeira/brev.ly.git
    cd brev.ly
    ```

2.  **Setup the backend:**

    ```bash
    cd server
    cp .env.example .env
    ```

    Update the `.env` file with your database and Cloudflare R2/AWS S3 credentials.

    ```bash
    docker-compose up -d
    npm install
    npm run db:generate #first time only
    npm run db:migrate
    npm run dev
    ```

The server should be running at `http://localhost:3333`.

3.  **Setup the frontend:**

    In another terminal:

    ```bash
    cd web
    cp .env.example .env
    ```

    Update the `.env` with your API URL.

    ```bash
    npm install
    npm run dev
    ```

The application should be running at `http://localhost:5173`.
