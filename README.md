# App installer bot [![Build Status](https://travis-ci.org/bamlab/devicelab-bot.svg?branch=master)](https://travis-ci.org/bamlab/devicelab-bot) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Installation

```
./install/install.sh
```

## Usage

Start your node server
```
HOCKEY_API_TOKEN==<token> npm start
```

You can now install your apps to your devicelab from [http://localhost:3000](http://localhost:3000).

An API documentation is available at [http://localhost:3000/docs](http://localhost:3000/docs).

### Using PM2

```
HOCKEY_API_TOKEN==<token> pm2 start src/server --interpreter ./node_modules/.bin/babel-node
```

### Serving the bot with Ngrok

[Ngrok](https://ngrok.com/) is packaged with this.

You can thus serve your devicelab bot to the world with:
```
./ngrok http localhost:3000
```

You can now access the devicelab bot anywhere with `http://[ngrox id].ngrok.io`.

## API Usage

You can also install your app by calling `/install?appName=<your-app-name>`.

This will return a `build id`, that you can use to retrieve logs by calling `/build/:buildId`

### API clients available

- A [Fastlane plugin](https://github.com/bamlab/fastlane-plugin-devicelab_bot)
- A [python client](./client.py)

## Using the CLI

```
npm i -g devicelab-bot
HOCKEY_API_TOKEN==<token> devicelab-bot install <appName>
HOCKEY_API_TOKEN==<token> devicelab-bot --help
```

## Development

### Commiting with Commitizen

```
yarn commit
```

### Testing

```
yarn test
```

### Building the CLI tools

```
yarn build:cli-tools
```
