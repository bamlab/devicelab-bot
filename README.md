# App installer bot

## Installation

```
./install/install.sh
```

## Usage

Start your node server
```
node src/server.js --token <HockeyApp token>
```

Serve it to the world with `ngrox`:
```
./ngrok http localhost:3000
```

Then from anywhere call `http://[ngrox id].ngrok.io/install/[hockey app id]`,
for instance `http://d9f385e4.ngrok.io/install/7eb823b34256409f89164301a61c0478`.
