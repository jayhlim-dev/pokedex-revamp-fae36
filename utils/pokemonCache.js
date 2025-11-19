// Pokemon data cache utility
// Provides two-tier caching: in-memory (Map) and localStorage
import { trackError } from './trackingUtils';

// In-memory cache for Pokemon data
const pokemonCache = new Map();

// Cache configuration
const CACHE_VERSION = 'v1';
const CACHE_EXPIRY_DAYS = 50;

/**
 * Get cache key for a Pokemon
 */
function getCacheKey(pokemonName) {
    return `pokemon_${CACHE_VERSION}_${pokemonName}`;
}

/**
 * Check if cache timestamp is expired
 */
function isCacheExpired(timestamp) {
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 50 days in milliseconds
    return Date.now() - timestamp > expiryTime;
}

/**
 * Validate that cached Pokemon data has at least one image URL
 * @param {Object} data - Pokemon data to validate
 * @returns {boolean} True if valid image URL exists
 */
function hasValidImage(data) {
    if (!data || !data.sprites) return false;
    const hasOfficialArtwork = data.sprites?.other?.['official-artwork']?.front_default;
    const hasRegularSprite = data.sprites?.front_default;
    return !!(hasOfficialArtwork || hasRegularSprite);
}

/**
 * Get Pokemon data from cache (checks memory first, then localStorage)
 */
export function getCachedPokemon(pokemonName) {
    // Check in-memory cache first (fastest)
    if (pokemonCache.has(pokemonName)) {
        const cachedData = pokemonCache.get(pokemonName);
        // Validate cached data has image URLs
        if (hasValidImage(cachedData)) {
            return cachedData;
        } else {
            // Remove invalid cache entry
            pokemonCache.delete(pokemonName);
            console.warn(`⚠️ Removed invalid cache entry for ${pokemonName}: No image URL`);
        }
    }

    // Check localStorage (persistent across sessions)
    try {
        const cacheKey = getCacheKey(pokemonName);
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            const { data, timestamp } = JSON.parse(cached);

            // Check if cache is still valid
            if (!isCacheExpired(timestamp)) {
                // Validate cached data has image URLs
                if (hasValidImage(data)) {
                    // Store in memory cache for faster access next time
                    pokemonCache.set(pokemonName, data);
                    return data;
                } else {
                    // Remove invalid cache entry
                    localStorage.removeItem(cacheKey);
                    console.warn(`⚠️ Removed invalid cache entry for ${pokemonName}: No image URL`);
                }
            } else {
                // Remove expired cache
                localStorage.removeItem(cacheKey);
            }
        }
    } catch (error) {
        console.error('Error reading from cache:', error);
    }

    return null;
}

/**
 * Save Pokemon data to cache (both memory and localStorage)
 */
export function cachePokemon(pokemonName, data) {
    // Save to memory cache
    pokemonCache.set(pokemonName, data);

    // Save to localStorage for persistence (with quota check)
    try {
        const cacheKey = getCacheKey(pokemonName);
        const cacheData = {
            data,
            timestamp: Date.now()
        };

        const dataToStore = JSON.stringify(cacheData);

        // Check if we're about to exceed quota
        if (dataToStore.length > 1024 * 1024) {
            // 1MB limit per item
            console.warn(
                `⚠️ Pokemon ${pokemonName} data too large (${Math.round(
                    dataToStore.length / 1024
                )}KB), skipping localStorage cache`
            );
            return;
        }

        localStorage.setItem(cacheKey, dataToStore);
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('⚠️ localStorage quota exceeded, clearing old cache and retrying...');
            // Clear old cache entries and retry
            clearOldCacheEntries();
            try {
                localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            } catch (retryError) {
                console.warn('⚠️ Still exceeding quota after cleanup, using memory cache only');
            }
        } else {
            console.error('Error saving to cache:', error);
        }
    }
}

/**
 * Clear old cache entries to free up space
 */
function clearOldCacheEntries() {
    try {
        const entries = [];

        // Collect all cache entries with their timestamps
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`pokemon_${CACHE_VERSION}_`)) {
                try {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        const { timestamp } = JSON.parse(cached);
                        entries.push({ key, timestamp });
                    }
                } catch (parseError) {
                    // Remove corrupted entries
                    localStorage.removeItem(key);
                }
            }
        }

        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a.timestamp - b.timestamp);

        // Remove oldest 50% of entries
        const entriesToRemove = Math.floor(entries.length / 2);
        for (let i = 0; i < entriesToRemove; i++) {
            localStorage.removeItem(entries[i].key);
        }

        console.log(`🗑️ Cleared ${entriesToRemove} old cache entries to free up space`);
    } catch (error) {
        console.error('Error clearing old cache entries:', error);
    }
}

