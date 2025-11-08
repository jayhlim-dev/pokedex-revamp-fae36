import PokemonDetailsPanel from 'components/Pokemon/PokemonDetailsPanel';
import EvolutionChain from 'components/Pokemon/EvolutionChain';
import RandomPokemon from 'components/Pokemon/RandomPokemon';
import clsx from 'clsx';
import CheckDevice from 'components/utils/CheckDevice';

/**
 * MobilePokemonBottomSection Component
 * Displays the bottom section with details panel, evolution chain, and random pokemon
 */
export default function PokemonBottomSection({ pokemon, species, evolutions, from='info-section', device }) {
    const isMobile = device && device.includes('mobile');
    
    return (
        <div className={clsx("relative w-full ", isMobile ? '!h-fit flex flex-col gap-6' : 'aspect-square rounded-3xl backdrop-blur-2xs shadow-md shadow-black/40 grid grid-cols-3 gap-12 h-fit py-[1vw] max-h-[25vh] 2xl:px-[1.5vw] ')}>
            {
                ((isMobile && from === 'info-section') || !isMobile) && (
                    <>
                        <PokemonDetailsPanel pokemon={pokemon} species={species} />
    
                        {isMobile && from === 'info-section' && (
                            <div className={clsx(`shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30 h-[4px]`)}></div>
                        )}
    
                        <div className={clsx("col-span-1 ", isMobile ? '!h-fit' : '')}>
                            <EvolutionChain evolutions={evolutions} currentPokemonName={pokemon.name} />
                        </div>
                    </>
                )
            }

            {
                ((isMobile && from === 'pokemon-detail') || !isMobile) && (
                    <div className="col-span-1 h-fit">
                        <RandomPokemon currentPokemon={pokemon} device={device} />
                    </div>
                )
            }
        </div>
    );
}

