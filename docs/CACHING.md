# Caching System Documentation

> In-depth documentation of the two-tier caching system

## Overview

The Pokemon data caching system uses a two-tier architecture:

1. **Tier 1:** In-memory Map (ultra-fast, session-only)
2. **Tier 2:** localStorage (persistent, cross-session)

This provides the best of both worlds: instant access during a session and persistent storage across sessions.

---

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                    Application Layer                           │
│                  (Components request data)                     │
└─────────────────────────┬─────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────┐
│                 fetchPokemonWithCache()                        │
│                   (Facade Function)                            │
└────────┬──────────────────────────────────────────┬───────────┘
         │                                           │
         ▼                                           ▼
┌──────────────────┐                        ┌──────────────────┐
│  getCachedPokemon│◄───────────────────────│  cachePokemon    │
│   (Read Cache)   │                        │  (Write Cache)   │
└────────┬─────────┘                        └──────────────────┘
         │
         ├─► Check Memory (Map)
         │      └─► pokemonCache.get(name)
         │
         ├─► Check localStorage
         │      └─► localStorage.getItem(key)
         │             └─► Check expiry
         │
         └─► Fetch from API
                └─► Cache result in both tiers
```

---

## API Reference

### Public Functions

#### `fetchPokemonWithCache(pokemonName)`

Main entry point for fetching Pokemon data with automatic caching.

**Parameters:**

- `pokemonName` (string): Pokemon identifier (e.g., 'pikachu', 'charizard')

**Returns:**

```typescript
{
    data: {
        types: Array,
        sprites: Object,
        height: number,
        weight: number,
        abilities: Array
    } | null,
    fromCache: boolean,
    error?: boolean
}
```

**Example:**

```javascript
const result = await fetchPokemonWithCache('pikachu');

if (result.data) {
  console.log(result.fromCache ? 'From cache!' : 'Fresh from API');
  console.log('Type:', result.data.types[0].type.name);
}
```

**Flow:**

```
1. Check memory cache
   ├─► Hit? Return { data, fromCache: true }
   └─► Miss ↓

2. Check localStorage
   ├─► Hit (not expired)?
   │    ├─► Save to memory
   │    └─► Return { data, fromCache: true }
   └─► Miss ↓

3. Fetch from PokeAPI
   ├─► Success?
   │    ├─► Cache in memory
   │    ├─► Cache in localStorage
   │    └─► Return { data, fromCache: false }
   └─► Error? Return { data: null, fromCache: false, error: true }
```

---

#### `getCachedPokemon(pokemonName)`

Retrieves Pokemon from cache (memory or localStorage) without fetching.

**Parameters:**

- `pokemonName` (string): Pokemon identifier

**Returns:**

- `Object | null`: Pokemon data if found in cache, null otherwise

**Example:**

```javascript
const cached = getCachedPokemon('pikachu');
if (cached) {
  console.log('Found in cache!');
} else {
  console.log('Not cached');
}
```

---

#### `cachePokemon(pokemonName, data)`

Manually cache Pokemon data in both tiers.

**Parameters:**

- `pokemonName` (string): Pokemon identifier
- `data` (Object): Pokemon data to cache

**Returns:** `void`

**Example:**

```javascript
const pikachuData = {
  types: [{ type: { name: 'electric' } }],
  sprites: { front_default: '...' },
  height: 4,
  weight: 60
};

cachePokemon('pikachu', pikachuData);
```

**Side Effects:**

- Writes to memory Map
- Writes to localStorage with timestamp
- May throw if localStorage is full

---

#### `clearPokemonCache()`

Clears all cached Pokemon data from both tiers.

**Parameters:** None

**Returns:** `number` - Count of Pokemon cleared from localStorage

**Example:**

```javascript
const cleared = clearPokemonCache();
console.log(`Cleared ${cleared} Pokemon from cache`);
```

**Side Effects:**

- Clears memory Map completely
- Removes all matching keys from localStorage
- Logs count to console

---

#### `getCachedPokemonCount()`

Counts how many Pokemon are currently cached in localStorage.

**Parameters:** None

**Returns:** `number` - Count of cached Pokemon

**Example:**

```javascript
const count = getCachedPokemonCount();
console.log(`${count} Pokemon in cache`);
```

**Use Case:**

- Display cache status on app load
- Monitor cache size
- Debugging

---

### Internal Functions

#### `getCacheKey(pokemonName)`

Generates a versioned cache key for localStorage.

**Format:** `pokemon_{version}_{name}`

**Example:**

```javascript
getCacheKey('pikachu'); // "pokemon_v1_pikachu"
```

**Versioning:**

- Increment `CACHE_VERSION` to invalidate all cached data
- Useful for breaking changes to data structure

---

#### `isCacheExpired(timestamp)`

Checks if a cache entry has expired.

**Parameters:**

- `timestamp` (number): Unix timestamp in milliseconds

**Returns:** `boolean`

**Logic:**

```javascript
const CACHE_EXPIRY_DAYS = 7;
const EXPIRY_MS = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

return Date.now() - timestamp > EXPIRY_MS;
```

**Example:**

```javascript
const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;

