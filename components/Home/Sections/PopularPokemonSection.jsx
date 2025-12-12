import CheckDevice from 'components/utils/CheckDevice';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { trackSectionView } from 'utils/trackingUtils';
export default function PopularPokemonSection({ index = 3 }) {
    const section = {
        title: 'Legends We Grew Up With',
        desc: 'They battled beside us, shaped our journeys, and made us believe in more',
        background: '/images/home/pokemon-land.png',
        background_xl: '/images/home/xl/pokemon-land-xl.png',
        secondary_desc:
            'Sure, legendaries were cool. But these were the ones who stuck with you through every awkward rival fight and wild Zubat ambush'
    };

    useEffect(() => {
        trackSectionView('Popular Pokemon', index);
    }, [index]);

    const popularPokemon = [
        {
            map_name: 'Kanto',
            top_pokemon: ['Charizard', 'Gengar', 'Pikachu'],
            desc: 'Kanto began the legend. Charizard fire roared, Gengar grin haunted, and Pikachu spark lit our hearts.',
            image: '/images/home/popular/kanto.png'
        },
        {
            map_name: 'Hoenn',
            top_pokemon: ['Turtwig', 'Bidoof', 'Shinx'],
            desc: 'Hoenn balanced power and grace. Rayquaza soared, Gardevoir shined, and Sceptile with Flygon fought beautifully.',
            image: '/images/home/popular/hoenn.png'
        },
        {
            map_name: 'Sinnoh',
            top_pokemon: ['Lucario', 'Garchomp', 'Piplup'],
            desc: 'Sinnoh shaped destiny. Lucario stood brave, Garchomp struck fierce, and Luxray’s glare sparked awe.',
            image: '/images/home/popular/sinnoh.png'
        },
        {
            map_name: 'Alola',
            top_pokemon: ['Mimikyu', 'Rowlet', 'Lycanroc'],
            desc: 'Alola glowed with spirit. Mimikyu hid its heart, Rowlet charmed, and Lycanroc howled with passion.',
            image: '/images/home/popular/alola.png'
        }
    ];

    return (
        <div className="relative capitalize">
            <div className={'absolute h-screen flex z-0 w-full blur-xs'}></div>

            <div className={'relative h-screen flex flex-col justify-center items-center text-white text-center'}>
                <div className="absolute inset-0 bg-[url('/images/home/xl/pokemon-land-xl.png')] bg-repeat-round bg-contain z-0"></div>
                <div className="flex flex-col gap-20 z-10 justify-center h-full items-center">
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <div className="flex flex-col">
                            <h2 className="text-2xl">{section.title}</h2>
                        </div>
                        <p className="text-xs max-w-2xl">{section.desc}</p>
                    </div>

                    <div className="w-full flex gap-8">
                        {popularPokemon.map((pokemon) => (
                            <div
                                key={pokemon.map_name}
                                className="flex flex-col max-w-[13vw] bg-[#0A0A06]/40 border border-white rounded-lg min-w-[285px]"
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-6 border-b-white border-b-1 px-4 py-2">
                                        <h3 className="text-lg uppercase">{pokemon.map_name}</h3>

                                        <div className="flex flex-col justify-start items-start">
                                            <div className="text-3xs">Top Pokémon:</div>
                                            <div className="text-4xs leading-16 -tracking-tighter uppercase text-start flex">
                                                {pokemon.top_pokemon.map((name, idx) => (
                                                    <span key={name}>
                                                        <Link
                                                            href={`/pokemon/${name.toLowerCase()}`}
                                                            className="hover:text-primary transition-colors no-underline"
                                                        >
                                                            {name}
                                                        </Link>
                                                        {idx < pokemon.top_pokemon.length - 1 && ', '}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full !min-w-[283px] max-w-[13vw]">
                                        <Image
                                            src={pokemon.image}
                                            alt={pokemon.map_name}
                                            width={350}
                                            height={350}
                                            // className="object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 w-full py-3 px-4">
                                    <p className="text-3xs text-start leading-relaxed tracking-wide drop-shadow-lg">
                                        {pokemon.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs max-w-3xl">{section.secondary_desc}</p>
                </div>
            </div>
        </div>
    );
}
