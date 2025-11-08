# Pokedex Components Documentation

This directory contains the Pokemon display and search components with a well-structured, modular architecture.

## File Structure

```
components/Pokedex/
├── PokemonGrid.jsx        # Main grid component with progressive loading
├── PokemonCard.jsx        # Individual Pokemon card display
├── CacheStats.jsx         # Cache statistics and management UI
├── LoadingIndicator.jsx   # Loading animation component
├── PokedexLocation.jsx    # Region selection component
└── PokemonSearch.jsx      # Search functionality

utils/
├── pokemonCache.js        # Cache utility (memory + localStorage)
└── pokemonBatchFetcher.js # Batch fetching with cache integration

constants/
└── pokemonTypes.js        # Pokemon type colors and configuration
```

## Component Overview

### PokemonGrid.jsx
**Main component for displaying Pokemon in a paginated grid**

**Features:**
- Progressive loading (24 Pokemon at a time)
- Two-tier caching system
- Real-time cache statistics
- Load more functionality
- Responsive grid layout

**Props:**
- `initialEntries` (Array): Array of Pokemon entries from the Pokedex API

**Usage:**
```jsx
<PokemonGrid initialEntries={data.pokemon_entries} />
```

### PokemonCard.jsx
**Individual Pokemon card component**

**Features:**
- Pokemon sprite display
- Entry number with leading zeros
- Pokemon name formatting
- Type badges with color coding
- Hover effects and animations
- Links to individual Pokemon pages

**Props:**
- `entry` (Object): Pokemon entry data including:
  - `entry_number`: Pokedex number
  - `pokemon_species.name`: Pokemon name
  - `types`: Array of Pokemon types
  - `sprites.front_default`: Pokemon sprite URL

### CacheStats.jsx
**Cache statistics and management UI**

**Features:**
- Initial cache count display
- Live cache hit/miss statistics
- Cache hit rate percentage
- Clear cache button

**Props:**
- `cacheStats` (Object): `{ hits: number, misses: number }`
- `cachedCount` (Number): Total Pokemon in cache
- `onClearCache` (Function): Callback for clearing cache

### LoadingIndicator.jsx
**Animated loading indicator**

**Features:**
- Three animated bouncing dots
- Staggered animation delays
- Minimal and clean design

## Utility Functions

### pokemonCache.js
**Two-tier caching system for Pokemon data**

**Functions:**
- `getCachedPokemon(pokemonName)`: Get Pokemon from cache
- `cachePokemon(pokemonName, data)`: Save Pokemon to cache
- `clearPokemonCache()`: Clear all cached Pokemon
- `getCachedPokemonCount()`: Get count of cached Pokemon
- `fetchPokemonWithCache(pokemonName)`: Fetch with automatic caching

**Cache Strategy:**
1. Check in-memory cache (Map) - fastest
2. Check localStorage - persistent across sessions
3. Fetch from API if not cached
4. Store in both caches for future use

**Cache Configuration:**
- Version: v1 (for easy cache invalidation)
- Expiry: 7 days
- Storage: Only essential data (types, sprites)

### pokemonBatchFetcher.js
**Batch fetching utility**

**Functions:**
- `fetchPokemonBatch(entries, startIndex, batchSize)`: Fetch multiple Pokemon with caching

**Returns:**
```javascript
{
  pokemonWithDetails: Array,  // Pokemon with fetched data
  cacheHits: Number,          // Number of cache hits
  cacheMisses: Number         // Number of API calls
}
```

## Constants

### pokemonTypes.js
**Pokemon type colors and configuration**

**Constants:**
- `POKEMON_TYPE_COLORS`: Object mapping type names to hex colors
- `POKEMON_GRID_CONFIG`: Grid display configuration

**Functions:**
- `getPokemonTypeColor(type)`: Get color for a Pokemon type

**Supported Types:**
normal, fire, water, electric, grass, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy

## Data Flow

```
1. User visits region page
   ↓
2. Server fetches basic Pokedex data (pokemon_entries)
   ↓
3. PokemonGrid receives initialEntries
   ↓
4. On mount: Check localStorage for cached Pokemon count
   ↓
5. Load first batch (24 Pokemon):
   - For each Pokemon:
     a. Check memory cache → b. Check localStorage → c. Fetch from API
   - Track cache hits/misses
   - Display Pokemon cards
   ↓
6. User clicks "Load More"
   ↓
7. Repeat step 5 for next batch
   ↓
8. Continue until all Pokemon loaded
```

## Performance Optimizations

1. **Two-Tier Caching**: Memory (instant) + localStorage (persistent)
2. **Batch Loading**: Only load 24 Pokemon at a time
3. **Lazy Loading**: Images load on demand
4. **Progressive Enhancement**: Show data as it arrives
5. **Minimal Storage**: Only cache essential data (types, sprites)
6. **Cache Expiry**: Automatic cleanup of 7-day old data

## Best Practices

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Type Safety**: Clear prop expectations documented
4. **Error Handling**: Graceful fallbacks for failed requests
5. **Performance**: Optimized for large datasets
6. **User Feedback**: Loading states and progress indicators

## Future Enhancements

- [ ] Add infinite scroll option
- [ ] Implement search and filter
- [ ] Add skeleton loading states
- [ ] Support for different grid layouts
- [ ] Export/import cache functionality
- [ ] Cache size management and limits