isCacheExpired(sevenDaysAgo); // false
isCacheExpired(eightDaysAgo); // true
```

---

## Cache Data Structure

### Memory Cache (Map)

```javascript
const pokemonCache = new Map();

// Structure:
pokemonCache = Map {
    'pikachu' => {
        types: [...],
        sprites: {...},
        height: 4,
        weight: 60,
        abilities: [...]
    },
    'charizard' => { ... }
}
```

**Characteristics:**

- Key: Pokemon name (string)
- Value: Pokemon data (object)
- No expiry (cleared on page refresh)
- Unlimited size (constrained by browser memory)
- Access time: O(1)

---

### localStorage Cache

```javascript
// Key format: "pokemon_v1_pikachu"
// Value: JSON string

{
    "data": {
        "types": [...],
        "sprites": {...},
        "height": 4,
        "weight": 60,
        "abilities": [...]
    },
    "timestamp": 1698765432000
}
```

**Characteristics:**

- Key: Versioned cache key (string)
- Value: JSON with data + timestamp
- 7-day expiry
- ~5-10MB size limit per domain
- Access time: ~1-2ms (I/O overhead)

---

## Cache Strategies

### Read-Through Cache

```
Application requests data
      ↓
Cache checks for data
      ├─► Found? Return immediately
      └─► Not found?
            ↓
          Fetch from API
            ↓
          Cache the result
            ↓
          Return to application
```

**Benefits:**

- Application code stays simple
- Cache logic is transparent
- Automatic population

**Implementation:**

```javascript
export async function fetchPokemonWithCache(pokemonName) {
  // Try cache first
  const cached = getCachedPokemon(pokemonName);
  if (cached) return { data: cached, fromCache: true };

  // Fetch and cache
  const data = await fetchFromAPI(pokemonName);
  cachePokemon(pokemonName, data);
  return { data, fromCache: false };
}
```

---

### Write-Through Cache

```
Data fetched from API
      ↓
Write to Memory Cache (Tier 1)
      ↓
Write to localStorage (Tier 2)
      ↓
Return data to application
```

**Benefits:**

- Ensures consistency
- Both tiers always in sync
- No stale data

**Implementation:**

```javascript
export function cachePokemon(pokemonName, data) {
  // Tier 1: Memory
  pokemonCache.set(pokemonName, data);

  // Tier 2: localStorage
  try {
    const cacheKey = getCacheKey(pokemonName);
    const cacheData = { data, timestamp: Date.now() };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('localStorage write failed:', error);
  }
}
```

---

### Cache Expiry (TTL)

**Time To Live:** 7 days

```
When reading from localStorage:
  ├─► Check timestamp
  ├─► If older than 7 days:
  │     ├─► Remove from localStorage
  │     └─► Return null (cache miss)
  └─► If within 7 days:
        └─► Return data (cache hit)
```

**Why 7 days?**

- Pokemon data rarely changes
- Balance between freshness and performance
- Reasonable storage usage

**Adjusting TTL:**

```javascript
// In utils/pokemonCache.js
const CACHE_EXPIRY_DAYS = 14; // Change to 14 days
```

---

## Performance Metrics

### Cache Hit Rate

```
Hit Rate = (Cache Hits / Total Requests) × 100%
```

**Typical Scenarios:**

| Scenario                  | Hit Rate | API Calls                  |
| ------------------------- | -------- | -------------------------- |
| First visit (no cache)    | 0%       | All requests hit API       |
| Second visit (with cache) | 95-100%  | 0-5% hit API               |
| After 7 days              | 0%       | All expired, hit API again |
| Partial cache             | 50-90%   | Some cached, some API      |

**Monitoring:**

```javascript
// In PokemonGrid.jsx
const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });

