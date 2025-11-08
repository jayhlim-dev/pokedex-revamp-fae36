import CheckDevice from 'components/utils/CheckDevice';
import LandingPage from './LandingPage';
import MobileLandingPage from './MobileLandingPage';
import PokemonLoadingScreen from 'components/Pokemon/PokemonLoadingScreen';

export default function Homepage() {
    const userDevice = CheckDevice();

    if (!userDevice) {
        return null;
    }

    if (userDevice && userDevice.includes('mobile')) {
        return (
            <div className="flex flex-col gap-12 sm:gap-16">
                <MobileLandingPage />
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <LandingPage />
        </div>
    );
}
