'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { trackPokemonEvent, trackError } from 'utils/trackingUtils';

export default function PokemonCryButton({ pokemon }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [error, setError] = useState(null);

    const cryUrl = useMemo(() => {
        // PokeAPI exposes cries on the pokemon resource (latest/legacy)
        return pokemon?.cries?.latest || pokemon?.cries?.legacy || null;
    }, [pokemon]);

    useEffect(() => {
        setIsAvailable(Boolean(cryUrl));
        setError(null);
        setIsPlaying(false);
    }, [cryUrl]);

    const onPlay = async () => {
        if (!isAvailable) return;
        try {
            if (!audioRef.current) {
                audioRef.current = new Audio(cryUrl);
                audioRef.current.onended = () => setIsPlaying(false);
                audioRef.current.onerror = () => {
                    setIsPlaying(false);
                    setError('Failed to play');
                    // Track cry play error
                    trackError({
                        errorType: 'cry_play_error',
                        pokemonName: pokemon?.name,
                        errorMessage: 'Audio playback failed',
                        url: cryUrl,
                        additionalData: {
                            pokemon_id: pokemon?.id,
                            source: 'header_button'
                        }
                    });
                };
            }

            // If already playing, restart from beginning
            if (!audioRef.current.paused) {
                audioRef.current.currentTime = 0;
            }

            await audioRef.current.play();
            setIsPlaying(true);
            trackPokemonEvent('cry_play', pokemon?.name, { pokemon_id: pokemon?.id, source: 'header_button' });
        } catch (e) {
            setIsPlaying(false);
            setError('Failed to play');
            // Track cry play error
            trackError({
                errorType: 'cry_play_error',
                pokemonName: pokemon?.name,
                errorMessage: e.message || String(e),
                url: cryUrl,
                additionalData: {
                    pokemon_id: pokemon?.id,
                    source: 'header_button',
                    error_type_name: e.name || 'Error'
                }
            });
        }
    };

    if (!isAvailable) return null;

    return (
        <button
            type="button"
            onClick={onPlay}
            className="ml-4 px-2 py-1 text-3xs rounded-md border border-white/30 hover:border-white/60 text-white/90 hover:text-white transition-all shadow-md shadow-black/40"
            aria-label="Play Pokémon cry"
            title="Play cry"
        >
            {isPlaying ? 'Playing…' : 'Play cry'}
        </button>
    );
}
