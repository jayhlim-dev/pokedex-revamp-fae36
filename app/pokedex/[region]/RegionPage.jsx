'use client';

import MobileHeader from 'components/MobileHeader';
import CheckDevice from 'components/utils/CheckDevice';
import Header from 'components/header';
import PokemonGrid from 'components/Pokedex/PokemonGrid';
import { useState } from 'react';
import { trackButtonClick } from 'utils/trackingUtils';
import Link from 'next/link';
import PopUpModal from 'components/utils/PopUpModal';
import clsx from 'clsx';

export default function RegionPage({ data, region }) {
    const userDevice = CheckDevice();

    const isMobile = userDevice && userDevice.includes('mobile');
    const [isShowModal, setIsShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('filter'); // 'filter' or 'sort'

    return (
        <>
            <div
                className={clsx(
                    "min-h-screen flex flex-col bg-[url('/images/home/xl/home-background-xl.png')] bg-repeat-round bg-cover z-10 h-screen",
                    isMobile ? 'justify-between !bg-[url("/images/pokedex-page/mobile-pokemon-detail-bg.png")]' : ''
                )}
            >
                {userDevice && userDevice.includes('mobile') ? (
                    <MobileHeader setIsShowModal={setIsShowModal} setModalMode={setModalMode} />
                ) : (
                    <Header />
                )}

                <div
                    className={clsx(
                        'w-full flex flex-col items-center justify-center gap-10 pt-16 h-[90%]',
                        isMobile ? '!pt-10 !h-[82%]' : ''
                    )}
                >
                    {data && data.pokemon_entries ? (
                        <PokemonGrid
                            initialEntries={data.pokemon_entries}
                            region={region}
                            isShowModal={isShowModal}
                            setIsShowModal={setIsShowModal}
                            modalMode={modalMode}
                        />
                    ) : (
                        <div className="text-center text-gray-400">
                            <p>Failed to load Pokémon data for this region. Please try again later.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
