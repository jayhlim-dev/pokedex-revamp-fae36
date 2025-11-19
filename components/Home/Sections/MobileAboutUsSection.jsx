import CheckDevice from 'components/utils/CheckDevice';
import Image from 'next/image';
import Orico from 'public/accessories/orico.png';
import PokeballBg from 'public/accessories/pokeball-bg.png';
import { useEffect } from 'react';
import { trackSectionView } from 'utils/trackingUtils';
export default function MobileAboutUsSection({ index = 4 }) {
    const section = {
        title: 'Built By Trainers, For Trainers',
        desc: "Hi, I'm Jason the developer behind this project. PokeVee is a fan-made Pokedex, powered by data from the amazing PokéAPI. All Pokémon names, stats, and images used here are publicly provided through their API",
        secondary_desc:
            'This site is created purely for fun and educational purposes. Im just a huge fan of Pokémon especially Pokémon GO. Fun fact: I once did 45 Azelf raids just to get a shiny Azelf and yes, I finally got it.',
        tertiary_desc:
            'All design, code, and presentation are my own original work. Thanks for visiting I hope you enjoy the experience as much as I enjoyed building it! This is a fan project and is not affiliated with, endorsed, or sponsored by Nintendo, Game Freak, or The Pokémon Company.',
        footer: '© 2025 PokeVee by Jason. All rights reserved. This fan project is powered by PokéAPI.'
    };

    useEffect(() => {
        trackSectionView('About Us', index);
    }, [index]);

    return (
        <div className="relative capitalize bg-black">
            <div className="absolute inset-0 bg-[url('/accessories/pokeball-bg.png')] bg-no-repeat bg-center bg-cover z-0"></div>
            <div className="absolute left-[-10%] top-[3%] h-screen w-auto flex items-center">
                <Image
                    src={Orico}
                    alt="pokemon bag"
                    className="!h-full !w-auto !object-contain animate-rotate-slow"
                    width={500}
                    height={500}
                    priority
                />
            </div>

            <div className="absolute right-[-10%] top-[3%] h-screen w-auto flex items-center">
                <Image
                    src={Orico}
                    alt="pokemon bag"
                    className="!h-full !w-auto !object-contain scale-x-[-1] animate-rotate-slow"
                    width={500}
                    height={500}
                    priority
                />
            </div>

            <div
                className={
                    'relative h-screen flex flex-col justify-center items-center text-white text-center w-screen'
                }
                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
            >
                <div className="flex flex-col gap-18 z-10 justify-center h-full items-center px-8 w-full">
                    <div className="flex flex-col gap-6 items-center justify-center w-full">
                        <div className="flex flex-col">
                            <h1 className="text-2xl">{section.title}</h1>
                        </div>
                        <div className="bg-white h-[2px] w-32"></div>
                    </div>

                    <div className="flex flex-col gap-6 items-center justify-center">
                        <p className="text-3xs leading-relaxed">{section.desc}</p>
                        <p className="text-3xs leading-relaxed">{section.secondary_desc}</p>
                        <p className="text-3xs leading-relaxed opacity-90">{section.tertiary_desc}</p>
                    </div>

                    <div className="bg-white/30 h-[1px] w-full"></div>

                    <p className="text-3xs leading-relaxed opacity-90">{section.footer}</p>
                </div>
            </div>
        </div>
    );
}
