'use client';
import CacheLogger from 'app/pokedex/cache-logger';
import AboutUsSection from 'components/Home/Sections/AboutUsSection';
import MobileHeader from 'components/MobileHeader';
import Header from 'components/header';
import CheckDevice from 'components/utils/CheckDevice';
import PopUpModal from 'components/utils/PopUpModal';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { trackButtonClick, trackSectionView } from 'utils/trackingUtils';
// import { fetchPokedexWithCache } from 'utils/pokedexCache';

// Helper function to map pokedex names to image filenames
function getPokedexImage(pokedexName) {
    const imageMap = {
        national: 'national.png',
        kanto: 'kanto.png',
        'original-johto': 'jhonto.png',
        'updated-johto': 'jhonto.png',
        'updated-hoenn': 'hoen.png',
        hoenn: 'hoen.png',
        'original-sinnoh': 'sinnoh.png',
        'extended-sinnoh': 'sinnoh.png',
        'original-unova': 'unova.png',
        'updated-unova': 'unova.png',
        'kalos-central': 'kalos central.png',
        'kalos-coastal': 'kalos coastal.png',
        'kalos-mountain': 'kalos mountain.png',
        'original-alola': 'alola island.png',
        'updated-alola': 'alola island.png',
        'original-melemele': 'melemele island.png',
        'original-akala': 'akala island.png',
        'original-ulaula': 'ulaula island.png',
        'original-poni': 'poni island.png',
        'conquest-gallery': 'conquest gallery.png'
    };

    return imageMap[pokedexName] || null;
}

export default function PokedexLocation({ data, searchComponent, fetchInfo }) {
    const userDevice = CheckDevice();
    useEffect(() => {
        trackSectionView('All Pokedex', 0);
    }, []);
    const isMobile = userDevice && userDevice.includes('mobile');
    const [isShowModal, setIsShowModal] = useState(false);

    return (
        <div
            className={`min-h-screen flex flex-col  bg-repeat-round bg-cover z-10 ${
                isMobile
                    ? 'bg-[url("/images/pokedex-page/mobile-pokedex-bg.png")]'
                    : 'bg-[url("/images/pokedex-page/pokedex-bg.png")]'
            }`}
        >
            {fetchInfo && <CacheLogger fetchInfo={fetchInfo} />}

            {userDevice && userDevice.includes('mobile') ? <MobileHeader setIsShowModal={setIsShowModal} /> : <Header />}
            <div
                className={`w-full flex flex-col items-center justify-center gap-10 px-8 ${
                    isMobile ? 'pt-12' : 'pt-28'
                } pb-32`}
            >
                {searchComponent && searchComponent}
                {data ? (
                    <div
                        className={`grid ${
                            userDevice && userDevice.includes('mobile') ? 'grid-cols-2' : 'grid-cols-5'
                        } gap-8 place-items-center`}
                    >
                        {data.results.map((pokedex) => {
                            const imagePath = getPokedexImage(pokedex.name);

                            return (
                                <Link
                                    onClick={() => {
                                        trackButtonClick('Pokedex Region', `/pokedex/${pokedex.name}`, 'Pokedex', {
                                            region: pokedex.name
                                        });
                                    }}
                                    key={pokedex.name}
                                    href={`/pokedex/${pokedex.name}`}
                                    className={`${
                                        userDevice && userDevice.includes('mobile')
                                            ? 'w-[179px] h-[336px] min-w-[179px] min-h-[336px]'
                                            : 'w-[245px] h-[460px] min-w-[245px] min-h-[460px]'
                                    } flex relative rounded-2xl overflow-hidden border-white border-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-black/30 hover:shadow-lg cursor-pointer hover:shadow-black/50`}
                                >
                                    {imagePath && (
                                        <div className="relative w-full h-full bg-gray-900">
                                            <Image
                                                src={`/images/map/pokedex/${imagePath}`}
                                                alt={pokedex.name.replace(/-/g, ' ')}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center justify-center text-center absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-2xs p-3 py-2 border-t border-white">
                                        <p className="text-3xs font-bold text-[#FDEBB6] uppercase">
                                            {pokedex.name
                                                .replace(/original-?/gi, '')
                                                .replace(/updated-?/gi, '')
                                                .replace(/extended-?/gi, '')
                                                .replace(/-/g, ' ')
                                                .trim()}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}

                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        <p>Failed to load Pokédex data. Please try again later.</p>
                    </div>
                )}
            </div>

            <PopUpModal isShowModal={isShowModal} setIsShowModal={setIsShowModal} actionButton={false} bodyHeight="fit-content">
                <div className="flex flex-col gap-5 justify-center items-center py-20">
                    <Link href="/" onClick={() => trackButtonClick('Home Link', '/', 'Pokedex')}>
                        <h1 className="text-white text-2xs font-bold">Home</h1>
                    </Link>
                    <Link href="/pokedex" onClick={() => trackButtonClick('Pokedex Link', '/pokedex', 'Pokedex')}>
                        <h1 className="text-white text-2xs font-bold">Pokedex</h1>
                    </Link>
                </div>
            </PopUpModal>
        </div>
    );
}
