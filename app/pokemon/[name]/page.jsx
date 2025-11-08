import RouteHistoryRedirect from 'components/RouteHistoryRedirect';
import { getFlavorText, getPokemonData, getEvolutionChain, processEvolutionChain } from 'utils/pokemonUtils';
import ClientPokemon from './ClientPokemon';

export default async function PokemonPage({ params }) {
    const resolvedParams = await params;
    const { name: pokemonName } = resolvedParams || {};
    
    if (!pokemonName) {
        return <RouteHistoryRedirect pokemonName="" />;
    }
    
    const data = await getPokemonData(pokemonName);
    

    if (!data) {
        return <RouteHistoryRedirect pokemonName={pokemonName} />;
    }

    const { pokemon, species } = data;
    const { evolution_chain } = species;

    // Fetch evolution chain data
    let evolutions = [];
    if (evolution_chain?.url) {
        const evolutionChainData = await getEvolutionChain(evolution_chain.url);
        if (evolutionChainData) {
            evolutions = await processEvolutionChain(evolutionChainData);
        }
    }

    const flavorText = getFlavorText(species.flavor_text_entries);
    const evolutionChainLength = Array.isArray(evolutions) ? evolutions.length : 0;

    return (
        <ClientPokemon 
            pokemon={pokemon}
            species={species}
            flavorText={flavorText}
            evolutions={evolutions}
            pokemonName={pokemonName}
            evolutionChainLength={evolutionChainLength}
        />
    );
}
