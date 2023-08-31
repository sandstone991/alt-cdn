import * as React from 'react';
import { browser, Tabs } from 'webextension-polyfill-ts';

import '../styles/index.css';

function openWebPage(url: string): Promise<Tabs.Tab> {
    return browser.tabs.create({ url });
}

const Popup: React.FC = () => {
    return (
        <section id="popup" className="w-96 h-full bg-white">
            <div className="py-6 px-4 flex flex-col justify-start gap-4">
                <h2 className="text-xl w-full text-center">Alt CDN</h2>
                <div className="flex flex-row justify-evenly">
                    <button
                        id="options__button"
                        type="button"
                        onClick={(): Promise<Tabs.Tab> => {
                            return openWebPage('options.html');
                        }}
                        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                    >
                        Options
                    </button>
                    <button
                        type="button"
                        onClick={(): Promise<Tabs.Tab> => {
                            return openWebPage(
                                'https://github.com/sandstone991/alt-cdn',
                            );
                        }}
                        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                    >
                        GitHub
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Popup;
