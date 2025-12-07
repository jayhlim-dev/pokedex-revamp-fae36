import RouteHistoryRedirect from 'components/RouteHistoryRedirect';
import { getFlavorText, getPokemonData, getEvolutionChain, processEvolutionChain } from 'utils/pokemonUtils';
import ClientPokemon from './ClientPokemon';

// Helper function to capitalize Pokemon name
const capitalizeName = (name) => {
    if (!name) return '';
    return name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Generate dynamic metadata for each Pokemon page
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { name: pokemonName } = resolvedParams || {};

    if (!pokemonName) {
        return {
            title: 'Pokemon Not Found | PokeEon',
            description: 'Pokemon not found on PokeEon'
        };
    }

    try {
        const data = await getPokemonData(pokemonName);

        if (!data) {
            return {
                title: `${capitalizeName(pokemonName)} | PokeEon`,
                description: `View ${capitalizeName(pokemonName)} details on PokeEon`
            };
        }

        const { pokemon, species } = data;
        const capitalizedName = capitalizeName(pokemon.name);
        const flavorText = getFlavorText(species.flavor_text_entries);

        // Get Pokemon image - prefer official artwork, fallback to front sprite
        const pokemonImage =
            pokemon.sprites?.other?.['official-artwork']?.front_default ||
            pokemon.sprites?.other?.home?.front_default ||
            pokemon.sprites?.front_default ||
            '/images/logo/main-gengar-char.png';

        // Get Pokemon types
        const types = pokemon.types?.map((t) => capitalizeName(t.type.name)).join(', ') || '';
        const typeInfo = types ? ` | ${types} type` : '';

        // Get Pokemon ID (Pokedex number)
        const pokedexNumber = pokemon.id ? `#${String(pokemon.id).padStart(3, '0')}` : '';

        // Create description
        const description = flavorText
            ? `${capitalizedName} ${pokedexNumber}${typeInfo}. ${flavorText.substring(0, 120)}${
                  flavorText.length > 120 ? '...' : ''
              }`
            : `View ${capitalizedName} ${pokedexNumber}${typeInfo} details, stats, types, and evolution chain on PokeEon.`;

        return {
            title: `${capitalizedName} ${pokedexNumber} | PokeEon`,
            description: description,
            keywords: [
                capitalizedName.toLowerCase(),
                'pokemon',
                'pokedex',
                pokemon.id ? `pokemon ${pokemon.id}` : '',
                ...(types ? types.split(', ').map((t) => t.toLowerCase()) : []),
                'pokemon stats',
                'pokemon types',
                'pokemon evolution'
            ].filter(Boolean),
            openGraph: {
                title: `${capitalizedName} ${pokedexNumber} | PokeEon`,
                description: description,
                type: 'website',
                images: [
                    {
                        url: pokemonImage,
                        width: 1200,
                        height: 1200,
                        alt: `${capitalizedName} ${pokedexNumber}`
                    }
                ],
                siteName: 'PokeEon'
            },
            twitter: {
                card: 'summary_large_image',
                title: `${capitalizedName} ${pokedexNumber} | PokeEon`,
                description: description,
                images: [pokemonImage]
            },
            alternates: {
                canonical: `/pokemon/${pokemonName}`
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: `${capitalizeName(pokemonName)} | PokeEon`,
            description: `View ${capitalizeName(pokemonName)} details on PokeEon`
        };
    }
}

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
