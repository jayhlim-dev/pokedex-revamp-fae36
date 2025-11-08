/**
 * Google Analytics tracking utility functions
 * Provides reusable functions for tracking page views and events
 */

/**
 * Track a page view event
 * @param {Object} params - Tracking parameters
 * @param {string} params.pageTitle - Title of the page/section
 * @param {string} params.sectionName - Name of the section (e.g., 'journey', 'home', 'pokedex')
 * @param {number} [params.sectionIndex] - Index/position of the section
 * @param {string} [params.pageLocation] - URL location (defaults to current location)
 * @param {Object} [params.customData] - Additional custom data to track
 */
export const trackPageView = (params) => {
    if (typeof window !== 'undefined' && window.gtag) {
        const {
            pageTitle,
            sectionName,
            sectionIndex,
            pageLocation = window.location.href,
            customData = {}
        } = params;

        window.gtag('event', 'page_view', {
            page_title: pageTitle,
            page_location: pageLocation,
            section_name: sectionName,
            section_index: sectionIndex,
            ...customData
        });
    }
};

/**
 * Track a custom event
 * @param {string} eventName - Name of the event to track
 * @param {Object} params - Event parameters
 * @param {string} [params.eventCategory] - Category of the event
 * @param {string} [params.eventLabel] - Label for the event
 * @param {number} [params.value] - Numeric value associated with the event
 * @param {Object} [params.customData] - Additional custom data to track
 */
export const trackEvent = (eventName, params = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        const {
            eventCategory,
            eventLabel,
            value,
            customData = {},
            
        } = params;

        window.gtag('event', eventName, {
            event_category: eventCategory,
            event_label: eventLabel,
            value: value,
            ...customData
        });
    }
};

/**
 * Track section visibility (useful for scroll tracking)
 * @param {string} sectionName - Name of the section
 * @param {number} [sectionIndex] - Index of the section
 * @param {Object} [customData] - Additional custom data
 */
export const trackSectionView = (sectionName, sectionIndex = null, customData = {}) => {
    trackPageView({
        pageTitle: `${sectionName} Section`,
        sectionName,
        sectionIndex,
        customData
    });
};
 
/**
 * Track Pokemon-related events
 * @param {string} eventType - Type of Pokemon event (view, search, filter, etc.)
 * @param {string} pokemonName - Name of the Pokemon
 * @param {Object} [additionalData] - Additional data to track
 */
export const trackPokemonEvent = (eventType, pokemonName, additionalData = {}) => {
    trackEvent(`pokemon_${eventType}`, {
        eventCategory: 'pokemon',
        eventLabel: pokemonName,
        customData: {
            pokemon_name: pokemonName,
            ...additionalData
        }
    });
};

/**
 * Track Pokemon search interactions
 * @param {Object} params
 * @param {('manual_submit'|'suggestion_click'|'suggestion_keyboard')} params.source - How the search was triggered
 * @param {string} params.typedQuery - The user typed query
 * @param {string} params.selectedName - The final selected Pokemon name
 * @param {number} [params.suggestionIndex] - Index of selected suggestion (if applicable)
 * @param {number} [params.suggestionsCount] - Number of suggestions shown (if applicable)
 * @param {Object} [params.additionalData] - Extra data
 */
export const trackPokemonSearch = ({
    source,
    typedQuery,
    selectedName,
    suggestionIndex,
    suggestionsCount,
    additionalData = {}
}) => {
    trackEvent('pokemon_search', {
        eventCategory: 'pokemon_search',
        eventLabel: selectedName || typedQuery,
        customData: {
            source,
            typed_query: typedQuery,
            selected_name: selectedName,
            suggestion_index: typeof suggestionIndex === 'number' ? suggestionIndex : undefined,
            suggestions_count: typeof suggestionsCount === 'number' ? suggestionsCount : undefined,
            ...additionalData
        }
    });
};

/**
 * Track Pokedex-related events
 * @param {string} eventType - Type of Pokedex event (view, filter, search, etc.)
 * @param {string} region - Region name
 * @param {Object} [additionalData] - Additional data to track
 */
export const trackPokedexEvent = (eventType, region = null, additionalData = {}) => {
    trackEvent(`pokedex_${eventType}`, {
        eventCategory: 'pokedex',
        eventLabel: region,
        customData: {
            region,
            ...additionalData
        }
    });
};

/**
 * Track button click events
 * @param {string} buttonName - Name/identifier of the button
 * @param {string} [route] - Route/URL the button navigates to
 * @param {string} [section] - Section where the button is located
 * @param {Object} [additionalData] - Additional data to track
 */
export const trackButtonClick = (buttonName, route = null, section = null, additionalData = {}) => {
    trackEvent('button_click', {
        eventCategory: 'ui_interaction',
        eventLabel: buttonName,
        customData: {
            button_name: buttonName,
            route: route,
            section: section,
            ...additionalData
        }
    });
};

/**
 * Track Pokedex filter interactions
 * @param {Object} params
 * @param {('filter_apply'|'filter_clear'|'sort_change')} params.action - Type of filter action
 * @param {string[]} params.selectedTypes - Array of selected type filters
 * @param {string} [params.sortBy] - Current sort option
 * @param {number} [params.resultCount] - Number of Pokemon after filtering
 * @param {number} [params.totalCount] - Total number of Pokemon before filtering
 * @param {string} [params.region] - Pokedex region name
 * @param {Object} [params.additionalData] - Extra data
 */
export const trackPokedexFilter = ({
    action,
    selectedTypes = [],
    sortBy,
    resultCount,
    totalCount,
    region,
    additionalData = {}
}) => {
    trackEvent('pokedex_filter', {
        eventCategory: 'pokedex_filter',
        eventLabel: action,
        customData: {
            action,
            selected_types: selectedTypes,
            types_count: selectedTypes.length,
            sort_by: sortBy,
            result_count: typeof resultCount === 'number' ? resultCount : undefined,
            total_count: typeof totalCount === 'number' ? totalCount : undefined,
            has_zero_results: typeof resultCount === 'number' ? resultCount === 0 : undefined,
            region: region,
            ...additionalData
        }
    });
};


