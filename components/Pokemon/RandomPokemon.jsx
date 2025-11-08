'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { fetchPokemonWithCache } from 'utils/pokemonCache';
import { getPokemonTypeColor } from 'constants/pokemonTypes';
import { trackPokemonEvent } from 'utils/trackingUtils';
import clsx from 'clsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

/**
 * RandomPokemon component displays a random Pokemon suggestion
 * @param {Object} currentPokemon - Current Pokemon data to avoid showing the same Pokemon
 */
export default function RandomPokemon({ currentPokemon, device }) {
    const isMobile = device && device.includes('mobile');
    const [randomPokemon, setRandomPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const SUGGESTIONS_COUNT = isMobile ? 10 : 20;

    useEffect(() => {
        const fetchRandomPokemon = async () => {
            try {
                setLoading(true);
                const pokemonList = [];
                const usedIds = new Set();
                const currentPokemonId = currentPokemon?.id;

                while (pokemonList.length < SUGGESTIONS_COUNT) {
                    const randomId = Math.floor(Math.random() * 1010) + 1;

                    if (usedIds.has(randomId) || randomId === currentPokemonId) {
                        continue;
                    }

                    try {
                        const { data: pokemonData } = await fetchPokemonWithCache(randomId);
                        if (!pokemonData) continue;

                        if (pokemonData.pokemon_species?.name === currentPokemon?.name) {
                            continue;
                        }

                        const transformedData = {
                            name: pokemonData.pokemon_species?.name,
                            sprites: pokemonData.sprites,
                            types: pokemonData.types
                        };

                        pokemonList.push(transformedData);
                        usedIds.add(randomId);
                    } catch (error) {
                        console.error(`Error fetching Pokemon ${randomId}:`, error);
                    }
                }

                setRandomPokemon(pokemonList);
            } catch (error) {
                console.error('Error fetching random Pokemon:', error);
                setRandomPokemon([
                    {
                        name: 'pikachu',
                        sprites: {
                            other: {
                                'official-artwork': {
                                    front_default:
                                        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
                                }
                            }
                        },
                        types: [{ type: { name: 'electric' } }]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomPokemon();
    }, [currentPokemon?.name, currentPokemon?.id, SUGGESTIONS_COUNT]);

    if (loading) {
        return (
            <div className={clsx('flex flex-col gap-2', isMobile ? '!gap-4 !px-4 !text-3xs' : '')}>
                <div className="flex flex-col text-xs font-bold">You Might Like</div>
                <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>
                <div className="flex items-center justify-center gap-2 h-[120px]">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <div
                        className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                        style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                        className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"
                        style={{ animationDelay: '0.4s' }}
                    ></div>
                </div>
            </div>
        );
    }

    if (!randomPokemon || randomPokemon.length === 0) {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex flex-col text-xs font-bold">You Might Like</div>
                <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>
                <div className="text-2xs text-center text-white/70">Unable to load suggestions</div>
            </div>
        );
    }

    const IS_HIDE_SUGGESTIONS_TYPES = true;

    const renderPokemonCard = (pokemon, index) => (
        <div key={`${pokemon.name}-${index}`} className="flex flex-col items-center gap-2 w-full">
            <Link
                href={`/pokemon/${pokemon.name}`}
                onClick={() =>
                    trackPokemonEvent('random_pokemon_click', pokemon.name, {
                        from_pokemon: currentPokemon?.name,
                        index: index || 0,
                        suggestions_count: randomPokemon.length
                    })
                }
                className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity w-full no-underline group"
            >
                <div className="flex flex-col justify-center items-center gap-1">
                    <Image
                        src={
                            pokemon.sprites.other?.['official-artwork']?.front_default ||
                            pokemon.sprites.front_default ||
                            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
                        }
                        alt={pokemon.name}
                        width={120}
                        height={120}
                        className="hover:scale-110 transition-transform max-w-[128px] max-h-[128px]"
                    />
                    <div className="text-2xs w-full text-center capitalize font-medium text-white">{pokemon.name}</div>

                    {!IS_HIDE_SUGGESTIONS_TYPES && (
                        <div
                            className={clsx(
                                'flex gap-1 justify-center items-center',
                                isMobile
                                    ? '!overflow-x-scroll !gap-2 scrollbar-hide max-w-[55vw] !text-3xs'
                                    : 'flex-wrap'
                            )}
                        >
                            {pokemon.types?.map((type, typeIndex) => (
                                <span
                                    key={typeIndex}
                                    className="text-3xs px-2 py-1 rounded-full text-white font-medium capitalize"
                                    style={{
                                        backgroundColor: `#${getPokemonTypeColor(type.type.name)}`
                                    }}
                                >
                                    {type.type.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );

    return (
        <div
            className={clsx(
                'flex flex-col gap-2',
                isMobile ? '!gap-4 !px-4 !text-3xs bg-black/50 py-8 rounded-t-3xl' : ''
            )}
        >
            <div className="flex flex-col text-xs font-bold">You Might Like</div>
            <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>

            {isMobile ? (
                <Swiper
                    className="flex items-center w-full h-full min-h-[180px]"
                    direction="horizontal"
                    initialSlide={0}
                    slidesPerView={1.7}
                    spaceBetween={16}
                    allowTouchMove
                    grabCursor
                    resistance
                >
                    {randomPokemon.map((pokemon, index) => (
                        <SwiperSlide key={`${pokemon.name}-${index}`}>
                            {renderPokemonCard(pokemon, index)}
                            {index < randomPokemon.length - 1 && (
                                <div className="w-[1.5px] shadow-md shadow-black/40 flex h-[80%] bg-[#FFFCE9]/30 min-h-[72px] flex-shrink-0 absolute top-[20px] right-[-10px]"></div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="relative w-full h-full">
                    <button
                        ref={prevButtonRef}
                        className="random-nav-button random-nav-prev"
                        type="button"
                        aria-label="Previous suggested Pokemon"
                    >
                        <span className="random-nav-arrow">‹</span>
                    </button>
                    <Swiper
                        className="random-pokemon-swiper flex items-center w-full h-full"
                        direction="horizontal"
                        initialSlide={0}
                        slidesPerView={isMobile ? 1.7 : 2.7}
                        spaceBetween={24}
                        allowTouchMove
                        grabCursor
                        resistance
                        navigation={{ prevEl: prevButtonRef.current, nextEl: nextButtonRef.current }}
                        onBeforeInit={(swiper) => {
                            if (typeof swiper.params.navigation !== 'boolean') {
                                const navigation = swiper.params.navigation;
                                navigation.prevEl = prevButtonRef.current;
                                navigation.nextEl = nextButtonRef.current;
                            }
                        }}
                        modules={[Navigation]}
                    >
                        {randomPokemon.map((pokemon, index) => (
                            <SwiperSlide key={`${pokemon.name}-${index}`}>
                                {renderPokemonCard(pokemon, index)}
                                {index < randomPokemon.length - 1 && (
                                    <div className="w-[1px] shadow-md shadow-black/40 flex h-[80%] bg-[#FFFCE9]/30 min-h-[72px] flex-shrink-0 absolute top-[20px] right-[-10px]"></div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        ref={nextButtonRef}
                        className="random-nav-button random-nav-next"
                        type="button"
                        aria-label="Next suggested Pokemon"
                    >
                        <span className="random-nav-arrow">›</span>
                    </button>
                </div>
            )}
        </div>
    );
}
