# Description

This Telegram bot was developed for viewing various anime content, including NSFW pictures. You can also upload any of your images to the database so that other users can appreciate your taste.

## Installation

### Requirements

- You need Node.js v12 or high.
- You need to have a PSQL database.
- Token from Telegram bot.
- Yarn installed.

### Installing

- Clone this repository: `git clone https://github.com/Riddea/Riddea.git`.
- Install Node.js requirements `yarn`.
- Rename `.env.example` to `.env` in every folder you can find, and configurate file.
- Build production code `yarn build`.
- Pre-run: `yarn migration:run`.
- Run production code:
  - Bot: `yarn start:bot`.
  - Api: `yarn start:api`.

## Contributing

This project opened for contribution and any suggestions! You can create a new `Issue` or make an `Pull request` with your code changes.

## LICENSE

This code has **MIT** license. See the `LICENSE` file for getting more information.
