// Pokedex data cache utility
// Provides caching for Pokedex region data to prevent unnecessary API calls
import { trackError } from './trackingUtils';

// In-memory cache for Pokedex data
const pokedexCache = new Map();

// Cache configuration
const CACHE_VERSION = 'v1';
const CACHE_EXPIRY_DAYS = 50;

/**
 * Get cache key for a Pokedex region
 */
function getCacheKey(region) {
    return `pokedex_${CACHE_VERSION}_${region}`;
}

/**
 * Check if cache timestamp is expired
 */
function isCacheExpired(timestamp) {
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 50 days in milliseconds
    return Date.now() - timestamp > expiryTime;
}

/**
 * Get Pokedex data from cache (checks memory first, then sessionStorage)
 */
export function getCachedPokedex(region) {
    // Check in-memory cache first (fastest)
    if (pokedexCache.has(region)) {
        console.log(`✅ Using in-memory cached data for ${region}`);
        return pokedexCache.get(region);
    }

    // Check sessionStorage (persistent during session) - only in browser
    if (typeof window !== 'undefined') {
        try {
            const cacheKey = getCacheKey(region);
            const cached = sessionStorage.getItem(cacheKey);

            if (cached) {
                const { data, timestamp } = JSON.parse(cached);

                // Check if cache is still valid
                if (!isCacheExpired(timestamp)) {
                    // Store in memory cache for faster access next time
                    pokedexCache.set(region, data);
                    console.log(`✅ Using sessionStorage cached data for ${region}`);
                    return data;
                } else {
                    // Remove expired cache
                    sessionStorage.removeItem(cacheKey);
                }
            }
        } catch (error) {
            console.error('Error reading from pokedex cache:', error);
        }
    }

    return null;
}

/**
 * Save Pokedex data to cache (both memory and sessionStorage)
 */
export function cachePokedex(region, data) {
    // Save to memory cache
    pokedexCache.set(region, data);

    // Save to sessionStorage for persistence during session - only in browser
    if (typeof window !== 'undefined') {
        try {
            const cacheKey = getCacheKey(region);
            const cacheData = {
                data,
                timestamp: Date.now()
            };

            const dataToStore = JSON.stringify(cacheData);
            sessionStorage.setItem(cacheKey, dataToStore);

            console.log(`💾 Cached pokedex data for ${region}`);
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.warn('⚠️ sessionStorage quota exceeded for pokedex cache');
            } else {
                console.error('Error saving pokedex to cache:', error);
            }
        }
    }
}

/**
 * Fetch Pokedex data with caching
 */
export async function fetchPokedexWithCache(region) {
    // Check cache first
    const cachedData = getCachedPokedex(region);
    if (cachedData) {
        return { data: cachedData, fromCache: true };
    }

    // Fetch from API if not in cache
    try {
        const url =
            region === 'list' ? 'https://pokeapi.co/api/v2/pokedex' : `https://pokeapi.co/api/v2/pokedex/${region}`;

        const res = await fetch(url, {
            next: { revalidate: 4320000 } // Revalidate every 50 days
        });

        if (!res.ok) {
            // Track error (client-side only)
            if (typeof window !== 'undefined') {
                trackError({
                    errorType: 'pokedex_fetch',
                    statusCode: res.status,
                    statusText: res.statusText,
                    url: url,
                    additionalData: {
                        region: region
                    }
                });
            }
            throw new Error(`Failed to fetch pokedex data for ${region}`);
        }

        const pokedexData = await res.json();

        // Cache the fetched data
        cachePokedex(region, pokedexData);

        console.log(`🌐 Fetched and cached pokedex data for ${region}`);
        return { data: pokedexData, fromCache: false };
    } catch (error) {
        console.error(`Error fetching pokedex data for ${region}:`, error);

        // Track error (client-side only)
        if (typeof window !== 'undefined') {
            trackError({
                errorType: 'pokedex_fetch_error',
                errorMessage: error.message || String(error),
                url: url,
                additionalData: {
                    region: region,
                    error_type_name: error.name || 'Error'
                }
            });
        }

        return { data: null, fromCache: false, error: true };
    }
}

/**
 * Clear Pokedex cache
 */
export function clearPokedexCache() {
    // Clear memory cache
    pokedexCache.clear();

    // Clear sessionStorage - only in browser
    if (typeof window !== 'undefined') {
        try {
            const keysToRemove = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith(`pokedex_${CACHE_VERSION}_`)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach((key) => sessionStorage.removeItem(key));
            console.log(`🗑️ Cleared ${keysToRemove.length} pokedex entries from cache`);
            return keysToRemove.length;
        } catch (error) {
            console.error('Error clearing pokedex cache:', error);
            return 0;
        }
    }

    return 0;
}

/**
 * Get count of cached Pokedex entries
 */
export function getCachedPokedexCount() {
    if (typeof window !== 'undefined') {
        try {
            let count = 0;
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith(`pokedex_${CACHE_VERSION}_`)) {
                    count++;
                }
            }
            return count;
        } catch (error) {
            console.error('Error checking pokedex cache:', error);
            return 0;
        }
    }

    return 0;
}
