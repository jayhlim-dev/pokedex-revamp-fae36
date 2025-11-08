import Image from 'next/image';

/**
 * PokemonImageSection component displays the main Pokemon artwork
 * @param {Object} pokemon - Pokemon data containing sprites
 */
export default function PokemonImageSection({ pokemon }) {
    return (
        <div className="relative w-full aspect-square rounded-3xl backdrop-blur-2xs shadow-md shadow-black/40 p-6 min-w-[500px]  min-h-[500px] max-h-[500px]">
            <div className="relative w-full h-full">
                <Image
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </div>
        </div>
    );
}
