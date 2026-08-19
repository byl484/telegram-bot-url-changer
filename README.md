# telegram-bot-url-changer

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

Create a .env file based on .env.example:

    cp .env.example .env

Configure the following environment variables:

    BOT_TOKEN=your_telegram_bot_token
    ALLOWED_USER_IDS=1234,5678
    PORT=3000

BOT_TOKEN is the token provided by Telegram's BotFather.

ALLOWED_USER_IDS is a comma-separated list of Telegram user IDs that are allowed to update the Spotify link.

PORT specifies the port used by the HTTP server. It defaults to 3000 if not provided.

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
