# 🧨 Inngest Overload

A load testing tool for Inngest queues built with Express and TypeScript. This application allows you to generate configurable workloads to test queue performance, concurrency limits, and system behavior under different loads.

## Features

- **Web Interface**: Modern dark-themed dashboard for easy load testing (I vibe coded this 🤘, thanks Claude)
- **Configurable Workloads**: Control queue size, duration, CPU usage, and concurrency
- **Real-time Feedback**: See results and responses immediately
- **Inngest Integration**: Built specifically for testing Inngest queue systems

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Inngest CLI for development

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AndyInternet/inngest-overload
   ```

2. Navigate to the project directory:

   ```bash
   cd inngest-overload
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   ```bash
   cp .env_example .env
   ```

   Then edit `.env` and add your Inngest keys:

   - `INNGEST_EVENT_KEY`: Your Inngest event key
   - `INNGEST_SIGNING_KEY`: Your Inngest signing key

5. Build the TypeScript files:
   ```bash
   npm run build
   ```

## Usage

### Option 1: Docker Compose (Recommended)

1. Update the Inngest keys in `docker-compose.yaml`:

   - Update the `INNGEST_EVENT_KEY` with an actual Inngest event key
   - Replace the `INNGEST_SIGNING_KEY` with an actual Inngest signing key
   - These keys must be hexadecimal strings

2. Start the entire stack with Docker Compose:

   ```bash
   docker-compose up -d
   ```

   This will start:

   - The main application on port 3000
   - Inngest server on ports 8288 (API) and 8289 (UI)
   - PostgreSQL database on port 5432
   - Redis cache on port 6379

3. Open two browser tabs and navigate to:
   http://localhost:3000 and
   http://localhost:8288

### Option 2: Web Interface (Development)

1. Start the application in development mode:

   ```bash
   npm run dev
   ```

2. In a separate terminal, start the Inngest dev server:

   ```bash
   npm run inngest
   ```

3. Open two browser tabs and navigate to:
   http://localhost:3000 and
   http://localhost:8288

### Option 3: API Endpoint

Send a `POST` request to `http://localhost:3000/trigger` with the following JSON body:

```json
{
  "toQueue": 50,
  "runDuration": 1000,
  "cpuUsage": "heavy",
  "concurrencyLimit": 10,
  "steps": true
}
```

## API Reference

### POST /trigger

Triggers a configurable number of Inngest events for load testing.

**Request Body:**

- `toQueue` (number): Number of events to queue
- `runDuration` (number): Duration each event should run (ms)
- `cpuUsage` (string): "light" or "heavy" - CPU intensity level
- `concurrencyLimit` (number): 0, 1, 10, 25, or 50 - Max concurrent events
- `steps` (boolean): Include steps in the event processing

**Response:**

```json
{
  "message": "50 events sent",
  "sentData": {
    "toQueue": 50,
    "runDuration": 1000,
    "cpuUsage": "heavy",
    "concurrencyLimit": 10,
    "steps": true
  },
  "response": {
    "runDuration": 1000,
    "cpuUsage": "heavy"
  }
}
```

## Project Structure

```
inngest-overload/
├── src/
│   ├── app.ts                # Express application entry point
│   ├── controllers/          # Route controllers
│   │   └── index.ts          # Trigger endpoint controller
│   ├── routes/               # Route definitions
│   │   └── index.ts          # API and Inngest routes
│   ├── middleware/           # Express middleware
│   │   └── index.ts          # Logging and other middleware
│   └── services/             # Business logic
│       └── inngest.ts        # Inngest client and functions
├── public/                   # Static web assets
│   └── index.html            # Load testing web interface
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
