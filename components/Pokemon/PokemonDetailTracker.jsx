'use client';

import { useEffect } from 'react';
import { trackSectionView, trackPokemonEvent } from 'utils/trackingUtils';

export default function PokemonDetailTracker({ pokemonName, evolutionChainLength, device = 'desktop' }) {
    useEffect(() => {
        if (!pokemonName) return;
        trackSectionView('Pokemon Detail', null, { pokemonName, evolution_chain_length: evolutionChainLength, device });
        trackPokemonEvent('view_pokemon_detail', pokemonName, { evolution_chain_length: evolutionChainLength, device });
    }, [pokemonName, evolutionChainLength, device]);

    return null;
}
