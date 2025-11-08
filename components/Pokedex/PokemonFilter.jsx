'use client';

import { useState, useEffect } from 'react';
import { POKEMON_TYPE_COLORS, getPokemonTypeColor } from 'constants/pokemonTypes';
import PokemonSearch from './PokemonSearch';
import { trackPokedexFilter } from 'utils/trackingUtils';
import PopUpModal from 'components/utils/PopUpModal';

/**
 * PokemonFilter Component
 *
 * Provides filtering and sorting controls for the Pokemon grid:
 * - Filter by type using checkboxes (multiple selection)
 * - Sort by: Pokedex number (default), Name A-Z, Name Z-A
 *
 * @param {Function} onFilterChange - Callback when type filters change
 * @param {Function} onSortChange - Callback when sort option changes
 */
export default function PokemonFilter({
    onFilterChange,
    onSortChange,
    isMobile,
    isShowModal,
    setIsShowModal,
    modalMode = 'filter',
    selectedTypes: propSelectedTypes,
    sortBy: propSortBy
}) {
    console.log(' 🚀 ༼;´༎ຶ ۝ ༎ຶ༽ ~  (ノ ° 益 °) ノ ~ (っ◔◡◔)っ ~   ~ isShowModal:', isShowModal);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sortBy, setSortBy] = useState('number'); // 'number', 'name-asc', 'name-desc'

    // Mobile pending state - only applies when Apply button is clicked
    const [pendingSelectedTypes, setPendingSelectedTypes] = useState([]);
    const [pendingSortBy, setPendingSortBy] = useState('number');

    // const [isExpanded, setIsExpanded] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    // Sync pending state with current props when modal opens (mobile only)
    useEffect(() => {
        if (isMobile && isShowModal) {
            const currentTypes = propSelectedTypes || selectedTypes || [];
            const currentSort = propSortBy || sortBy || 'number';
            setPendingSelectedTypes(currentTypes);
            setPendingSortBy(currentSort);
        }
    }, [isMobile, isShowModal, propSelectedTypes, propSortBy]);

    // Get all available Pokemon types
    const allTypes = Object.keys(POKEMON_TYPE_COLORS);

    /**
     * Handle type checkbox toggle
     */
    const handleTypeToggle = (type) => {
        if (isMobile) {
            // Mobile: Update pending state only
            const newSelectedTypes = pendingSelectedTypes.includes(type)
                ? pendingSelectedTypes.filter((t) => t !== type)
                : [...pendingSelectedTypes, type];
            setPendingSelectedTypes(newSelectedTypes);
        } else {
            // Desktop: Apply immediately
            const newSelectedTypes = selectedTypes.includes(type)
                ? selectedTypes.filter((t) => t !== type)
                : [...selectedTypes, type];
            setSelectedTypes(newSelectedTypes);
            onFilterChange(newSelectedTypes);
        }
    };

    /**
     * Handle sort option change
     */
    const handleSortChange = (value) => {
        if (isMobile) {
            // Mobile: Update pending state only
            setPendingSortBy(value);
        } else {
            // Desktop: Apply immediately
            setSortBy(value);
            onSortChange(value);
            // Track sort change
            trackPokedexFilter({
                action: 'sort_change',
                selectedTypes: selectedTypes,
                sortBy: value
            });
        }
    };

    /**
     * Clear all filters
     */
    const handleClearFilters = () => {
        if (isMobile) {
            // Mobile: Clear pending state only
            setPendingSelectedTypes([]);
        } else {
            // Desktop: Clear immediately
            if (selectedTypes.length === 0) return;

            // Track filter clear before clearing
            trackPokedexFilter({
                action: 'filter_clear',
                selectedTypes: selectedTypes,
                sortBy: sortBy
            });

            setSelectedTypes([]);
            onFilterChange([]);
        }
    };

    /**
     * Apply pending changes (mobile only)
     */
    const handleApply = () => {
        if (!isMobile) return;

        // Apply pending filter changes
        setSelectedTypes(pendingSelectedTypes);
        onFilterChange(pendingSelectedTypes);

        // Apply pending sort changes
        setSortBy(pendingSortBy);
        onSortChange(pendingSortBy);

        // Track filter/sort apply
        trackPokedexFilter({
            action: 'filter_apply',
            selectedTypes: pendingSelectedTypes,
            sortBy: pendingSortBy
        });
    };

    if (isMobile) {
        console.log(' 🚀 ༼;´༎ຶ ۝ ༎ຶ༽ ~  (ノ ° 益 °) ノ ~ (っ◔◡◔)っ ~   ~ isShowModal2:', isShowModal);
        if (!isShowModal) {
            return null;
        }

        return (
            <>
                <PopUpModal
                    isShowModal={isShowModal}
                    setIsShowModal={setIsShowModal}
                    actionButton={true}
                    bodyHeight="fit-content"
                    modalMode={modalMode}
                    bgTransparent={true}
                    onApply={handleApply}
                >
                    <div className="flex flex-col gap-5 justify-center items-center w-full py-6 pt-12">
                        {/* Header with mode indicator */}
                        <div className="w-full flex flex-col items-start justify-center gap-3 mb-2">
                            <div className="w-full flex items-center justify-between">
                                <div
                                    className="text-white text-xs font-bold capitalize w-full"
                                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                                >
                                    {modalMode === 'filter' ? 'Filter by Type' : 'Sort Pokemon'}
                                </div>
                                {/* Clear All Button */}
                                {pendingSelectedTypes.length > 0 && (
                                    <div className="whitespace-nowrap flex justify-end items-center">
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-3xs text-[#74C2FF] transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="h-[2px] rounded-full flex w-[50%] bg-[#FFFCE9]/30"></div>
                        </div>

                        {modalMode === 'filter' ? (
                            /* Filter Mode - Type Selection */
                            <div className="w-full flex flex-col items-start justify-center gap-4">
                                {/* Type Checkboxes Grid */}
                                <div className="grid grid-cols-2 gap-2 justify-between items-center w-full">
                                    {allTypes.map((type) => (
                                        <label
                                            key={type}
                                            className={`flex items-center gap-3 px-3 py-2 outline-white cursor-pointer transition-all rounded-xl text-3xs ${
                                                pendingSelectedTypes.includes(type) ? 'bg-white/10' : 'hover:bg-white/5'
                                            }`}
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={pendingSelectedTypes.includes(type)}
                                                    onChange={() => handleTypeToggle(type)}
                                                    className="w-5 h-5 cursor-pointer bg-transparent border-2 border-white rounded-sm focus:ring-white focus:ring-2 appearance-none hover:border-white/60 transition-colors"
                                                />
                                                {pendingSelectedTypes.includes(type) && (
                                                    <div className="absolute top-0 left-0 w-5 h-5 flex items-center justify-center pointer-events-none">
                                                        <svg
                                                            className="w-4 h-4 text-white"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-white text-2xs font-medium capitalize">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Sort Mode - Sorting Options with Radio Buttons */
                            <div className="w-full flex flex-col items-start justify-center gap-3">
                                {[
                                    { value: 'number', label: 'Pokedex Number' },
                                    { value: 'name-asc', label: 'Pokemon Name A-Z' },
                                    { value: 'name-desc', label: 'Pokemon Name Z-A' }
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center gap-3 px-3 py-2.5 w-full cursor-pointer transition-all rounded-xl ${
                                            pendingSortBy === option.value ? 'bg-white/10' : 'hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="relative">
                                            <input
                                                type="radio"
                                                name="sort-option"
                                                value={option.value}
                                                checked={pendingSortBy === option.value}
                                                onChange={(e) => handleSortChange(e.target.value)}
                                                className="w-5 h-5 cursor-pointer bg-transparent border-2 border-white rounded-full focus:ring-white focus:ring-2 appearance-none hover:border-white/60 transition-colors"
                                            />
                                            {pendingSortBy === option.value && (
                                                <div className="absolute top-0 left-0 w-5 h-5 flex items-center justify-center pointer-events-none">
                                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-white text-sm font-medium">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </PopUpModal>
            </>
        );
    }

    return (
        <div className="w-[22vw] bg-[#231502]/20 backdrop-blur-xs rounded-2xl p-4 shadow-lg justify-center items-center h-fit gap-4 flex flex-col max-w-[415px]">
            {/* Header with expand/collapse button */}
            <PokemonSearch />

            <div className="h-[1px] flex w-full bg-[#FFFCE9]/30"></div>

            {/* Expandable content */}
            <div
                className=" flex flex-col items-start  justify-center gap-4 w-full"
                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
            >
                {/* Type Filters */}
                <div className="w-full flex flex-col items-start justify-center gap-2">
                    <div className="flex items-center justify-between flex-col gap-2 w-full">
                        <div className="flex items-center justify-between w-full gap-2">
                            <label className="text-white/90 text-xs font-medium">Filter by Type</label>
                            {/* {selectedTypes.length > 0 && (
                            <span className="ml-2 text-purple-300">({selectedTypes.length} selected)</span>
                            )} */}
                            {/* {selectedTypes.length > 0 && ( */}
                            <button
                                onClick={handleClearFilters}
                                className={`text-2xs text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed  ${
                                    selectedTypes.length >= 1 ? 'opacity-100 cursor-pointer hover:text-white/40' : ''
                                }`}
                                disabled={selectedTypes.length === 0}
                            >
                                Clear All
                            </button>
                            {/* )} */}
                        </div>
                        <div className="h-[1px] flex w-full bg-[#FFFCE9]/30"></div>
                    </div>
                    <div className="grid grid-cols-2 justify-between items-center w-full">
                        {allTypes.map((type) => (
                            <label
                                key={type}
                                className={`flex items-center gap-2 px-2 py-1.5 outline-white cursor-pointer transition-all rounded-2xl`}
                            >
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleTypeToggle(type)}
                                        className="w-4 h-4 cursor-pointer bg-transparent border-2 border-white rounded-sm focus:ring-white focus:ring-2 appearance-none hover:border-white/40 transition-colors"
                                    />
                                    {selectedTypes.includes(type) && (
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
                                <span className="text-white text-2xs font-medium capitalize">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="h-[1px] flex w-full bg-[#FFFCE9]/30"></div>

                {/* Sort Options */}
                <div className="flex flex-col items-start justify-center gap-2 w-full">
                    <label className="text-white/90 text-xs font-medium block gap-2">Sorting By</label>
                    <div className="h-[1px] flex w-full bg-[#FFFCE9]/30 max-w-[20%]"></div>

                    <div className="flex flex-wrap gap-2 w-full">
                        <div className="relative w-full">
                            <select
                                className="w-full p-1.5 rounded-lg text-2xs font-medium transition-all bg-white/20 text-white/80 hover:bg-white/30 px-5 py-2 pr-10 appearance-none cursor-pointer shadow-md shadow-black/40"
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="number">Pokedex Number</option>
                                <option value="name-asc">Pokemon Name A-Z</option>
                                <option value="name-desc">Pokemon Name Z-A</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-white/80"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
