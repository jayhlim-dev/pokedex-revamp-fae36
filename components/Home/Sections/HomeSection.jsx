import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PokemonLogo from 'public/images/logo/main-gengar-char.png';
import Cloud1 from 'public/images/cloud1.png';
import Cloud2 from 'public/images/cloud2.png';
import { useEffect, useState } from 'react';
import { trackButtonClick, trackSectionView } from 'utils/trackingUtils';

export default function HomeSection({ index = 0, userDevice }) {
    const router = useRouter();
    const [cloudPositions, setCloudPositions] = useState([]);

    useEffect(() => {
        trackSectionView('Home', index);

        // Generate random positions for clouds on mount - keep them in top 10% for sky effect
        // Desktop version has more clouds (8 total)
        const positions = [
            { top: Math.random() * 10, delay: Math.random() * -15 }, // 0-10%
            { top: Math.random() * 10, delay: Math.random() * -70 },
            { top: Math.random() * 10, delay: Math.random() * -75 },
            { top: Math.random() * 10, delay: Math.random() * -80 },
            { top: Math.random() * 10, delay: Math.random() * -45 },
            { top: Math.random() * 10, delay: Math.random() * -60 },
            { top: Math.random() * 10, delay: Math.random() * -55 },
            { top: Math.random() * 10, delay: Math.random() * -85 }
        ];
        setCloudPositions(positions);
    }, [index]);

    const section = {
        title: 'PokeVee',
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

            {/* Animated Clouds */}
            <div className="absolute inset-0 overflow-hidden z-50 max-h-[30em]">
                {cloudPositions.length > 0 && (
                    <>
                        {/* Cloud 1 - Medium */}
                        <div
                            className="absolute cloud-animate-1 w-[200px] h-auto"
                            style={{
                                top: `${cloudPositions[0]?.top || 3}%`,
                                right: '-200px',
                                opacity: 0.5,
                                animationDelay: `${cloudPositions[0]?.delay || 0}s`
                            }}
                        >
                            <Image
                                src={Cloud1}
                                alt="cloud 1"
                                className="w-full h-auto object-contain"
                                width={200}
                                height={100}
                            />
                        </div>
                        {/* Cloud 2 - Large */}
                        <div
                            className="absolute cloud-animate-2 w-[300px] h-auto"
                            style={{
                                top: `${cloudPositions[1]?.top || 2}%`,
                                right: '-300px',
                                opacity: 0.6,
                                animationDelay: `${cloudPositions[1]?.delay || 0}s`
                            }}
                        >
                            <Image
                                src={Cloud2}
                                alt="cloud 2"
                                className="w-full h-auto object-contain"
                                width={300}
                                height={200}
                            />
                        </div>
                        {/* Cloud 3 - Small */}
                        <div
                            className="absolute cloud-animate-3 w-[150px] h-auto"
                            style={{
                                top: `${cloudPositions[2]?.top || 5}%`,
                                right: '-150px',
                                opacity: 0.4,
                                animationDelay: `${cloudPositions[2]?.delay || 0}s`
                            }}
                        >
                            <Image
                                src={Cloud1}
                                alt="cloud 3"
                                className="w-full h-auto object-contain"
                                width={150}
                                height={75}
                            />
                        </div>
                        {/* Cloud 4 - Medium */}
                        <div
                            className="absolute cloud-animate-4 w-[250px] h-auto"
                            style={{
                                top: `${cloudPositions[3]?.top || 7}%`,
                                right: '-250px',
                                opacity: 0.5,
                                animationDelay: `${cloudPositions[3]?.delay || 0}s`
                            }}
                        >
                            <Image
                                src={Cloud2}
                                alt="cloud 4"
                                className="w-full h-auto object-contain"
                                width={250}
                                height={167}
                            />
                        </div>
                        {/* Cloud 5 - Small */}
                        <div
                            className="absolute cloud-animate-5 w-[180px] h-auto"
                            style={{
                                top: `${cloudPositions[4]?.top || 4}%`,
                                right: '-180px',
                                opacity: 0.45,
                                animationDelay: `${cloudPositions[4]?.delay || 0}s`
                            }}
                        >
                            <Image
                                src={Cloud1}
                                alt="cloud 5"
                                className="w-full h-auto object-contain"
                                width={180}
                                height={90}
                            />
                        </div>
                        {/* Cloud 6 - Medium (Desktop extra) */}
                        <div
                            className="absolute cloud-animate-6 w-[220px] h-auto"
                            style={{
                                top: `${cloudPositions[5]?.top || 6}%`,
                                right: '-220px',
                                opacity: 0.5,
                                animationDelay: `${cloudPositions[5]?.delay || 0}s`
                            }}
                        >
                            <Image
                                src={Cloud2}
                                alt="cloud 6"
                                className="w-full h-auto object-contain"
                                width={220}
                                height={147}
                            />
                        </div>
                        {/* Cloud 7 - Small (Desktop extra) */}
                        <div
                            className="absolute cloud-animate-7 w-[160px] h-auto"
                            style={{
                                top: `${cloudPositions[6]?.top || 8}%`,
                                right: '-160px',
                                opacity: 0.4,
                                animationDelay: `${cloudPositions[6]?.delay || 0}s`
                            }}
                        >
                            <Image
                                src={Cloud1}
                                alt="cloud 7"
                                className="w-full h-auto object-contain"
                                width={160}
                                height={80}
                            />
                        </div>
                        {/* Cloud 8 - Medium (Desktop extra) */}
                        <div
                            className="absolute cloud-animate-8 w-[240px] h-auto"
                            style={{
                                top: `${cloudPositions[7]?.top || 1}%`,
                                right: '-240px',
                                opacity: 0.55,
                                animationDelay: `${cloudPositions[7]?.delay || 0}s`
                            }}
                        >
                            <Image
                                src={Cloud2}
                                alt="cloud 8"
                                className="w-full h-auto object-contain"
                                width={240}
                                height={160}
                            />
                        </div>
                    </>
                )}
            </div>

            <div className={'relative h-screen flex flex-col justify-center items-center text-white text-center'}>
                <div className="absolute inset-0 bg-[url('/images/home/xl/home-background-xl.png')] bg-repeat-round bg-contain z-10"></div>

                <div
                    className={`flex flex-col gap-[35%] z-20 bg-center items-center justify-between h-[100%] ${
                        userDevice === 'large-desktop' ? 'pt-[12%] pb-[4%]' : 'pt-[16%] pb-[8%]'
                    } `}
                >
                    <div className="flex flex-col gap-2 z-20">
                        <h1 className="text-7xl font-bold mb-4">{section.title}</h1>
                        <div className="flex flex-col gap-2">
                            <p className="text-xs">It`s still a Pokédex</p>
                            <p className="text-xs">just not how they remember it</p>
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

                        <div className="cursor-pointer bg-black/50 px-16 rounded-sm py-3" onClick={handlePokedexClick}>
                            <p className="text-3xs">Explore the Pokédex</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
