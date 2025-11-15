'use client';

import PokemonInfoSection from 'components/Pokemon/PokemonInfoSection';
import PokemonDetailTracker from 'components/Pokemon/PokemonDetailTracker';
import MobileHeader from 'components/MobileHeader';
import MobilePokemonImageSection from './MobilePokemonImageSection';
import PokemonBottomSection from './PokemonBottomSection';
import PopUpModal from 'components/utils/PopUpModal';
import NavigationLinks from 'components/utils/NavigationLinks';
import { useState } from 'react';

export default function MobilePokemonDetail({
    pokemon,
    species,
    flavorText,
    evolutions,
    pokemonName,
    evolutionChainLength,
    device
}) {
    const isMobile = device && device.includes('mobile');
    const [isShowModal, setIsShowModal] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-[url('/images/pokemon-detail/mobile-pokemon-detail-bg.png')] bg-repeat-round bg-cover z-10 gap-6">
            <PokemonDetailTracker
                pokemonName={pokemonName}
                evolutionChainLength={evolutionChainLength}
                device="mobile"
            />
            <MobileHeader device="mobile" setIsShowModal={setIsShowModal} setModalMode={setIsShowModal} />

            <div className="w-full flex flex-col items-center h-fit gap-6">
                <MobilePokemonImageSection pokemon={pokemon} />

                <div
                    className="w-full flex flex-col h-fit rounded-3xl backdrop-blur-2xs py-8 bg-black/20"
                    style={isMobile ? undefined : { textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                >
                    <PokemonInfoSection
                        pokemon={pokemon}
                        species={species}
                        flavorText={flavorText}
                        evolutions={evolutions}
                        device={device}
                    />
                </div>
            </div>

            <PopUpModal
                isShowModal={isShowModal}
                setIsShowModal={setIsShowModal}
                actionButton={false}
                bodyHeight="fit-content"
            >
                <NavigationLinks />
            </PopUpModal>

            {/* the section below is only shown on desktop devices because it's different position from the mobile version*/}
            <PokemonBottomSection
                pokemon={pokemon}
                species={species}
                evolutions={evolutions}
                from="pokemon-detail"
                device={device}
            />
        </div>
    );
}
