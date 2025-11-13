import { useState } from 'react';

/**
 * PokemonImageSection component displays the main Pokemon artwork
 * @param {Object} pokemon - Pokemon data containing sprites
 *
 * Uses regular <img> tag instead of Next.js Image to completely bypass
 * Next.js image optimization API which times out with external GitHub CDN images
 */
export default function MobilePokemonImageSection({ pokemon }) {
    const [imgSrc, setImgSrc] = useState(
        pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
    );
    const [errorCount, setErrorCount] = useState(0);

    // Fallback chain: official-artwork -> front_default -> fallback sprite
    const handleError = () => {
        if (errorCount === 0) {
            // Try front_default if official-artwork failed
            if (imgSrc === pokemon.sprites.other['official-artwork']?.front_default && pokemon.sprites.front_default) {
                setImgSrc(pokemon.sprites.front_default);
                setErrorCount(1);
            } else {
                // Final fallback to numbered sprite
                const pokemonId = pokemon.id || pokemon.entry_number || 1;
                setImgSrc(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`);
                setErrorCount(2);
            }
        }
    };

    return (
        <div className="relative w-full aspect-square rounded-3xl backdrop-blur-2xs shadow-xl shadow-black/4 p-6 ">
            <div className="relative w-full h-full">
                {/* Use regular img tag to completely bypass Next.js image optimization API */}
                {/* This prevents timeout errors when loading from external GitHub CDN */}
                <img
                    src={imgSrc}
                    alt={pokemon.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    onError={handleError}
                    loading="eager"
                />
            </div>
        </div>
    );
}
