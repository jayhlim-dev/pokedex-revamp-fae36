'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trackSectionView, trackEvent } from 'utils/trackingUtils';
import CheckDevice from './utils/CheckDevice';
import clsx from 'clsx';

export function useRouteHistory() {
    const [referrer, setReferrer] = useState('/pokedex');
    const [isLoading, setIsLoading] = useState(true);
    const userDevice = CheckDevice();
    const isMobile = userDevice && userDevice.includes('mobile');
    useEffect(() => {
        // Check if we're in the browser environment
        if (typeof window !== 'undefined') {
            // First, try to get the referrer from sessionStorage (more reliable)
            const storedReferrer = sessionStorage.getItem('pokemonReferrer');

            if (storedReferrer) {
                console.log('🚀 Found stored referrer:', storedReferrer);
                setReferrer(storedReferrer);
                setIsLoading(false);
                return;
            }

            // Fallback to document.referrer
            const documentReferrer = document.referrer;
            console.log('🚀 Document referrer:', documentReferrer);

            if (documentReferrer) {
                try {
                    const referrerUrl = new URL(documentReferrer);
                    const referrerPath = referrerUrl.pathname;
                    console.log('🚀 Referrer path:', referrerPath);

                    // Check if it came from a pokedex location (e.g., /pokedex/kanto, /pokedex/national, etc.)
                    if (referrerPath.startsWith('/pokedex/') && referrerPath !== '/pokedex') {
                        setReferrer(referrerPath);
                    } else if (referrerPath === '/pokedex') {
                        setReferrer('/pokedex');
                    } else {
                        setReferrer('/pokedex');
                    }
                } catch (error) {
                    console.error('Error parsing referrer URL:', error);
                    setReferrer('/pokedex');
                }
            } else {
                // No referrer, default to pokedex
                setReferrer('/pokedex');
            }

            setIsLoading(false);
        }
    }, []);

    return { referrer, isLoading, isMobile };
}

export function BackButton() {
    const { referrer, isLoading, isMobile } = useRouteHistory();
    console.log(' 🚀 ༼;´༎ຶ ۝ ༎ຶ༽ ~  (ノ ° 益 °) ノ ~ (っ◔◡◔)っ ~   ~ referrer:', referrer);

    if (isLoading) {
        return (
            <div className="self-start mb-6 px-6 py-3 bg-black/40 backdrop-blur-sm rounded-lg border-2 border-white/30 text-white">
                Loading...
            </div>
        );
    }

    const buttonText =
        referrer === '/pokedex'
            ? '← Back to Pokédex'
            : `← Back to ${referrer.split('/')[2]?.replace(/-/g, ' ')} Pokédex`;

    return (
        <Link
            href={referrer}
            className="self-start mb-6 px-6 py-3 bg-black/40 backdrop-blur-sm rounded-lg border-2 border-white/30 hover:border-white/60 transition-all text-white hover:scale-105"
        >
            {buttonText}
        </Link>
    );
}

export default function RouteHistoryRedirect({ pokemonName }) {
    const { referrer, isLoading, isMobile } = useRouteHistory();

    useEffect(() => {
        if (!isLoading && pokemonName) {
            // Track page not found event
            trackSectionView('Pokemon Not Found', null, {
                pokemon_name: pokemonName,
                referrer: referrer
            });

            // Also track as a custom event for better analytics
            trackEvent('pokemon_not_found', {
                eventCategory: 'navigation',
                eventLabel: pokemonName,
                customData: {
                    pokemon_name: pokemonName,
                    referrer: referrer
                }
            });
        }
    }, [isLoading, pokemonName, referrer]);

    if (isLoading) {
        return (
            <div
                className={clsx(
                    "min-h-screen flex flex-col bg-[url('/images/pokedex-page/pokedex-bg.png')] bg-repeat-round bg-cover z-10",
                    isMobile ? '!bg-[url("/images/pokedex-page/mobile-pokedex-bg.png")]' : ''
                )}
            >
                <div className="w-full flex flex-col items-center justify-center h-screen gap-4">
                    <p className="text-white text-xl">Loading...</p>
                </div>
            </div>
        );
    }

    const linkText =
        referrer === '/pokedex' ? 'Back to Pokédex' : `Back to ${referrer.split('/')[2]?.replace(/-/g, ' ')} Pokédex`;

    return (
        <div
            className={clsx(
                "min-h-screen flex flex-col bg-[url('/images/pokedex-page/pokedex-bg.png')] bg-repeat-round bg-cover z-10",
                isMobile ? '!bg-[url("/images/pokedex-page/mobile-pokedex-bg.png")]' : ''
            )}
        >
            <div className="w-full flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-white text-xl">Pokémon not found</p>
                <Link
                    href={referrer}
                    className={clsx('text-primary underline', isMobile ? 'text-2xs text-center' : 'text-xl')}
                >
                    {linkText}
                </Link>
            </div>
        </div>
    );
}
