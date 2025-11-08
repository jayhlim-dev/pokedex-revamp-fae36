import PokemonHeader from 'components/Pokemon/PokemonHeader';
import PokemonProfile from 'components/Pokemon/PokemonProfile';
import BasicInformation from 'components/Pokemon/BasicInformation';
import PokemonStats from 'components/Pokemon/PokemonStats';
import clsx from 'clsx';
import CheckDevice from 'components/utils/CheckDevice';
import MobilePokemonBottomSection from './MobilePokemonBottomSection';
import PokemonBottomSection from './PokemonBottomSection';

/**
 * PokemonInfoSection component displays Pokemon information
 * @param {Object} pokemon - Pokemon data
 * @param {Object} species - Pokemon species data
 * @param {string} flavorText - Flavor text to display
 */
export default function PokemonInfoSection({ pokemon, species, flavorText, evolutions, device }) {
    const isMobile = device && device.includes('mobile');
    return (
        <div className={clsx("flex flex-col gap-6 text-white justify-center max-w-[700px]", isMobile ? '!h-fit' : 'max-h-[700px]')}>
            <PokemonHeader pokemon={pokemon} device={device}/>

            <div className={clsx(`flex flex-col gap-6 text-white justify-center  max-w-[700px] ${isMobile ? '!gap-6' : 'max-h-[700px]'}`)}>
                {isMobile && (
                    <div className={clsx(`shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30 h-[4px]`)}></div>
                )}

                <PokemonProfile flavorText={flavorText} device={device}/>

                {isMobile && (
                    <div className={clsx(`shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30 h-[4px]`)}></div>
                )}

                <BasicInformation pokemon={pokemon} species={species} device={device}/>
                
                {isMobile && (
                    <div className={clsx(`shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30 h-[4px]`)}></div>
                )}                
                <PokemonStats pokemon={pokemon} device={device}/>
                
                {isMobile && (
                    <>
                        <div className={clsx(`shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30 h-[4px]`)}></div>
                        <PokemonBottomSection pokemon={pokemon} species={species} evolutions={evolutions} from='info-section' device={device}/>
                    </>
                )}
            </div>
        </div>
    );
}
