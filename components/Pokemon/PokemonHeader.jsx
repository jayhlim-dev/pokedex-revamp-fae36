'use client';

import { getPokemonTypeColor } from 'constants/pokemonTypes';
import { getWeaknesses } from 'utils/typeEffectiveness';
import PokemonCryButton from './PokemonCryButton';
import clsx from 'clsx';

/**
 * Pokemon Header Component
 * Displays Pokemon number, name, types, and weaknesses
 */
export default function PokemonHeader({ pokemon, device }) {
    const isMobile = device && device.includes('mobile');
    const pokemonName = pokemon.name.replace(/-/g, ' ');
    const maxLength = 14; // "pikachu rock s" length
    const shouldUseSmallText = isMobile && pokemonName.length > maxLength;

    return (
        <div className={clsx(`flex flex-col ${isMobile ? 'pl-4 w-full' : ''}`)}>
            <div className="text-3xs font-bold ">#{pokemon.id.toString().padStart(3, '0')}</div>
            <div className="flex items-center">
                <h1 className={clsx('font-bold uppercase', shouldUseSmallText ? 'text-base' : 'text-xl')}>
                    {pokemonName}
                </h1>
                <PokemonCryButton pokemon={pokemon} />
            </div>
            <div className={clsx('flex gap-2 mt-2', isMobile ? '!mt-4 justify-between w-full' : '')}>
                <div className={clsx('flex gap-2 items-center', isMobile ? '!gap-2  !text-3xs' : 'justify-center')}>
                    {pokemon.types.map((type) => (
                        <span
                            key={type.type.name}
                            className="text-3xs px-4 py-1 rounded-full text-white font-medium capitalize shadow-md shadow-black/40 min-h-[23px] leading-relaxed"
                            style={{
                                backgroundColor: `#${getPokemonTypeColor(type.type.name)}`
                            }}
                        >
                            {type.type.name}
                        </span>
                    ))}
                </div>
                <div className="font-bold flex items-center justify-center">/</div>
                <div
                    className={clsx(
                        'flex gap-2 items-center w-full px-4 overflow-x-scroll scrollbar-hide !text-3xs bg-black/50 py-2 rounded-l-full',
                        !isMobile ? '!bg-black/10' : ''
                    )}
                >
                    <div className="text-3xs font-bold">weaknesses</div>
                    {getWeaknesses(pokemon.types).map(([type, multiplier]) => (
                        <div key={type} className="flex items-center gap-1">
                            <span
                                className="text-3xs px-4 py-1 rounded-full text-white font-medium capitalize shadow-md shadow-black/40 min-h-[23px] leading-relaxed"
                                style={{
                                    backgroundColor: `#${getPokemonTypeColor(type)}`
                                }}
                            >
                                {type}
                            </span>
                            <span className="text-2xs text-red-400 font-bold">{multiplier === 4 ? '4x' : '2x'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
