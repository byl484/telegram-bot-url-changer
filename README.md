# telegram-bot-url-changer

A small application that uses the Telegram Bot API to allow authorized users to update a configured Spotify link.

## Features

- Accepts Spotify links through Telegram Bot API
- Restricts access to specific Telegram user IDs
- Validates submitted Spotify URLs
- Updates the configured URL to TBD

## Requirements

- Node.js v.24
- npm
- Telegram bot token
- Telegram user IDs for user authorization

## Setup

Install dependencies:

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:

```bash
BOT_TOKEN=your_telegram_bot_token
ALLOWED_USER_IDS=1234,5678
```

BOT_TOKEN is the token provided by Telegram's BotFather.

ALLOWED_USER_IDS is a comma-separated list of Telegram user IDs that are allowed to update the Spotify link.

## Development

```bash
npm run dev
```

## Building

Build the TypeScript project:

```bash
npm run build
```

The compiled JavaScript files are output to the dist directory.

## Running in Production

After building the project, start the compiled application:

```bash
npm run start
```

The bot will run using the compiled files from the dist directory.
