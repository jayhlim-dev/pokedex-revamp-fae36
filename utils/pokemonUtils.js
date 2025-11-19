/**
 * Pokemon utility functions for data processing and formatting
 */
import { trackError } from './trackingUtils';

/**
 * Fetch with configurable timeout
 *
 * NOTE: Previous timeout was Next.js default (~30 seconds, not explicitly set)
 * Current timeout: 60 seconds (60000ms) - increased to handle slow network connections
 *
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeoutMs - Timeout in milliseconds (default: 30000 = 30 seconds)
 * @returns {Promise<Response>} Fetch response
 */
const fetchWithTimeout = async (url, options = {}, timeoutMs = 30000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeoutMs}ms`);
        }
        throw error;
    }
};

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
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

        // Fetch Pokemon data with increased timeout
        // Previous: Next.js default timeout (~30 seconds, not explicitly set)
        // Current: 60 seconds (60000ms) - increased to handle slow network connections
        let pokemonResponse;
        try {
            pokemonResponse = await fetchWithTimeout(
                pokemonUrl,
                {
                    next: { revalidate: 4320000 } // Revalidate every 50 days
                },
                60000 // 60 second timeout (was ~30 seconds default before)
            );
        } catch (fetchError) {
            // Handle network errors (DNS, connection, timeout, etc.)
            console.error('❌ Network error fetching pokemon:', {
                pokemonName,
                url: pokemonUrl,
                error: fetchError.message || fetchError,
                errorType: fetchError.name || 'NetworkError'
            });

            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'pokemon_fetch_network',
                    pokemonName,
                    errorMessage: fetchError.message || String(fetchError),
                    url: pokemonUrl,
                    additionalData: {
                        error_type_name: fetchError.name || 'NetworkError'
                    }
                });
            }

            return null;
        }

        if (!pokemonResponse.ok) {
            console.warn('⚠️ Failed to fetch pokemon:', {
                pokemonName,
                status: pokemonResponse.status,
                statusText: pokemonResponse.statusText
            });

            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'pokemon_fetch',
                    pokemonName,
                    statusCode: pokemonResponse.status,
                    statusText: pokemonResponse.statusText,
                    url: pokemonUrl
                });
            }

            return null;
        }

        let pokemon;
        try {
            pokemon = await pokemonResponse.json();
        } catch (jsonError) {
            console.error('❌ Error parsing pokemon JSON:', {
                pokemonName,
                error: jsonError.message || jsonError
            });

            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'pokemon_json_parse',
                    pokemonName,
                    errorMessage: jsonError.message || String(jsonError),
                    url: pokemonUrl
                });
            }

            return null;
        }

        // Get the species URL from the Pokemon data (handles special forms correctly)
        // For special forms like "pikachu-rock-star", the species URL points to the base species
        const speciesUrl =
            pokemon.species?.url || `https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`;

        // Fetch species data using the URL from Pokemon data with increased timeout
        // Previous: Next.js default timeout (~30 seconds, not explicitly set)
        // Current: 60 seconds (60000ms) - increased to handle slow network connections
        let speciesResponse;
        try {
            speciesResponse = await fetchWithTimeout(
                speciesUrl,
                {
                    next: { revalidate: 4320000 }
                },
                60000 // 60 second timeout (was ~30 seconds default before)
            );
        } catch (fetchError) {
            // Handle network errors for species fetch
            console.error('❌ Network error fetching pokemon species:', {
                pokemonName,
                speciesUrl,
                error: fetchError.message || fetchError,
                errorType: fetchError.name || 'NetworkError'
            });

            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'species_fetch_network',
                    pokemonName,
                    errorMessage: fetchError.message || String(fetchError),
                    url: speciesUrl,
                    additionalData: {
                        error_type_name: fetchError.name || 'NetworkError'
                    }
                });
            }

            return null;
        }

        if (!speciesResponse.ok) {
            console.warn('⚠️ Failed to fetch pokemon species:', {
                pokemonName,
                speciesUrl,
                status: speciesResponse.status,
                statusText: speciesResponse.statusText
            });

            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'species_fetch',
                    pokemonName,
                    statusCode: speciesResponse.status,
                    statusText: speciesResponse.statusText,
                    url: speciesUrl
                });
            }

            return null;
        }

        let species;
        try {
            species = await speciesResponse.json();
        } catch (jsonError) {
            console.error('❌ Error parsing species JSON:', {
                pokemonName,
                error: jsonError.message || jsonError
            });

            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'species_json_parse',
                    pokemonName,
                    errorMessage: jsonError.message || String(jsonError),
                    url: speciesUrl
                });
            }

            return null;
        }

        return { pokemon, species };
    } catch (error) {
        // Catch any other unexpected errors
        console.error('❌ Unexpected error fetching pokemon:', {
            pokemonName,
            error: error.message || error,
            stack: error.stack
        });

        // Track error (client-side only)
        if (typeof window !== 'undefined') {
            trackError({
                errorType: 'pokemon_fetch_unexpected',
                pokemonName,
                errorMessage: error.message || String(error),
                additionalData: {
                    has_stack: !!error.stack
                }
            });
        }

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
        // Fetch evolution chain data with increased timeout
        // Previous: Next.js default timeout (~30 seconds, not explicitly set)
        // Current: 60 seconds (60000ms) - increased to handle slow network connections
        let response;
        try {
            response = await fetchWithTimeout(
                evolutionChainUrl,
                {
                    next: { revalidate: 4320000 } // Revalidate every 50 days
                },
                60000 // 60 second timeout (was ~30 seconds default before)
            );
        } catch (fetchError) {
            // Handle network errors
            console.error('❌ Network error fetching evolution chain:', {
                url: evolutionChainUrl,
                error: fetchError.message || fetchError,
                errorType: fetchError.name || 'NetworkError'
            });

            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'evolution_chain_fetch_network',
                    errorMessage: fetchError.message || String(fetchError),
                    url: evolutionChainUrl,
                    additionalData: {
                        error_type_name: fetchError.name || 'NetworkError'
                    }
                });
            }

            return null;
        }

        if (!response.ok) {
            console.warn('⚠️ Failed to fetch evolution chain:', {
                url: evolutionChainUrl,
                status: response.status,
                statusText: response.statusText
            });

            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'evolution_chain_fetch',
                    statusCode: response.status,
                    statusText: response.statusText,
                    url: evolutionChainUrl
                });
            }

            return null;
        }

        try {
            return await response.json();
        } catch (jsonError) {
            console.error('❌ Error parsing evolution chain JSON:', {
                url: evolutionChainUrl,
                error: jsonError.message || jsonError
            });

            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'evolution_chain_json_parse',
                    errorMessage: jsonError.message || String(jsonError),
                    url: evolutionChainUrl
                });
            }

            return null;
        }
    } catch (error) {
        // Catch any other unexpected errors
        console.error('❌ Unexpected error fetching evolution chain:', {
            url: evolutionChainUrl,
            error: error.message || error,
            stack: error.stack
        });

        // Track error (client-side only)
        if (typeof window !== 'undefined') {
            trackError({
                errorType: 'evolution_chain_fetch_unexpected',
                errorMessage: error.message || String(error),
                url: evolutionChainUrl,
                additionalData: {
                    has_stack: !!error.stack
                }
            });
        }

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
