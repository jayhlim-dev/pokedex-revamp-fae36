'use client';

import CheckDevice from 'components/utils/CheckDevice';
import LoadingIndicator from 'components/Pokedex/LoadingIndicator';

/**
 * Loading Screen Component for Pokemon Detail Page
 * Shows a simple loading animation while device type is being determined
 */
export default function PokemonLoadingScreen() {
    const userDevice = CheckDevice();
    const isMobile = userDevice && userDevice.includes('mobile');
    
    const padding = 'px-4 sm:px-8 2xl:px-[18vw]';
    
    // Use mobile background when device is detected as mobile, otherwise desktop
    const backgroundImage = isMobile 
        ? "bg-[url('/images/pokedex-page/mobile-pokemon-detail-bg.png')]"
        : "bg-[url('/images/pokemon-detail/pokemon-detail-bg.png')]";

    return (
        <div className={`min-h-screen flex flex-col ${backgroundImage} bg-repeat-round bg-cover z-10 ${padding} gap-6`}>
            <div className="w-full flex flex-col items-center justify-center h-screen gap-4">
                <LoadingIndicator />
                <p 
                    className="text-white text-lg sm:text-xl font-medium text-center px-4" 
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                >
                    Loading...
                </p>
            </div>
        </div>
    );
}
