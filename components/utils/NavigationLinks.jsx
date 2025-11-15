'use client';

import PokemonSearch from 'components/Pokedex/PokemonSearch';
import Link from 'next/link';
import { trackButtonClick } from 'utils/trackingUtils';

/**
 * NavigationLinks Component
 *
 * Reusable navigation links component for mobile modals.
 * Displays Home and Pokedex navigation links with tracking.
 */
export default function NavigationLinks() {
    return (
        <div className="flex flex-col gap-5 justify-center items-center py-20 text-md">
            <Link href="/" onClick={() => trackButtonClick('Home Link', '/', 'Pokedex')} className="no-underline">
                <div className="text-white font-bold">Home</div>
            </Link>
            <Link
                href="/pokedex"
                onClick={() => trackButtonClick('Pokedex Link', '/pokedex', 'Pokedex')}
                className="no-underline"
            >
                <div className="text-white font-bold">Pokedex</div>
            </Link>

            <PokemonSearch />
        </div>
    );
}
