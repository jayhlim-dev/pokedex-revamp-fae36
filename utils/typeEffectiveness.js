// Type effectiveness chart for Pokemon battles
export const typeEffectiveness = {
    normal: { fighting: 2, ghost: 0 },
    fire: { fire: 0.5, water: 2, grass: 0.5, ice: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    water: { fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, steel: 0.5 },
    electric: { electric: 0.5, grass: 0.5, ground: 2, flying: 0.5, steel: 0.5 },
    grass: {
        fire: 2,
        water: 0.5,
        grass: 0.5,
        electric: 0.5,
        ice: 2,
        poison: 2,
        ground: 0.5,
        flying: 2,
        bug: 2,
        rock: 0.5,
        dragon: 0.5,
        steel: 0.5
    },
    ice: { fire: 2, water: 0.5, grass: 0.5, ice: 0.5, fighting: 2, rock: 2, steel: 2 },
    fighting: {
        normal: 0.5,
        ice: 0.5,
        poison: 0.5,
        flying: 2,
        psychic: 2,
        bug: 0.5,
        rock: 0.5,
        ghost: 0,
        dark: 0.5,
        steel: 0.5,
        fairy: 2
    },
    poison: {
        grass: 0.5,
        fighting: 0.5,
        poison: 0.5,
        ground: 2,
        bug: 0.5,
        rock: 0.5,
        ghost: 0.5,
        steel: 0,
        fairy: 0.5
    },
    ground: { fire: 0.5, electric: 0, grass: 2, ice: 2, poison: 0.5, flying: 0, bug: 0.5, rock: 0.5, steel: 0.5 },
    flying: { electric: 2, grass: 0.5, ice: 2, fighting: 0.5, bug: 0.5, rock: 2, steel: 0.5 },
    psychic: { fighting: 0.5, poison: 0.5, psychic: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    bug: {
        fire: 2,
        grass: 0.5,
        fighting: 0.5,
        poison: 0.5,
        flying: 2,
        psychic: 0.5,
        ghost: 0.5,
        dark: 0.5,
        steel: 0.5,
        fairy: 0.5
    },
    rock: { fire: 0.5, water: 2, grass: 2, fighting: 2, poison: 0.5, ground: 2, flying: 0.5, bug: 2, steel: 2 },
    ghost: { normal: 0, fighting: 0, poison: 0.5, bug: 0.5, ghost: 2, dark: 2, steel: 0.5, fairy: 0.5 },
    dragon: { fire: 0.5, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, dragon: 2, steel: 0.5, fairy: 2 },
    dark: { fighting: 2, poison: 0.5, bug: 2, ghost: 0.5, psychic: 0, dark: 0.5, steel: 0.5, fairy: 2 },
    steel: {
        fire: 2,
        water: 0.5,
        electric: 0.5,
        ice: 0.5,
        fighting: 2,
        poison: 0,
        ground: 2,
        flying: 0.5,
        psychic: 0.5,
        bug: 0.5,
        rock: 0.5,
        dragon: 0.5,
        dark: 0.5,
        steel: 0.5,
        fairy: 0.5
    },
    fairy: { fire: 0.5, fighting: 0.5, poison: 2, dragon: 0, dark: 0.5, steel: 2, fairy: 0.5 }
};

/**
 * Calculate weaknesses for a Pokemon based on its types
 * @param {Array} pokemonTypes - Array of Pokemon type objects
 * @returns {Array} Array of [type, multiplier] pairs sorted by damage multiplier
 */
export const getWeaknesses = (pokemonTypes) => {
    const weaknesses = {};

    pokemonTypes.forEach((typeInfo) => {
        const type = typeInfo.type.name;
        const effectiveness = typeEffectiveness[type] || {};

        Object.entries(effectiveness).forEach(([attackingType, multiplier]) => {
            if (multiplier > 1) {
                weaknesses[attackingType] = (weaknesses[attackingType] || 1) * multiplier;
            }
        });
    });

    return Object.entries(weaknesses)
        .filter(([_, multiplier]) => multiplier > 1)
        .sort((a, b) => b[1] - a[1]);
};
