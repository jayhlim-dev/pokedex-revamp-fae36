import CheckDevice from 'components/utils/CheckDevice';
import Image from 'next/image';
import { useEffect } from 'react';
import { trackSectionView } from 'utils/trackingUtils';
export default function MobilePopularPokemonSection({ index = 3 }) {
    const section = {
        title: 'Legends We',
        subtitle: 'Grew Up With',
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
            top_pokemon: ['Charizard', 'Gengar', 'Bulbasaur', 'Pikachu'],
            desc: 'Kanto began the legend. Charizard fire roared, Gengar grin haunted, and Pikachu spark lit our hearts.',
            image: '/images/home/popular/kanto.png'
        },
        {
            map_name: 'Hoenn',
            top_pokemon: ['Turtwig', 'Bidoof', 'Kecleon', 'Shinx'],
            desc: 'Hoenn balanced power and grace. Rayquaza soared, Gardevoir shined, and Sceptile with Flygon fought beautifully.',
            image: '/images/home/popular/hoenn.png'
        },
        {
            map_name: 'Sinnoh',
            top_pokemon: ['Lucario', 'Garchomp', 'Luxray', 'Piplup'],
            desc: 'Sinnoh shaped destiny. Lucario stood brave, Garchomp struck fierce, and Luxray’s glare sparked awe.',
            image: '/images/home/popular/sinnoh.png'
        },
        {
            map_name: 'Alola',
            top_pokemon: ['Mimikyu', 'Rowlet', 'Decidueye', 'Lycanroc'],
            desc: 'Alola glowed with spirit. Mimikyu hid its heart, Rowlet charmed, and Lycanroc howled with passion.',
            image: '/images/home/popular/alola.png'
        }
    ];

    return (
        <div className="relative capitalize">
            <div className={'absolute h-screen flex z-0 w-full blur-xs'}></div>

            <div className={'relative h-screen flex flex-col justify-center  text-white text-center'}>
                <div className="absolute inset-0 bg-[url('/images/home/xl/mobile/mobile-pokemon-land-xl.png')] bg-repeat-round bg-contain z-0"></div>
                <div className="flex flex-col justify-between z-10 h-full items-center py-[20%]">
                    <div className="flex flex-col gap-4 items-center justify-center w-full">
                        <div className="flex flex-col">
                            <h1 className="text-2xl">{section.title}</h1>
                            <h1 className="text-3xl">{section.subtitle}</h1>
                        </div>
                        <p className="text-3xs max-w-2xl px-[15%]">{section.desc}</p>
                    </div>

                    <div className="w-full flex gap-8 h-fit overflow-x-auto pl-[8%] scrollbar-hide">
                        {popularPokemon.map((pokemon) => (
                            <div
                                key={pokemon.map_name}
                                className="flex flex-col max-w-[15vw] bg-[#0A0A06]/40 border-2 border-white/50 rounded-lg min-w-[330px]"
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-4 border-b-white/50 border-b-2 px-3 py-2">
                                        <h1 className="text-sm uppercase">{pokemon.map_name}</h1>

                                        <div className="flex flex-col justify-start items-start">
                                            <h1 className="text-3xs">Top Pokémon:</h1>
                                            <p className="text-4xs leading-16 -tracking-tighter  uppercase text-start">
                                                {pokemon.top_pokemon.join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full !min-w-[325px] max-w-[15vw]">
                                        <Image src={pokemon.image} alt={pokemon.map_name} width={350} height={350} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 w-full py-3 px-5 h-full text-justify">
                                    <p className="text-3xs text-start leading-relaxed tracking-wide drop-shadow-lg">
                                        {pokemon.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-3xs px-[10%]">{section.secondary_desc}</p>
                </div>
            </div>
        </div>
    );
}
