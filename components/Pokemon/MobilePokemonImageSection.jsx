import Image from 'next/image';

/**
 * PokemonImageSection component displays the main Pokemon artwork
 * @param {Object} pokemon - Pokemon data containing sprites
 */
export default function MobilePokemonImageSection({ pokemon }) {
    return (
        <div className="relative w-full aspect-square rounded-3xl backdrop-blur-2xs shadow-xl shadow-black/4 p-6 ">
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
