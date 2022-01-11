# Tiger Lottery Smart Contract


## About Tiger Lottery

<img src='https://github.com/varandrew/tiger-lottery/blob/main/screenshots/log.png' height="200" width="200" />


## Screenshot

### App
<img src="https://github.com/varandrew/tiger-lottery/blob/main/screenshots/app.png" width="1200" height="600"/>

### Remix

<img src="https://github.com/varandrew/tiger-lottery/blob/main/screenshots/remix.png" width="1200" height="600"/>

### Contract

<img src="https://github.com/varandrew/tiger-lottery/blob/main/screenshots/contract.png" width="800" height="1200"/>

## Project Layout

```bash
.
├── backend
│   ├── contracts
│   │   ├── artifacts
│   │   │   ├── Lottery.json
│   │   │   └── Lottery_metadata.json
│   │   └── Lottery.sol
│   ├── compile.js
│   ├── deploy.js
│   ├── package-lock.json
│   └── package.json
├── frontend
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src
│   │   ├── assets
│   │   │   └── logo.png
│   │   ├── contracts
│   │   │   └── Lottery.json
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── index.js
│   │   └── reportWebVitals.js
│   ├── package-lock.json
│   └── package.json
├── screenshots
│   ├── app.png
│   ├── contract.png
│   ├── log.png
│   └── remix.png
├── License
└── README.md

9 directories, 28 files
```

## Running the app

```bash
# git clone
git clone https://github.com/varandrew/tiger-lottery.git

# change dir
cd tiger-lottery

# install dependencies
yarn

# compile
node backend/compile.js

# deploy
node backend/deploy.js

# serve
cd frontend && yarn start

```
