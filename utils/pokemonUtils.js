/**
 * Pokemon utility functions for data processing and formatting
 */

/**
 * Get English flavor text, prioritizing HeartGold version
 * @param {Array} entries - Array of flavor text entries
 * @returns {string} Formatted flavor text
 */
export const getFlavorText = (entries) => {
    const heartgold = entries.find((e) => e.language.name === 'en' && e.version.name === 'heartgold');
    const english = entries.find((e) => e.language.name === 'en');
    return (heartgold || english)?.flavor_text.replace(/\f/g, ' ') || 'No description available.';
};

/**
 * Get stat color for Pokemon stats display
 * @param {string} statName - Name of the stat
 * @returns {string} Hex color code
 */
export const getStatColor = (statName) => {
    switch (statName) {
        case 'hp':
            return '#62FF7F';
        case 'attack':
            return '#FF6262';
        case 'defense':
            return '#D9D9D9';
        case 'speed':
            return '#62E7FF';
        default:
            return '#62E7FF';
    }
};

/**
 * Fetch Pokemon data from PokeAPI
 * @param {string} pokemonName - Name of the Pokemon
 * @returns {Object|null} Pokemon and species data or null if failed
 */
export const getPokemonData = async (pokemonName) => {
    try {
        const [pokemonRes, speciesRes] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`, {
                next: { revalidate: 4320000 } // Revalidate every 50 days
            }),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`, {
                next: { revalidate: 4320000 }
            })
        ]);

        if (!pokemonRes.ok || !speciesRes.ok) {
            throw new Error('Failed to fetch pokemon data');
        }

        const pokemon = await pokemonRes.json();
        const species = await speciesRes.json();

        return { pokemon, species };
    } catch (error) {
        console.error('❌ Error fetching pokemon:', error);
        return null;
    }
};

/**
 * Fetch evolution chain data from PokeAPI
 * @param {string} evolutionChainUrl - URL of the evolution chain
 * @returns {Object|null} Evolution chain data or null if failed
 */
export const getEvolutionChain = async (evolutionChainUrl) => {
    try {
        const response = await fetch(evolutionChainUrl, {
            next: { revalidate: 4320000 } // Revalidate every 50 days
        });

        if (!response.ok) {
            throw new Error('Failed to fetch evolution chain');
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Error fetching evolution chain:', error);
        return null;
    }
};

/**
 * Process evolution chain data to get Pokemon details
 * @param {Object} evolutionChain - Raw evolution chain data
 * @returns {Array} Array of Pokemon evolution data
 */
export const processEvolutionChain = async (evolutionChain) => {
    if (!evolutionChain) return [];

    const evolutions = [];

    // Helper function to recursively process evolution chain
    const processChain = async (chain) => {
        if (!chain) return;

        // Fetch Pokemon data for current evolution
        const pokemonData = await getPokemonData(chain.species.name);
        if (pokemonData) {
            evolutions.push({
                name: chain.species.name,
                pokemon: pokemonData.pokemon,
                evolutionDetails: chain.evolution_details || []
            });
        }

        // Process evolved_to chains
        if (chain.evolves_to && chain.evolves_to.length > 0) {
            for (const evolution of chain.evolves_to) {
                await processChain(evolution);
            }
        }
    };

    await processChain(evolutionChain.chain);
    return evolutions;
};
