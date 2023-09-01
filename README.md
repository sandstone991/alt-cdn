# alt-cdn

Experiencing a situation where your country inexplicably blocks certain content delivery networks, like jsDelivr, can be quite frustrating. This leads to numerous broken websites due to missing essential JavaScript files. This extension provides an alternative to using a VPN. It simply asks for a list of preferred providers (usually just one for most people) and automatically replaces the blocked content with suitable alternatives.

## Installation

- From [releases](https://github.com/sandstone991/alt-cdn/releases) download the package to your browser `chrome.zip`, `firefox.xpi` or `opera.crx`

- In chrome go to `chrome://extensions/` and enable developer mode, then drag drop the `chrome.zip` file.

- If you want to load from source check [Contributing](#contributing)

## Contributing

- Make sure you have node.js v14 `nvm use 14`

- Install yarn `npm i -g yarn`

- Install `yarn install`

- Run dev command for your browser `yarn dev:chome` or `yarn dev:firefox` or `yarn dev:opera`

- Add the extension to your browser
  - In Chrome/Edge 
        1. Go to the extensions page (`chrome://extensions` or `edge://extensions`).
        2. Enable Developer Mode.
        3. Click `load unpacked` then select `$your-project-path/extension/chrome`
