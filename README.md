# App installer bot

## Installation

```
./install/install.sh
```

## Usage

Start your node server
```
./node_modules/.bin/babel-node src/server.js --token <HockeyApp token>
```

You can now install your apps to your devicelab from [http://localhost:3000](http://localhost:3000).

## Serving the bot to others

[Ngrok](https://ngrok.com/) is packaged with this.

You can thus serve your devicelab bot to the world with:
```
./ngrok http localhost:3000
```

You can now access the devicelab bot anywhere with `http://[ngrox id].ngrok.io`.

## API Usage

You can also install your app by calling `/install?appName=<your-app-name>`.

This will return a `build id`, that you can use to retrieve logs by calling `/build/:buildId`
