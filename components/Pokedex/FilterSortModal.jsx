'use client';

import { useState, useEffect } from 'react';
import { POKEMON_TYPE_COLORS } from 'constants/pokemonTypes';
import { trackPokedexFilter } from 'utils/trackingUtils';

/**
 * FilterSortModal Component
 *
 * Mobile modal that slides up from bottom showing filter and sort options
 */
export default function FilterSortModal({ isOpen, onClose, selectedTypes, sortBy, onFilterChange, onSortChange }) {
    const [localSelectedTypes, setLocalSelectedTypes] = useState(selectedTypes || []);
    const [localSortBy, setLocalSortBy] = useState(sortBy || 'number');

    // Sync local state with props when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalSelectedTypes(selectedTypes || []);
            setLocalSortBy(sortBy || 'number');
        }
    }, [isOpen, selectedTypes, sortBy]);

    // Get all available Pokemon types
    const allTypes = Object.keys(POKEMON_TYPE_COLORS);

    /**
     * Handle type checkbox toggle
     */
    const handleTypeToggle = (type) => {
        const newSelectedTypes = localSelectedTypes.includes(type)
            ? localSelectedTypes.filter((t) => t !== type)
            : [...localSelectedTypes, type];

        setLocalSelectedTypes(newSelectedTypes);
    };

    /**
     * Handle sort option change
     */
    const handleSortChange = (value) => {
        setLocalSortBy(value);
    };

    /**
     * Apply both filters and sorting
     */
    const handleApply = () => {
        onFilterChange(localSelectedTypes);
        onSortChange(localSortBy);
        
        // Track filter/sort application
        trackPokedexFilter({
            action: 'filter_apply',
            selectedTypes: localSelectedTypes,
            sortBy: localSortBy
        });
        
        onClose();
    };

    /**
     * Clear all filters
     */
    const handleClearFilters = () => {
        setLocalSelectedTypes([]);
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            {/* Modal */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-black z-50 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
                }`}
                style={{
                    height: '50vh'
                }}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Handle bar */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-white/30 rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <div className="flex gap-6 h-full">
                            {/* Sorting Section - Left Side */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-white text-sm font-medium">Sorting By</h3>
                                    <div className="h-[1px] w-full bg-white/30"></div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value="number"
                                            checked={localSortBy === 'number'}
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            className="w-4 h-4 cursor-pointer accent-white/80"
                                        />
                                        <span className="text-white text-xs font-medium">Pokédex Number</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value="name-asc"
                                            checked={localSortBy === 'name-asc'}
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            className="w-4 h-4 cursor-pointer accent-white/80"
                                        />
                                        <span className="text-white text-xs font-medium">Name (A-Z)</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value="name-desc"
                                            checked={localSortBy === 'name-desc'}
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            className="w-4 h-4 cursor-pointer accent-white/80"
                                        />
                                        <span className="text-white text-xs font-medium">Name (Z-A)</span>
                                    </label>
                                </div>

                                <button
                                    onClick={handleApply}
                                    className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    Applied Sorting
                                </button>
                            </div>

                            {/* Filter Section - Right Side */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-white text-sm font-medium">Filter By Type</h3>
                                        <div className="h-[1px] w-full bg-white/30"></div>
                                    </div>
                                    {localSelectedTypes.length > 0 && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-white/70 hover:text-white text-xs transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto">
                                    {allTypes.map((type) => (
                                        <label
                                            key={type}
                                            className="flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-all rounded-lg hover:bg-white/10"
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={localSelectedTypes.includes(type)}
                                                    onChange={() => handleTypeToggle(type)}
                                                    className="w-4 h-4 cursor-pointer bg-transparent border-2 border-white rounded-sm focus:ring-white focus:ring-2 appearance-none hover:border-white/40 transition-colors"
                                                />
                                                {localSelectedTypes.includes(type) && (
                                                    <div className="absolute top-1 left-0 w-4 h-4 flex items-center justify-center pointer-events-none">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-white text-xs font-medium capitalize">{type}</span>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    onClick={handleApply}
                                    className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    Applied Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

