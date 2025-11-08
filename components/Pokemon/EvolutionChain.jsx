'use client';
import clsx from 'clsx';
import { getPokemonTypeColor } from 'constants/pokemonTypes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Pagination, Mousewheel } from 'swiper/modules';
import { trackPokemonEvent } from 'utils/trackingUtils';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import 'swiper/css/pagination';
import CheckDevice from 'components/utils/CheckDevice';

/**
 * EvolutionChain component displays Pokemon evolution chain
 * @param {Array} evolutions - Array of evolution data
 * @param {string} currentPokemonName - Name of current Pokemon
 */
export default function EvolutionChain({ evolutions, currentPokemonName }) {
    // Toggle for new interface - change this to true to see the new interface
    const USE_NEW_INTERFACE = true;
    const userDevice = CheckDevice();
    const isMobile = userDevice && userDevice.includes('mobile');
    const prevButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const swiperInstanceRef = useRef(null);

    const otherEvolutions = (evolutions ?? []).filter((evo) => evo.name !== currentPokemonName);

    useEffect(() => {
        const swiper = swiperInstanceRef.current;
        if (!swiper || !prevButtonRef.current || !nextButtonRef.current) {
            return;
        }

        if (typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation.prevEl = prevButtonRef.current;
            swiper.params.navigation.nextEl = nextButtonRef.current;
        }

        if (swiper.navigation) {
            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
        }
    }, [otherEvolutions.length, isMobile]);

    if (!evolutions || evolutions.length === 0) {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex flex-col text-xs font-bold">Evolution Chain</div>
                <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>
                <div className="text-2xs text-center text-white/70">No evolution data available</div>
            </div>
        );
    }

    if (otherEvolutions.length === 0) {
        return (
            <div className={clsx('flex flex-col gap-2 h-full', isMobile ? '!gap-4 !px-4 !text-3xs' : '')}>
                <div className="flex flex-col text-xs font-bold">Evolution Chain</div>
                <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>
                <div className="flex h-full items-center justify-center pb-6">
                    <div className="text-2xs text-center text-white/70">This Pokemon has no evolutions</div>
                </div>
            </div>
        );
    }

    return (
        <div className={clsx('flex flex-col gap-2 h-full', isMobile ? '!gap-4 !px-4 !text-3xs' : '')}>
            <div className="flex flex-col text-xs font-bold">Evolution Chain</div>
            <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>

            <div className="relative w-full h-full">
                <button
                    ref={prevButtonRef}
                    className="random-nav-button evolution-nav-button evolution-nav-prev"
                    type="button"
                    aria-label="Previous evolution"
                >
                    <span className="random-nav-arrow">‹</span>
                </button>
                <Swiper
                    className={clsx(
                        'flex items-center w-full h-full min-h-[102px] overflow-x-auto evolution-swiper',
                        isMobile ? 'max-w-[90vw] !h-[180px]' : ''
                    )}
                    // activeSlideIndex={5}
                    initialSlide={0}
                    direction={'horizontal'}
                    // speed={1000}
                    // spaceBetween={10}
                    slidesPerView={otherEvolutions.length === 2 ? 2 : isMobile ? 1.7 : 2.5}
                    allowTouchMove={true}
                    wrapperClass={otherEvolutions.length === 2 && !isMobile ? 'justify-between flex w-full' : ''}
                    grabCursor={true}
                    resistance={true}
                    navigation={{ prevEl: prevButtonRef.current, nextEl: nextButtonRef.current }}
                    onSwiper={(swiper) => {
                        swiperInstanceRef.current = swiper;
                    }}
                    modules={[Navigation]}
                >
                    {otherEvolutions.map((evolution, index) => {
                        const evolutionDetail = evolution.evolutionDetails[0];
                        const triggerText = getEvolutionTriggerText(evolutionDetail);

                        return (
                            <SwiperSlide className="relative" key={evolution.name + index}>
                                {/* <Fragment key={evolution.name + index}> */}
                                <div className="flex items-center gap-3 w-full min-w-[144px] flex-shrink-0">
                                    {/* Evolution Pokemon */}
                                    <div className="flex flex-col items-center gap-2 w-full">
                                        {/* Pokemon evolution display */}
                                        <Link
                                            href={`/pokemon/${evolution.name}`}
                                            onClick={() =>
                                                trackPokemonEvent('evolution_click', evolution.name, {
                                                    from_pokemon: currentPokemonName,
                                                    trigger: triggerText,
                                                    evolution_index: index,
                                                    evolution_chain_length: otherEvolutions.length,
                                                    ui_variant: USE_NEW_INTERFACE ? 'new' : 'current'
                                                })
                                            }
                                            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity w-full no-underline"
                                        >
                                            <div className="flex flex-col justify-center items-center gap-1">
                                                <div className="max-w-[120px] max-h-[120px]">
                                                    <Image
                                                        src={
                                                            evolution.pokemon.sprites.other?.['official-artwork']
                                                                ?.front_default
                                                        }
                                                        alt={evolution.name}
                                                        width={120}
                                                        height={120}
                                                        className="hover:scale-110 transition-transform w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="text-2xs w-full text-center capitalize font-medium text-white gap-1 flex items-center justify-center flex-col">
                                                    {evolution.name}
                                                    {triggerText && (
                                                        <div className="text-3xs text-center  capitalize text-gray">
                                                            {triggerText}
                                                        </div>
                                                    )}
                                                    {isMobile && (
                                                        <div className="text-2xs w-full text-center capitalize text-gray">
                                                            {evolution.pokemon.types?.map((type, typeIndex) => (
                                                                <span
                                                                    key={typeIndex}
                                                                    className="text-3xs px-2 py-1 rounded-full text-white font-medium capitalize"
                                                                    style={{
                                                                        backgroundColor: `#${getPokemonTypeColor(
                                                                            type.type.name
                                                                        )}`
                                                                    }}
                                                                >
                                                                    {type.type.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                {/* Divider between evolutions */}
                                {index < otherEvolutions.length - 1 && (
                                    <div
                                        className={clsx(
                                            'w-[1.5px] shadow-md shadow-black/40 flex h-[80%] bg-[#FFFCE9]/30 min-h-[72px] flex-shrink-0 absolute top-[20px] right-[-6px]',
                                            otherEvolutions.length === 2 && !isMobile ? '!right-[-50px]' : ''
                                        )}
                                    ></div>
                                )}
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <button
                    ref={nextButtonRef}
                    className="random-nav-button evolution-nav-button evolution-nav-next"
                    type="button"
                    aria-label="Next evolution"
                >
                    <span className="random-nav-arrow">›</span>
                </button>
            </div>
            {/* </div> */}
        </div>
    );
}

/**
 * Get evolution trigger text from evolution details
 * @param {Object} evolutionDetail - Evolution detail object
 * @returns {string} Formatted trigger text
 */
function getEvolutionTriggerText(evolutionDetail) {
    if (!evolutionDetail) return null;

    const { trigger, min_level, item, min_happiness, time_of_day, known_move_type, location } = evolutionDetail;

    switch (trigger.name) {
        case 'level-up':
            if (min_level) {
                return `Level ${min_level}`;
            }
            return 'Level up';

        case 'use-item':
            return `Use ${item?.name?.replace('-', ' ') || 'item'}`;

        case 'trade':
            return 'Trade';

        case 'shed':
            return 'Shed (Level 20)';

        case 'other':
            if (min_happiness) {
                return `High friendship`;
            }
            return 'Special condition';

        default:
            return trigger.name.replace('-', ' ');
    }
}
