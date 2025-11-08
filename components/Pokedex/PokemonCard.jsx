import Link from 'next/link';
import { getPokemonTypeColor } from 'constants/pokemonTypes';
import PokemonCardWrapper from './PokemonCardWrapper';
import CheckDevice from 'components/utils/CheckDevice';
import clsx from 'clsx';

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

/**
 * Individual Pokemon Card Component
 * Displays a single Pokemon with:
 * - Official artwork sprite
 * - Entry number and name
 * - Type badges with color coding
 * - Height and weight
 * - Background gradient based on primary type color
 */
export default function PokemonCard({ entry }) {
    const pokemonType = entry.types?.[0]?.type?.name || 'normal';
    const pokemonCardColor = getPokemonTypeColor(pokemonType);
    const pokemonName = entry.pokemon_species.name;
    const pokemonNumber = entry.entry_number;

    const userDevice = CheckDevice();

    // Convert height from decimeters to meters and weight from hectograms to kg
    const heightInMeters = entry.height ? (entry.height / 10).toFixed(1) : '?';
    const weightInKg = entry.weight ? (entry.weight / 10).toFixed(1) : '?';

    // Get first 2 abilities
    // const abilities = entry.abilities ? entry.abilities.slice(0, 2) : [];

    // Convert hex color to RGB for gradient background
    const rgbColor = hexToRgb(pokemonCardColor);
    const isMobile = userDevice && userDevice.includes('mobile');

    const renderWithDivider = ({ heightInMeters, weightInKg }) => {
        if (isMobile) {
            return (
                <>
                    <div className="w-full h-[1px] bg-white/30"></div>

                    <div
                        className={clsx('flex w-full flex-col justify-center text-white/90 text-xs gap-1 items-center')}
                    >
                        <div className="flex items-center gap-2">
                            <span className={'text-white text-3xs'}>Height:</span>
                            <span className={clsx(' text-3xs')}>{heightInMeters} m</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={'text-white text-3xs'}>Weight:</span>
                            <span className={clsx(' text-3xs')}>{weightInKg} kg</span>
                        </div>
                    </div>
                </>
            );
        }
        return (
            <div
                className={clsx(
                    'flex w-full justify-center text-white/90 text-xs',
                    userDevice === 'desktop' ? 'gap-4' : 'gap-2 !justify-between'
                )}
            >
                <div
                    className="flex flex-col items-center gap-2"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                >
                    <span className={'text-white text-3xs'}>Height</span>
                    <span className={clsx('font-semibold', userDevice === 'desktop' ? '' : 'text-2xs')}>
                        {heightInMeters} m
                    </span>
                </div>
                <div className="w-px bg-white/30"></div>
                <div
                    className="flex flex-col items-center gap-2"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                >
                    <span className={'text-white text-3xs'}>Weight</span>
                    <span className={clsx('font-semibold', userDevice === 'desktop' ? 'text-2xs' : 'text-2xs')}>
                        {weightInKg} kg
                    </span>
                </div>
            </div>
        );
    };

    return (
        <PokemonCardWrapper href={`/pokemon/${pokemonName}`}>
            <div
                className={clsx(
                    'w-full flex flex-col items-center hover:border-white/60 transition-all shadow-md shadow-black/40 duration-300 hover:scale-105 cursor-pointer no-underline relative backdrop-blur-2xs overflow-hidden',
                    userDevice === 'desktop'
                        ? 'max-h-[332px] rounded-3xl !min-w-80 !max-w-80 !pt-10 p-4 gap-3'
                        : 'rounded-xl !pt-13 p-4 pb-6 gap-4 backdrop-blur-3xs'
                )}
                style={{
                    background: isMobile
                        ? `radial-gradient(ellipse at top, rgba(${rgbColor}, 0.3) 0%, transparent 50%), linear-gradient(180deg, rgba(255, 255, 255, 0) 40%, rgba(${rgbColor}, 1) 200%)`
                        : `radial-gradient(ellipse at top, rgba(${rgbColor}, 0.3) 0%, transparent 50%), linear-gradient(180deg, rgba(255, 255, 255, 0) 40%, rgba(${rgbColor}, 1) 120%)`
                }}
            >
                {/* Pokemon Number */}
                <div
                    className={clsx(
                        'text-[#FDEBB6] font-bold absolute rounded-r-md rounded-l-sm items-center justify-center flex text-center shadow-md shadow-black/40 left-[-5px] text-2xs top-4',
                        userDevice === 'desktop' ? 'pt-2 pb-[4.5px] px-8' : 'pt-1 !text-3xs pb-[2.5px] px-8'
                    )}
                    style={{ backgroundColor: `#${pokemonCardColor}` }}
                >
                    #{pokemonNumber.toString().padStart(3, '0')}
                </div>

                {/* Pokemon Sprite */}
                <img
                    src={
                        entry?.sprites?.other?.['official-artwork']?.front_default ||
                        entry?.sprites?.front_default ||
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                            entry?.entry_number || 1
                        }.png`
                    }
                    alt={pokemonName}
                    className={clsx(
                        'w-40 h-40 object-contain ',
                        userDevice === 'desktop' ? '!w-40 !h-40 !min-w-40 !min-h-40' : '!w-30 !h-30 !min-w-30 !min-h-30'
                    )}
                    loading="lazy"
                    onError={(e) => {
                        // Try the Pokemon's own sprite URL as fallback
                        const pokemonId = entry?.entry_number || 1;
                        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                    }}
                />

                {/* Pokemon Name */}
                <div
                    className={clsx(
                        ' text-white capitalize text-center font-semibold !no-underline',
                        userDevice === 'desktop' ? 'text-sm' : 'text-xs'
                    )}
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                >
                    {pokemonName.replace(/-/g, ' ')}
                </div>

                {/* Type Badges */}
                {entry.types && (
                    <div className="flex w-full justify-center gap-2 items-center">
                        {entry.types.map((typeInfo) => (
                            <span
                                key={typeInfo.type.name}
                                className={clsx(
                                    'px-2 py-1 rounded-full text-white font-medium capitalize shadow-md shadow-black/40 flex text-3xs'
                                )}
                                style={{
                                    backgroundColor: `#${getPokemonTypeColor(typeInfo.type.name)}`
                                }}
                            >
                                {typeInfo.type.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Height and Weight */}
                {renderWithDivider({ heightInMeters, weightInKg })}

                {/* Abilities */}
                {/* {abilities.length > 0 && (
                <div className="flex gap-1 w-full items-center justify-center">
                    <span
                        className="text-white text-[10px] text-center"
                        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                    >
                        Abilities
                    </span>
                    <div className="flex gap-2 justify-center flex-wrap">
                        {abilities.map((ability, index) => (
                            <span
                                key={index}
                                className="text-[10px] px-2 py-1
                                rounded text-white/90 capitalize"
                                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                            >
                                {ability.ability.name.replace(/-/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            )} */}
            </div>
        </PokemonCardWrapper>
    );
}
