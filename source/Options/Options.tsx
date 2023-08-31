import * as React from 'react';
import '../styles/index.css';
import { providers } from '../Constants';
import { browser } from 'webextension-polyfill-ts';
import clsx from 'clsx';
const Options: React.FC = () => {
    const [notWorkingProviders, setNotWorkingProviders] =
        React.useState<{ provider: string; times: number }[] | null>(null);
    const [blockedProivders, setBlockedProviders] =
        React.useState<string[] | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
    const errorMessageTimeout = React.useRef<number | null>(null);
    React.useEffect(() => {
        async function getNotWorkingProviders() {
            const blockedProivders = (
                await Promise.all(
                    Object.keys(providers).map(async (provider) => {
                        const res = await browser.storage.local.get(provider);
                        if (res[provider]) {
                            return {
                                provider,
                                times: res[provider],
                            };
                        } else {
                            return null;
                        }
                    }),
                )
            ).filter((provider) => provider !== null);
            setNotWorkingProviders(
                blockedProivders as { provider: string; times: number }[],
            );
        }
        async function getBlockedProviders() {
            const blockedProivders = await browser.storage.local.get(
                'blockedProivders',
            );
            setBlockedProviders(blockedProivders['blockedProivders'] || []);
        }
        getNotWorkingProviders();
        getBlockedProviders();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const blockedProivders = Object.keys(providers).filter(
            (provider) => !formData.getAll('provider').includes(provider),
        );
        browser.storage.local.set({ blockedProivders });
        setShowSuccessMessage(true);
        //clear the message after 5 seconds
        if (errorMessageTimeout.current)
            clearTimeout(errorMessageTimeout.current);
        errorMessageTimeout.current = window.setTimeout(() => {
            setShowSuccessMessage(false);
        }, 5000);
    };

    const SuccessMessage = () => {
        if (!showSuccessMessage) return null;
        return (
            <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline">
                    {' '}
                    Your changes have been saved.
                </span>
                <span
                    onClick={() => setShowSuccessMessage(false)}
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                    <svg
                        className="fill-current h-6 w-6 text-green-500"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <title>Close</title>
                        <path d="M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.93a1 1 0 01-1.414 0l-.707-.707a1 1 0 010-1.414l2.93-2.93-2.93-2.93a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0l2.93 2.93 2.93-2.93a1 1 0 011.414 0l.707.707a1 1 0 010 1.414l-2.93 2.93 2.93 2.93a1 1 0 010 1.414l-.707.707z" />
                    </svg>
                </span>
            </div>
        );
    };
    const FormBody = () => {
        if (notWorkingProviders === null || blockedProivders === null)
            return null;
        return (
            <div className="flex flex-col w-full gap-4">
                <div>
                    {Object.keys(providers).map((provider) => {
                        const notWorking = notWorkingProviders.find((p) => {
                            return p.provider === provider;
                        });
                        return (
                            <div
                                key={provider}
                                className={clsx(
                                    'flex flex-row justify-between items-center p-4 border-b',
                                    {
                                        'bg-red-200': notWorking,
                                    },
                                )}
                            >
                                <div className="flex flex-col justify-center items-start">
                                    <div className="text-xl font-semibold flex flex-row items-center gap-4">
                                        {provider}
                                        {notWorking && (
                                            <span className="text-red-800 text-sm">
                                                This provider has not been
                                                working for you for{' '}
                                                <b className="font-extrabold">
                                                    {notWorking.times}
                                                </b>{' '}
                                                times, consider unselecting it.
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-center items-center">
                                    <div className="flex flex-col justify-center items-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                !blockedProivders.includes(
                                                    provider,
                                                )
                                            }
                                            onChange={() => {
                                                if (
                                                    blockedProivders.includes(
                                                        provider,
                                                    )
                                                ) {
                                                    setBlockedProviders(
                                                        blockedProivders.filter(
                                                            (blockedProvider) =>
                                                                blockedProvider !==
                                                                provider,
                                                        ),
                                                    );
                                                } else {
                                                    setBlockedProviders([
                                                        ...blockedProivders,
                                                        provider,
                                                    ]);
                                                }
                                            }}
                                            name="provider"
                                            value={provider}
                                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
                >
                    Save
                </button>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center text-gray-700 bg-gray-200">
            <h2 className="text-4xl font-bold">Options</h2>
            <form
                className="shadow-md m-auto w-3/4 bg-white"
                onSubmit={handleSubmit}
            >
                <div className="p-4">
                    <h2 className="text-2xl text-center font-bold">
                        Allowed CDNs
                    </h2>
                    <div className="text-gray-500 text-sm">
                        <p>
                            Allowed CDNs won&apos;t be rerouted even if
                            they&apos;re blocked or don&apos;t work for you
                        </p>
                        <p>
                            You&apos;ll have to deselect undesired providers
                            manually
                        </p>
                        <div className="flex flex-col gap-4">
                            <FormBody />
                            <SuccessMessage />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Options;
