# Telegram URL Manager Bot with HTTP Server

A small TypeScript application that runs a Telegram bot alongside a lightweight HTTP server. Authorized Telegram users can update a configured link.

## Features

- Accepts links through the Telegram Bot API
- Restricts access to specific Telegram user IDs
- Validates submitted URLs
- Updates the configured URL to TBD
- Runs a lightweight HTTP server alongside the Telegram bot

## Requirements

- Node.js v24
- npm
- Telegram bot token
- Telegram user IDs for user authorization

## Setup

Install dependencies:

    npm install

## Configuration

Create a `.env` file based on `.env.example`:

    cp .env.example .env

### Application

    BOT_TOKEN=your_telegram_bot_token
    DATABASE_PATH=data/database.db
    SERVER_PORT=3000

`BOT_TOKEN` is the token provided by Telegram's BotFather. `DATABASE_PATH` specifies the path to the NeDB database file. `SERVER_PORT` specifies the port used by the HTTP server.

### Initial users

    INITIAL_USER_1_TELEGRAM_ID=your_first_user_telegram_id
    INITIAL_USER_1_USERNAME=first_username
    INITIAL_USER_1_LINK=https://example.com/first-link

    INITIAL_USER_2_TELEGRAM_ID=your_second_user_telegram_id
    INITIAL_USER_2_USERNAME=second_username
    INITIAL_USER_2_LINK=https://example.com/second-link

The `INITIAL_USER_*` variables define the users that are initialized in the database.

### Messages

    UNAUTHORIZED_MESSAGE=Unauthorized.
    INVALID_LINK_MESSAGE=Please send a valid link.
    UPDATE_SUCCESS_MESSAGE=Link updated successfully to:
    UPDATE_ERROR_MESSAGE=Failed to update the link.

The `*_MESSAGE` variables configure the messages sent by the Telegram bot.

## Development

Run the application in development mode:

    npm run dev

The Telegram bot and HTTP server will start together.

## Building

Build the TypeScript project:

    npm run build

The compiled JavaScript files are output to the dist directory.

## Running in Production

After building the project, start the compiled application:

    npm run start

The application starts both the Telegram bot and HTTP server using the compiled files from the dist directory.
