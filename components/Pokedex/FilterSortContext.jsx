'use client';

import { createContext, useContext, useState } from 'react';

const FilterSortContext = createContext(null);

export function FilterSortProvider({ children, selectedTypes, setSelectedTypes, sortBy, setSortBy }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <FilterSortContext.Provider
            value={{
                selectedTypes,
                setSelectedTypes,
                sortBy,
                setSortBy,
                isModalOpen,
                openModal,
                closeModal
            }}
        >
            {children}
        </FilterSortContext.Provider>
    );
}

export function useFilterSort() {
    const context = useContext(FilterSortContext);
    // Return null if context doesn't exist (for pages without filter/sort)
    return context;
}

