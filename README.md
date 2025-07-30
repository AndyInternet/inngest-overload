# Inngest Overload

This is a simple Express application built with TypeScript. It is my first use of the Inngest SDK and it will create functions that are designed to fill and overload
the Inngest self-hosting queue.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/AndyInternet/inngest-overload
   ```

2. Navigate to the project directory:

   ```
   cd inngest-overload
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Compile the TypeScript files:

   ```
   npm run build
   ```

5. Start the application:
   ```
   npm start
   ```

## Usage

1. Start the application in dev mode

   ```
   npm run dev
   ```

2. Start the inngest dev server

   ```
   npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
   ```

3. Send a `POST` request to `http://localhost:3000` with the following JSON body
   ```json
   {
     "toQueue": 1000,
     "runDuration": 100
   }
   ```
   `toQueue`: the number of items to queued
   `runDuration`: the time in ms each item will take to process

## Project Structure

```
my-express-app
├── src
│   ├── app.ts                # Entry point of the application
│   ├── controllers           # Contains route controllers
│   │   └── index.ts          # Index controller for handling routes
│   ├── routes                # Contains route definitions
│   │   └── index.ts          # Sets up application routes
│   ├── middleware            # Contains middleware functions
│   │   └── index.ts          # Middleware functions for the app
├── package.json              # NPM package configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```
