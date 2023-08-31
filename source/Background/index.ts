import 'emoji-log';
import { browser } from 'webextension-polyfill-ts';
import { providers } from '../Constants';
browser.runtime.onInstalled.addListener((): void => {
    console.emoji('🦄', 'extension installed');
});
let blockedProvidersSynced: string[] = [];

// sync object on startup and install
browser.storage.local.get('blockedProivders').then((result) => {
    blockedProvidersSynced = result['blockedProivders'] || [];
});

browser.webRequest.onErrorOccurred.addListener(
    (details) => {
        if (details.error === 'net::ERR_BLOCKED_BY_CLIENT') return;
        Object.keys(providers).forEach((provider) => {
            if (details.url.search(provider) !== -1) {
                browser.storage.local.get(provider).then((result) => {
                    if (result[provider] === undefined) {
                        result[provider] = 0;
                    }
                    result[provider] += 1;
                    browser.storage.local.set(result);
                });
            }
        });
    },

    { urls: ['<all_urls>'], types: ['script'] },
);

browser.storage.onChanged.addListener((changes) => {
    browser.storage.local.get('lastNotification').then((result) => {
        const lastNotification = result.lastNotification;
        const now = Date.now();

        for (const [key, { newValue }] of Object.entries(changes)) {
            if (key in providers && newValue >= 3) {
                if (
                    lastNotification &&
                    now - lastNotification <= 1000 * 60 * 60
                )
                    continue;
                browser.notifications.clear('provider-error');
                browser.notifications.create('provider-error', {
                    type: 'basic',
                    iconUrl: browser.runtime.getURL(
                        'assets/icons/favicon-128.png',
                    ),
                    title: 'Provider Error',
                    message: `You have a problem with ${key} provider, please change it from the options page`,
                });
                browser.storage.local.set({ lastNotification: now });
            }
            if (key === 'blockedProivders') {
                //sync object
                browser.storage.local.get('blockedProivders').then((result) => {
                    blockedProvidersSynced = result['blockedProivders'];
                });
            }
        }
    });
});
browser.notifications.onClicked.addListener((id) => {
    if (id === 'provider-error') browser.runtime.openOptionsPage();
});

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (blockedProvidersSynced.length === 0) return;

        for (const provider of blockedProvidersSynced) {
            if (details.url.search(provider) === -1) continue;
            const replacement: keyof typeof providers | undefined = Object.keys(
                providers,
            ).find((provider) => {
                return blockedProvidersSynced.indexOf(provider) === -1;
            }) as keyof typeof providers | undefined;
            if (replacement === undefined) return;
            // ex: found https://cdn.jsdelivr.net/npm/package@version/file
            // extract package, version and file
            const url = new URL(details.url);
            let newUrl = '';
            if (url.hostname.search('jsdelivr') !== -1) {
                const path = url.pathname.split('/');
                const rest = path.slice(2).join('/');
                newUrl = `${'https://cdn.jsdelivr.xyz/npm/'}${rest}`;
            }
            if (url.hostname.search('unpkg') !== -1) {
                const path = url.pathname.split('/');
                const rest = path.slice(2).join('/');
                newUrl = `${replacement}${rest}`;
            }
            return { redirectUrl: newUrl };
        }
        return;
    },

    { urls: ['<all_urls>'], types: ['script'] },
    ['blocking'],
);
