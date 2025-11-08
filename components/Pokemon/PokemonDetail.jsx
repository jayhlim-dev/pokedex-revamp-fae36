'use client';

import Header from 'components/header';
import PokemonImageSection from 'components/Pokemon/PokemonImageSection';
import PokemonInfoSection from 'components/Pokemon/PokemonInfoSection';
import PokemonDetailsPanel from 'components/Pokemon/PokemonDetailsPanel';
import EvolutionChain from 'components/Pokemon/EvolutionChain';
import RandomPokemon from 'components/Pokemon/RandomPokemon';
import PokemonDetailTracker from 'components/Pokemon/PokemonDetailTracker';

export default function PokemonDetail({ pokemon, species, flavorText, evolutions, pokemonName, evolutionChainLength }) {
    return (
        <div className="min-h-screen flex flex-col bg-[url('/images/pokemon-detail/pokemon-detail-bg.png')] bg-repeat-round bg-cover z-10 px-8 gap-6 2xl:px-[18vw]">
            {/* Client-side tracker for analytics */}
            <PokemonDetailTracker pokemonName={pokemonName} evolutionChainLength={evolutionChainLength} />

            <Header />

            <div className="w-full flex flex-col items-center ">
                <div className="w-full justify-center items-center px-20 2xl:px-[1vw]">
                    <div className="grid grid-cols-2 gap-12" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
                        <PokemonImageSection pokemon={pokemon} />
                        <PokemonInfoSection pokemon={pokemon} species={species} flavorText={flavorText} />
                    </div>
                </div>
            </div>

            <div className="relative w-full aspect-square rounded-3xl backdrop-blur-2xs shadow-md shadow-black/40 grid grid-cols-3 gap-12 max-h-[25vh] h-fit px-[1.5vw] py-[1vw]">
                <PokemonDetailsPanel pokemon={pokemon} species={species} />
                <div className="col-span-1 ">
                    <EvolutionChain evolutions={evolutions} currentPokemonName={pokemon.name} />
                </div>
                <div className="col-span-1 h-fit">
                    <RandomPokemon currentPokemon={pokemon} />
                </div>
            </div>
        </div>
    );
}
