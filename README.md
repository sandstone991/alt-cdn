# alt-cdn

Experiencing a situation where your country inexplicably blocks certain content delivery networks, like jsDelivr, can be quite frustrating. This leads to numerous broken websites due to missing essential JavaScript files. This extension provides an alternative to using a VPN. It simply asks for a list of preferred providers (usually just one for most people) and automatically replaces the blocked content with suitable alternatives.

## Installation

- from releases download the package to your browser `chrome.zip`, `firefox.xpi` or `opera.crx`

- in chrome goto `chrome://extensions/` and enable developer mode, then drag drop the `chrome.zip` file

- if you want to load from source check [Contributing](#contributing)

## Contributing

- make sure you have node.js v14 `nvm use 14`

- install yarn `npm i -g yarn`

- install `yarn install`

- run dev command for your browser `yarn dev:chome` or `yarn dev:firefox` or `yarn dev:opera`

- add the extension to your browser
  - In Chrome/Edge 
        1. go to the extensions page (`chrome://extensions` or `edge://extensions`).
        2. Enable Developer Mode.
        3. click `load unpacked` then select `$your-project-path/extension/chrome`
