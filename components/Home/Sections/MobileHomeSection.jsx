import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PokemonLogo from 'public/images/logo/main-gengar-char.png';
import { useEffect } from 'react';
import { trackButtonClick, trackSectionView } from 'utils/trackingUtils';

export default function MobileHomeSection({ index = 0, userDevice }) {
    const router = useRouter();
    useEffect(() => {
        trackSectionView('Home', index);
    }, [index]);

    const section = {
        title: 'PokeHex',
        desc: 'It`s still a Pokédex just not how they remember it',
        background: '/images/home/home-background.png',
        background_xl: '/images/home/xl/home-background-xl.png'
    };

    const handlePokedexClick = () => {
        // Track the button click
        trackButtonClick('Explore the Pokédex', '/pokedex', 'Home');

        // Navigate to pokedex
        router.push('/pokedex');
    };

    return (
        <div className="relative capitalize">
            <div className={'absolute h-screen flex z-0 w-full blur-xs'}></div>

            <div className={'relative h-screen flex flex-col justify-center items-center text-white text-center'}>
                <div className="absolute inset-0 bg-[url('/images/home/xl/mobile/mobile-home-background-xl.png')] bg-repeat-round bg-contain z-10"></div>

                <div
                    className={`flex flex-col gap-[35%] z-20 bg-center items-center justify-between h-[100%] ${
                        userDevice === 'large-desktop' ? 'pt-[12%] pb-[4%]' : 'pt-[30%] pb-[8%]'
                    } `}
                >
                    <div className="flex flex-col z-20" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
                        <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
                        <div className="flex flex-col">
                            <p className="text-2xs">It`s still a Pokédex</p>
                            <p className="text-2xs">just not how they remember it</p>
                        </div>
                    </div>

                    <div className="w-full h-full flex flex-col items-center justify-center gap-[30%]">
                        <div className="w-32 h-[6.5rem]">
                            <Image
                                src={PokemonLogo}
                                alt="pokemon logo"
                                className="w-full h-full object-contain rounded-lg"
                                width={300}
                                height={319}
                                priority
                            />
                        </div>

                        <div className="cursor-pointer bg-black/75 px-16 rounded-sm py-3 shadow-md shadow-black/40" onClick={handlePokedexClick}>
                            <p className="text-3xs">Explore the Pokédex</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
