'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { trackButtonClick } from 'utils/trackingUtils';
import { trackPokemonSearch } from 'utils/trackingUtils';
import CheckDevice from 'components/utils/CheckDevice';

export default function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [allNames, setAllNames] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const router = useRouter();
    const pathname = usePathname();

    const userDevice = CheckDevice();
    const isMobile = userDevice && userDevice.includes('mobile');

    // Fetch and cache pokemon names in sessionStorage (once per session)
    useEffect(() => {
        let isMounted = true;
        async function loadNames() {
            if (typeof window === 'undefined') return;
            const CACHE_KEY = 'pokemonNameList_v1';
            try {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) {
                    const names = JSON.parse(cached);
                    if (isMounted) setAllNames(names);
                    return;
                }
                const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000', {
                    next: { revalidate: 4320000 }
                });
                if (!res.ok) return;
                const data = await res.json();
                const names = (data.results || []).map((p) => p.name);
                if (isMounted) setAllNames(names);
                try {
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(names));
                } catch {}
            } catch {}
        }
        loadNames();
        return () => {
            isMounted = false;
        };
    }, []);

    // Debounced query for smoother filtering
    const [debouncedQuery, setDebouncedQuery] = useState('');
    useEffect(() => {
        const id = setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 150);
        return () => clearTimeout(id);
    }, [searchQuery]);

    // Compute suggestions: prefer startsWith, then includes
    const suggestions = useMemo(() => {
        if (!debouncedQuery) return [];
        const q = debouncedQuery;
        const starts = [];
        const includes = [];
        for (const name of allNames) {
            if (name.startsWith(q)) {
                starts.push(name);
            } else if (name.includes(q)) {
                includes.push(name);
            }
            if (starts.length >= 8) break;
        }
        const combined = starts.concat(includes);
        return combined.slice(0, 8);
    }, [debouncedQuery, allNames]);

    const navigateTo = (name) => {
        if (!name) return;
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pokemonReferrer', pathname);
        }
        if (typeof trackButtonClick !== 'undefined') {
            try {
                trackButtonClick('Pokemon Search', `/pokemon/${name}`);
            } catch {}
        }

        setSearchQuery(name);
        setIsOpen(false);
        setHighlightIndex(-1);
        if (inputRef.current) inputRef.current.blur();

        router.push(`/pokemon/${name}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const value = searchQuery.trim().toLowerCase();
        if (!value) return;
        const usedSuggestion = isOpen && highlightIndex >= 0 && suggestions[highlightIndex];
        if (!usedSuggestion) {
            // Manual submit
            trackPokemonSearch({
                source: 'manual_submit',
                typedQuery: value,
                selectedName: value
            });
        }
        const chosen = usedSuggestion ? suggestions[highlightIndex] : value;
        navigateTo(chosen);
    };

    // Open suggestions when typing and there are results
    useEffect(() => {
        setIsOpen(Boolean(debouncedQuery) && suggestions.length > 0);
        setHighlightIndex(-1);
    }, [debouncedQuery, suggestions.length]);

    // Close on outside click
    useEffect(() => {
        function onClickOutside(e) {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightIndex(-1);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const onKeyDown = (e) => {
        if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            setIsOpen(suggestions.length > 0);
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            // handled by form submit, but if open, ensure we use highlighted
            if (isOpen && highlightIndex >= 0) {
                e.preventDefault();
                // Track keyboard selection explicitly (bypasses form submit path)
                try {
                    trackPokemonSearch({
                        source: 'suggestion_keyboard',
                        typedQuery: searchQuery,
                        selectedName: suggestions[highlightIndex],
                        suggestionIndex: highlightIndex,
                        suggestionsCount: suggestions.length
                    });
                } catch {}
                navigateTo(suggestions[highlightIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setHighlightIndex(-1);
        }
    };

    return (
        <div className={`${isMobile ? 'w-[53vw]' : 'w-full'}`} ref={containerRef}>
            <form onSubmit={handleSearch} className="flex gap-3 w-full">
                <div className="relative flex-1 w-full">
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsOpen(suggestions.length > 0 && Boolean(debouncedQuery))}
                        onKeyDown={onKeyDown}
                        placeholder="Search Pokemon Name"
                        className={`w-full py-3 rounded-lg focus:ring-2 focus:ring-white/60 border-none text-white placeholder:text-white/80 outline-none transition-all ${
                            isMobile
                                ? 'text-3xs px-4 bg-white/20 pr-10'
                                : 'text-sm px-7 pr-12 shadow-md shadow-black/40 backdrop-blur-sm'
                        }`}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {isOpen && suggestions.length > 0 && (
                        <ul className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-black/70 backdrop-blur border border-white/20 shadow-lg">
                            {suggestions.map((name, idx) => (
                                <li
                                    key={name}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        // Mouse click suggestion
                                        trackPokemonSearch({
                                            source: 'suggestion_click',
                                            typedQuery: searchQuery,
                                            selectedName: name,
                                            suggestionIndex: idx,
                                            suggestionsCount: suggestions.length
                                        });
                                        navigateTo(name);
                                    }}
                                    onMouseEnter={() => setHighlightIndex(idx)}
                                    className={`px-4 py-2 text-sm cursor-pointer ${
                                        idx === highlightIndex
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/90 hover:bg-white/10'
                                    }`}
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Optional explicit Search button removed to keep UI clean */}
            </form>
        </div>
    );
}