/**
 * Clear all Pokemon cache (both memory and localStorage)
 */
export function clearPokemonCache() {
    // Clear memory cache
    pokemonCache.clear();

    // Clear localStorage
    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`pokemon_${CACHE_VERSION}_`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        console.log(`🗑️ Cleared ${keysToRemove.length} Pokemon from cache`);
        return keysToRemove.length;
    } catch (error) {
        console.error('Error clearing cache:', error);
        return 0;
    }
}

/**
 * Get count of cached Pokemon in localStorage
 */
export function getCachedPokemonCount() {
    try {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`pokemon_${CACHE_VERSION}_`)) {
                count++;
            }
        }
        return count;
    } catch (error) {
        console.error('Error checking cache:', error);
        return 0;
    }
}

/**
 * Get localStorage usage statistics
 */
export function getStorageStats() {
    try {
        let totalSize = 0;
        let pokemonCount = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`pokemon_${CACHE_VERSION}_`)) {
                const value = localStorage.getItem(key);
                totalSize += key.length + (value ? value.length : 0);
                pokemonCount++;
            }
        }

        return {
            count: pokemonCount,
            sizeKB: Math.round(totalSize / 1024),
            sizeMB: Math.round((totalSize / (1024 * 1024)) * 100) / 100
        };
    } catch (error) {
        console.error('Error getting storage stats:', error);
        return { count: 0, sizeKB: 0, sizeMB: 0 };
    }
}

/**
 * Fetch Pokemon data with caching
 */
export async function fetchPokemonWithCache(pokemonName) {
    // Check cache first
    const cachedData = getCachedPokemon(pokemonName);
    if (cachedData) {
        // console.log(`✅ Using cached data for ${pokemonName}`);
        return { data: cachedData, fromCache: true };
    }

    // Fetch from API if not in cache
    try {
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if (!pokemonRes.ok) {
            // console.error(`Failed to fetch ${pokemonName}: ${pokemonRes.status}`);

            // Track error
            trackError({
                errorType: 'pokemon_cache_fetch',
                pokemonName,
                statusCode: pokemonRes.status,
                statusText: pokemonRes.statusText,
                url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
            });

            return { data: null, fromCache: false, error: true };
        }

        const pokemonData = await pokemonRes.json();

        // Extract only the essential data we need for the PokemonCard component
        // This reduces storage size by ~80% compared to storing the full API response
        const essentialData = {
            // Basic info (used in PokemonCard)
            entry_number: pokemonData.id, // Pokemon number
            pokemon_species: { name: pokemonData.name }, // Pokemon name

            // Types (used for filtering and display)
            types:
                pokemonData.types?.map((t) => ({
                    type: { name: t.type.name }
                })) || [],

            // Sprites (multiple fallback options)
            sprites: {
                front_default: pokemonData.sprites?.front_default,
                other: {
                    'official-artwork': {
                        front_default: pokemonData.sprites?.other?.['official-artwork']?.front_default
                    }
                }
            },

            // Physical stats (used in PokemonCard)
            height: pokemonData.height,
            weight: pokemonData.weight
        };

        // Validate that at least one image URL exists before caching
        const hasOfficialArtwork = essentialData.sprites?.other?.['official-artwork']?.front_default;
        const hasRegularSprite = essentialData.sprites?.front_default;
        const hasImage = hasOfficialArtwork || hasRegularSprite;

        if (!hasImage) {
            console.warn(`⚠️ Skipping cache for ${pokemonName}: No image URL found`);
            // Return data without caching if no image exists
            return { data: essentialData, fromCache: false, error: false };
        }

        // Cache the fetched data only if image URLs exist
        cachePokemon(pokemonName, essentialData);

        // Log size optimization
        const originalSize = JSON.stringify(pokemonData).length;
        const optimizedSize = JSON.stringify(essentialData).length;
        const savings = Math.round((1 - optimizedSize / originalSize) * 100);
        console.log(
            `📥 Fetched and cached ${pokemonName} (${savings}% size reduction: ${Math.round(
                originalSize / 1024
            )}KB → ${Math.round(optimizedSize / 1024)}KB)`
        );

        return { data: essentialData, fromCache: false };
    } catch (error) {
        console.error(`Error fetching ${pokemonName}:`, error);

        // Track error
        trackError({
            errorType: 'pokemon_cache_fetch_error',
            pokemonName,
            errorMessage: error.message || String(error),
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
            additionalData: {
                error_type_name: error.name || 'Error'
            }
        });

        return { data: null, fromCache: false, error: true };
    }
}
