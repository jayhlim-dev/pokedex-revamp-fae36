// Pokemon type colors and configuration

/**
 * Color mapping for all Pokemon types
 * Colors are in hex format without the # prefix
 */
export const POKEMON_TYPE_COLORS = {
    normal: 'A8A878',
    fire: 'F08030',
    water: '6890F0',
    electric: 'F8D030',
    grass: '78C850',
    ice: '98D8D8',
    fighting: 'C03028',
    poison: 'A040A0',
    ground: 'E0C068',
    flying: 'A890F0',
    psychic: 'F85888',
    bug: 'A8B820',
    rock: 'B8A038',
    ghost: '705898',
    dragon: '7038F8',
    dark: '705848',
    steel: 'B8B8D0',
    fairy: 'EE99AC'
};

/**
 * Get color for a Pokemon type
 * @param {string} type - Pokemon type name
 * @returns {string} Hex color without # prefix
 */
export function getPokemonTypeColor(type) {
    return POKEMON_TYPE_COLORS[type] || POKEMON_TYPE_COLORS.normal;
}

/**
 * Configuration for Pokemon grid display
 */
export const POKEMON_GRID_CONFIG = {
    BATCH_SIZE: 24, // Number of Pokemon to load at a time
    IMAGE_SIZE: 80 // Pokemon sprite size in pixels
};
