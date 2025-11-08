import CheckDevice from 'components/utils/CheckDevice';
import LandingPage from './LandingPage';
import MobileLandingPage from './MobileLandingPage';

export default function Homepage() {
    const userDevice = CheckDevice();
    console.log(' 🚀 ༼;´༎ຶ ۝ ༎ຶ༽ ~  (ノ ° 益 °) ノ ~ (っ◔◡◔)っ ~   ~ userDevice:', userDevice)
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
