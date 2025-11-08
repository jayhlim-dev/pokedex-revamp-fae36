'use client';

import PokemonLoadingScreen from 'components/Pokemon/PokemonLoadingScreen';
import CheckDevice from 'components/utils/CheckDevice';
import PokemonDetail from 'components/Pokemon/PokemonDetail';
import MobilePokemonDetail from 'components/Pokemon/MobilePokemonDetail';

export default function ClientPokemon({ 
    pokemon, 
    species, 
    flavorText, 
    evolutions, 
    pokemonName, 
    evolutionChainLength 
}) {
    const userDevice = CheckDevice();
    const isMobile = userDevice && userDevice.includes('mobile');
    if (!userDevice) {
        return <PokemonLoadingScreen />;
    }

    if (isMobile) {
        return (
          <MobilePokemonDetail pokemon={pokemon} species={species} flavorText={flavorText} evolutions={evolutions} pokemonName={pokemonName} evolutionChainLength={evolutionChainLength} device={userDevice}/>
        );
    }

    return (
       <PokemonDetail pokemon={pokemon} species={species} flavorText={flavorText} evolutions={evolutions} pokemonName={pokemonName} evolutionChainLength={evolutionChainLength} />
    );
}