// After each batch load
const hitRate = (cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100;
```

---

### Response Time

| Source       | Average Time | P95   | P99    |
| ------------ | ------------ | ----- | ------ |
| Memory Cache | <1ms         | <1ms  | <1ms   |
| localStorage | 1-2ms        | 3ms   | 5ms    |
| PokeAPI      | 200-400ms    | 800ms | 1500ms |

**Speed Improvement:**

- Memory: 200-400× faster than API
- localStorage: 100-200× faster than API

---

### Storage Usage

**Per Pokemon:**

```json
{
    "types": [...],           // ~200 bytes
    "sprites": {...},         // ~500 bytes
    "height": 4,              // ~8 bytes
    "weight": 60,             // ~8 bytes
    "abilities": [...]        // ~300 bytes
}
Total: ~1-2KB per Pokemon
```

**Full Pokedex (151 Pokemon):**

- Raw data: 150-300KB
- JSON overhead: +20-30%
- Total: ~200-400KB

**localStorage Limits:**

- Most browsers: 5-10MB per domain
- Our usage: <1MB for all Pokemon
- Headroom: Plenty (90%+ available)

---

## Cache Invalidation

### When to Invalidate

1. **Version Change**

   - Data structure changes
   - New fields added
   - Breaking API changes

2. **Manual Clear**

   - User clicks "Clear Cache"
   - Debugging
   - Testing

3. **Expiry**
   - Automatic after 7 days
   - Prevents stale data

### How to Invalidate

#### Method 1: Increment Version

```javascript
// In utils/pokemonCache.js
const CACHE_VERSION = 'v2'; // Was v1
```

**Effect:**

- All v1 keys remain in localStorage (orphaned)
- All new reads/writes use v2 keys
- Old cache effectively invalidated
- Old keys cleaned up eventually

#### Method 2: Clear All

```javascript
import { clearPokemonCache } from 'utils/pokemonCache';

clearPokemonCache(); // Removes all pokemon_v1_* keys
```

**Effect:**

- Immediate removal
- Memory cache cleared
- localStorage cleaned
- Next request fetches fresh data

#### Method 3: Selective Clear

```javascript
// Remove specific Pokemon
localStorage.removeItem(getCacheKey('pikachu'));
pokemonCache.delete('pikachu');
```

---

## Error Handling

### localStorage Quota Exceeded

```javascript
try {
  localStorage.setItem(key, value);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.warn('localStorage full, clearing old cache');
    clearPokemonCache();
    // Retry
    localStorage.setItem(key, value);
  }
}
```

### JSON Parse Errors

```javascript
try {
  const cached = localStorage.getItem(cacheKey);
  const parsed = JSON.parse(cached);
  return parsed.data;
} catch (error) {
  console.error('Invalid cache data:', error);
  localStorage.removeItem(cacheKey); // Remove corrupted
  return null;
}
```

### API Fetch Errors

```javascript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('API error');
  return await response.json();
} catch (error) {
  console.error('Fetch failed:', error);
  return { data: null, fromCache: false, error: true };
}
```

---

## Testing

### Unit Tests

```javascript
describe('pokemonCache', () => {
    beforeEach(() => {
        localStorage.clear();
        clearPokemonCache();
    });

    it('caches data in memory', () => {
        const data = { types: [...] };
        cachePokemon('pikachu', data);

        const cached = getCachedPokemon('pikachu');
        expect(cached).toEqual(data);
    });

    it('caches data in localStorage', () => {
        const data = { types: [...] };
        cachePokemon('pikachu', data);

        const key = getCacheKey('pikachu');
        const stored = JSON.parse(localStorage.getItem(key));
        expect(stored.data).toEqual(data);
    });

    it('respects expiry time', () => {
        const data = { types: [...] };
        const oldTimestamp = Date.now() - (8 * 24 * 60 * 60 * 1000); // 8 days ago

        localStorage.setItem(
            getCacheKey('pikachu'),
            JSON.stringify({ data, timestamp: oldTimestamp })
        );

        const cached = getCachedPokemon('pikachu');
        expect(cached).toBeNull();  // Expired
    });
});
```

### Integration Tests

```javascript
describe('Cache integration', () => {
  it('uses cache on second fetch', async () => {
    // First fetch (miss)
    const result1 = await fetchPokemonWithCache('pikachu');
    expect(result1.fromCache).toBe(false);

    // Second fetch (hit)
    const result2 = await fetchPokemonWithCache('pikachu');
    expect(result2.fromCache).toBe(true);
    expect(result2.data).toEqual(result1.data);
  });
});
```

---

## Best Practices

### ✅ Do

- Always use `fetchPokemonWithCache()` for data fetching
- Increment version when data structure changes
- Monitor cache hit rate in production
- Handle localStorage errors gracefully
- Test cache expiry logic

### ❌ Don't

- Don't bypass cache for already-loaded data
- Don't store large images in cache (use URLs)
- Don't cache user-specific data
- Don't forget to handle cache errors
- Don't cache sensitive information

---

## Debugging

### Check Cache Status

```javascript
// In browser console

// Check memory cache
console.log('Memory cache size:', pokemonCache.size);

// Check localStorage cache
const count = getCachedPokemonCount();
console.log('localStorage cache:', count, 'Pokemon');

// Inspect specific Pokemon
const pikachu = getCachedPokemon('pikachu');
console.log('Pikachu cache:', pikachu);

// View all cache keys
Object.keys(localStorage).filter((key) => key.startsWith('pokemon_'));
```

### Cache Statistics

```javascript
// Add to PokemonGrid
console.log('Cache performance:', {
  hits: cacheStats.hits,
  misses: cacheStats.misses,
  hitRate: `${((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1)}%`,
  totalCached: cachedCount
});
```

---

## Future Enhancements

### Planned

1. **IndexedDB Migration**

   - Larger storage capacity
   - Better performance for large datasets
   - Query capabilities

2. **Service Worker Integration**

   - Offline support
   - Background sync
   - Network-first strategy

3. **Cache Compression**

   - LZ-string compression
   - Reduce storage usage
   - Faster JSON parsing

4. **Smart Prefetching**
   - Predictive loading
   - Preload next batch in background
   - Cache adjacent Pokemon

### Experimental

1. **Shared Cache**

   - Share cache across tabs
   - BroadcastChannel API
   - Synchronize cache updates

2. **Cache Analytics**
   - Track hit rates
   - Monitor performance
   - Optimize TTL based on usage

---

**Document Version:** 1.0  
**Last Updated:** October 2025
