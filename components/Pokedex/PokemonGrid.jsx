'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PokemonCard from './PokemonCard';
import CacheStats from './CacheStats';
import LoadingIndicator from './LoadingIndicator';
import PokemonFilter from './PokemonFilter';
import { clearPokemonCache, getCachedPokemonCount, getStorageStats } from 'utils/pokemonCache';
import { fetchPokemonBatch } from 'utils/pokemonBatchFetcher';
import { POKEMON_GRID_CONFIG } from 'constants/pokemonTypes';
import { trackSectionView, trackPokedexFilter } from 'utils/trackingUtils';
import CheckDevice from 'components/utils/CheckDevice';
import clsx from 'clsx';

/**
 * PokemonGrid Component
 *
 * Displays Pokemon in a grid with filtering and sorting capabilities.
 *
 * Features:
 * - Two-step loading: First 100 Pokemon quickly, then remaining in background
 * - Filters out Pokemon with incomplete data (missing images)
 * - Real-time filtering by Pokemon type
 * - Sorting by Pokedex number or name
 * - Two-tier caching (memory + localStorage)
 */
export default function PokemonGrid({ initialEntries, region, isShowModal, setIsShowModal, modalMode, userDevice }) {
    console.log(' 🚀 ༼;´༎ຶ ۝ ༎ຶ༽ ~  (ノ ° 益 °) ノ ~ (っ◔◡◔)っ ~   ~ userDevice 2:', userDevice);
    useEffect(() => {
        trackSectionView('Pokedex Region', null, { region: region });
    }, [region]);

    // State management
    const [allPokemon, setAllPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });
    const [cachedCount, setCachedCount] = useState(0);

    // Filter and sort state
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sortBy, setSortBy] = useState('number'); // 'number', 'name-asc', 'name-desc'

    // Refs
    const scrollContainerRef = useRef(null);

    const { BATCH_SIZE } = POKEMON_GRID_CONFIG;

    /**
     * Filter and sort Pokemon data
     *
     * Process:
     * 1. Remove Pokemon with incomplete data (missing images)
     * 2. Apply type filters (if any selected)
     * 3. Sort by user preference
     */
    const filteredAndSortedPokemon = useMemo(() => {
        // Step 1: Filter out Pokemon with incomplete data (no images)
        const totalPokemon = allPokemon.length;
        let filtered = allPokemon.filter((pokemon) => {
            const hasOfficialArtwork = pokemon.sprites?.other?.['official-artwork']?.front_default;
            const hasRegularSprite = pokemon.sprites?.front_default;
            return hasOfficialArtwork || hasRegularSprite;
        });

        const filteredCount = totalPokemon - filtered.length;
        if (filteredCount > 0) {
            // console.log(
            //     `🚫 Filtered out ${filteredCount} Pokemon with incomplete data (${filtered.length} valid Pokemon remaining)`
            // );
        }

        // Step 2: Apply type filters
        if (selectedTypes.length > 0) {
            filtered = filtered.filter((pokemon) => {
                const pokemonTypes = pokemon.types?.map((t) => t.type.name) || [];
                return selectedTypes.some((selectedType) => pokemonTypes.includes(selectedType));
            });
        }

        // Step 3: Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.pokemon_species.name.localeCompare(b.pokemon_species.name);
                case 'name-desc':
                    return b.pokemon_species.name.localeCompare(a.pokemon_species.name);
                case 'number':
                default:
                    return a.entry_number - b.entry_number;
            }
        });

        return sorted;
    }, [allPokemon, selectedTypes, sortBy]);

    // Check cached Pokemon count and storage usage on component mount
    useEffect(() => {
        const count = getCachedPokemonCount();
        const stats = getStorageStats();
        setCachedCount(count);

        if (count > 0) {
            console.log(`💾 Found ${count} Pokemon in cache (${stats.sizeMB}MB used)`);

            // Warn if approaching quota limit
            if (stats.sizeMB > 4) {
                console.warn(
                    `⚠️ Cache usage is high (${stats.sizeMB}MB). Consider clearing cache if you experience issues.`
                );
            }
        }
    }, []);

    /**
     * Load first batch of Pokemon (first 100)
     *
     * Loads the first 100 Pokemon quickly for immediate display.
     */
    const loadInitialPokemon = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const { pokemonWithDetails, cacheHits, cacheMisses } = await fetchPokemonBatch(
                initialEntries,
                0,
                100 // First 100 Pokemon
            );

            setAllPokemon(pokemonWithDetails);
            setCacheStats({ hits: cacheHits, misses: cacheMisses });
            console.log(`✅ Loaded initial ${pokemonWithDetails.length} Pokemon`);
        } catch (error) {
            console.error('Error loading initial Pokemon:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, initialEntries]);

    /**
     * Load remaining Pokemon data
     *
     * Loads the rest of the Pokemon data after the initial batch.
     * This allows complete filtering to work on the full dataset.
     */
    const loadRemainingPokemon = useCallback(async () => {
        if (isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            let remainingPokemonData = [];
            let totalCacheHits = 0;
            let totalCacheMisses = 0;
            let currentIndex = 100; // Start from Pokemon 101

            // Load remaining Pokemon in batches
            while (currentIndex < initialEntries.length) {
                const { pokemonWithDetails, cacheHits, cacheMisses } = await fetchPokemonBatch(
                    initialEntries,
                    currentIndex,
                    BATCH_SIZE
                );

                remainingPokemonData = [...remainingPokemonData, ...pokemonWithDetails];
                totalCacheHits += cacheHits;
                totalCacheMisses += cacheMisses;
                currentIndex += BATCH_SIZE;
            }

            // Append remaining Pokemon to existing data
            setAllPokemon((prev) => [...prev, ...remainingPokemonData]);
            setCacheStats((prev) => ({
                hits: prev.hits + totalCacheHits,
                misses: prev.misses + totalCacheMisses
            }));

            console.log(
                `✅ Loaded remaining ${remainingPokemonData.length} Pokemon (Total: ${
                    allPokemon.length + remainingPokemonData.length
                })`
            );
        } catch (error) {
            console.error('Error loading remaining Pokemon:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, initialEntries, BATCH_SIZE, allPokemon.length]);

    // Load initial Pokemon data on mount
    useEffect(() => {
        loadInitialPokemon();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Load remaining Pokemon data after initial load completes
    useEffect(() => {
        if (!isLoading && allPokemon.length > 0 && allPokemon.length < initialEntries.length) {
            setTimeout(() => {
                loadRemainingPokemon();
            }, 100);
        }
    }, [isLoading, allPokemon.length, initialEntries.length, loadRemainingPokemon]);

    // Handle filtering loading state
    useEffect(() => {
        if (allPokemon.length > 100 && (selectedTypes.length > 0 || sortBy !== 'number')) {
            setIsFiltering(true);
            const timer = setTimeout(() => setIsFiltering(false), 300);
            return () => clearTimeout(timer);
        }
    }, [allPokemon.length, selectedTypes.length, sortBy]);

    // Track filter applications (debounced to avoid spam)
    const prevFilterStateRef = useRef({ selectedTypes: [], sortBy: 'number' });
    useEffect(() => {
        // Only track if filters were actually applied (not initial load)
        if (allPokemon.length === 0 || isLoading) return;

        // Debounce tracking to avoid too many events
        const timer = setTimeout(() => {
            const resultCount = filteredAndSortedPokemon.length;
            const prevState = prevFilterStateRef.current;

            // Track if filters actually changed (types or sort)
            const typesChanged = JSON.stringify(selectedTypes) !== JSON.stringify(prevState.selectedTypes);
            const sortChanged = sortBy !== prevState.sortBy;
            const filtersChanged = typesChanged || sortChanged;

            // Only track if filters were actively applied (have filters or non-default sort)
            const hasActiveFilters = selectedTypes.length > 0 || sortBy !== 'number';

            if (filtersChanged && hasActiveFilters) {
                trackPokedexFilter({
                    action: 'filter_apply',
                    selectedTypes: selectedTypes,
                    sortBy: sortBy,
                    resultCount: resultCount,
                    totalCount: allPokemon.length,
                    region: region
                });

                // Update ref to prevent duplicate tracking
                prevFilterStateRef.current = {
                    selectedTypes: [...selectedTypes],
                    sortBy: sortBy
                };
            } else if (
                filtersChanged &&
                !hasActiveFilters &&
                (prevState.selectedTypes.length > 0 || prevState.sortBy !== 'number')
            ) {
                // Track when filters are cleared (returned to default state)
                trackPokedexFilter({
                    action: 'filter_apply',
                    selectedTypes: [],
                    sortBy: 'number',
                    resultCount: resultCount,
                    totalCount: allPokemon.length,
                    region: region
                });

                prevFilterStateRef.current = {
                    selectedTypes: [],
                    sortBy: 'number'
                };
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [selectedTypes, sortBy, filteredAndSortedPokemon.length, allPokemon.length, isLoading, region]);

    /**
     * Clear cache and reload from scratch
     */
    const handleClearCache = () => {
        const clearedCount = clearPokemonCache();
        setCacheStats({ hits: 0, misses: 0 });
        setCachedCount(0);
        setAllPokemon([]);
        setTimeout(() => loadInitialPokemon(), 100);
        alert(`Cleared ${clearedCount} Pokemon from cache. Reloading...`);
    };

    const isMobile = userDevice && userDevice.includes('mobile');

    return (
        <div className="w-full flex gap-6 h-[-webkit-fill-available] justify-center">
            {/* Cache Statistics */}
            {/* <CacheStats cacheStats={cacheStats} cachedCount={cachedCount} onClearCache={handleClearCache} /> */}

            {/* Pokemon Filter */}
            <PokemonFilter
                onFilterChange={setSelectedTypes}
                onSortChange={setSortBy}
                isMobile={isMobile}
                isShowModal={isShowModal}
                setIsShowModal={setIsShowModal}
                modalMode={modalMode}
                selectedTypes={selectedTypes}
                sortBy={sortBy}
            />

            {/* Pokemon Grid */}
            <div
                ref={scrollContainerRef}
                className={clsx(
                    'w-full max-h-[81vh] overflow-y-auto h-[-webkit-fill-available] scrollbar-hide relative',
                    userDevice === 'desktop'
                        ? 'flex flex-wrap justify-start items-start pl-5 max-w-[70vw] gap-6'
                        : !isFiltering && allPokemon.length > 0 && 'grid grid-cols-2 gap-4 px-4 max-h-[78vh]'
                )}
            >
                {((isLoading || allPokemon.length === 0) && userDevice) === 'desktop' ? (
                    <div
                        className={clsx(
                            'flex flex-col items-center justify-center w-full h-full min-h-[400px] text-white/70',
                            isMobile ? '!h-[70%]' : ''
                        )}
                    >
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50 mb-4"></div>
                        <p className={clsx('text-xl font-semibold mb-2', isMobile ? '!text-sm' : '')}>
                            Loading Pokemon...
                        </p>
                        <p className={clsx('text-sm text-white/50', isMobile ? '!text-xs text-center' : '')}>
                            Loading first 100 Pokemon...
                        </p>
                    </div>
                ) : isFiltering ? (
                    <div
                        className={clsx(
                            'flex flex-col items-center justify-center w-full h-full min-h-[400px] text-white/70',
                            isMobile ? '!h-[70%]' : ''
                        )}
                    >
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50 mb-4"></div>
                        <p className={clsx('text-xl font-semibold mb-2', isMobile ? '!text-sm' : '')}>
                            Filtering Pokemon...
                        </p>
                        <p className={clsx('text-sm text-white/50', isMobile ? '!text-xs text-center' : '')}>
                            Please wait while we filter the results
                        </p>
                    </div>
                ) : filteredAndSortedPokemon.length > 0 ? (
                    <>
                        {filteredAndSortedPokemon.map((entry, idx) => (
                            <PokemonCard
                                key={`${entry.entry_number}-${entry.pokemon_species.name}-${idx}`}
                                entry={entry}
                            />
                        ))}

                        {/* Background loading indicator */}
                        {/* {isLoadingMore && ( */}
                        {/* <div className="bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 text-white/80 text-sm">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/50"></div>
                            <span>Loading more Pokemon...</span>
                        </div> */}
                        {/* )} */}
                    </>
                ) : (
                    <div
                        className={clsx(
                            'flex flex-col items-center justify-center w-full h-full min-h-[400px] text-white/70',
                            isMobile ? '!h-[70%]' : ''
                        )}
                    >
                        <svg
                            className="w-24 h-24 mb-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <p className={clsx('text-xl font-semibold mb-2', isMobile ? '!text-sm' : '')}>
                            No Pokemon Found
                        </p>
                        <p className={clsx('text-sm text-white/50', isMobile ? '!text-xs text-center' : '')}>
                            Try selecting different types or clear filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
