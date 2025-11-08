import { fetchPokemonWithCache } from './pokemonCache';

/**
 * Fetch a batch of Pokemon details with caching
 * @param {Array} entries - Pokemon entries to fetch
 * @param {number} startIndex - Starting index in the array
 * @param {number} batchSize - Number of Pokemon to fetch
 * @returns {Object} { pokemonWithDetails, cacheHits, cacheMisses }
 */
export async function fetchPokemonBatch(entries, startIndex, batchSize) {
    const batch = entries.slice(startIndex, startIndex + batchSize);
    let cacheHits = 0;
    let cacheMisses = 0;

    const pokemonWithDetails = await Promise.all(
        batch.map(async (entry) => {
            const pokemonName = entry.pokemon_species.name;

            // Fetch with cache
            const { data, fromCache, error } = await fetchPokemonWithCache(pokemonName);

            // Track cache statistics
            if (fromCache) {
                cacheHits++;
            } else if (!error) {
                cacheMisses++;
            }

            // Return entry with additional data if available
            if (data) {
                return {
                    ...entry,
                    types: data.types,
                    sprites: data.sprites,
                    height: data.height,
                    weight: data.weight,
                    abilities: data.abilities
                };
            }

            // Return original entry if fetch failed
            return entry;
        })
    );

    return { pokemonWithDetails, cacheHits, cacheMisses };
}
