import PokemonDetailsPanel from 'components/Pokemon/PokemonDetailsPanel';
import EvolutionChain from 'components/Pokemon/EvolutionChain';
import RandomPokemon from 'components/Pokemon/RandomPokemon';

/**
 * MobilePokemonBottomSection Component
 * Displays the bottom section with details panel, evolution chain, and random pokemon
 */
export default function MobilePokemonBottomSection({ pokemon, species, evolutions }) {
    return (
        <div className="relative w-ful flex flex-col gap-6 h-fit">
            <PokemonDetailsPanel pokemon={pokemon} species={species} />
            <div className="col-span-1 ">
                <EvolutionChain evolutions={evolutions} currentPokemonName={pokemon.name} />
            </div>
            {/* <div className="col-span-1 h-fit">
                <RandomPokemon currentPokemon={pokemon} />
            </div> */}
        </div>
    );
}

