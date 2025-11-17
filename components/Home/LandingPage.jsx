import CheckDevice from 'components/utils/CheckDevice';
import { useEffect, useState } from 'react';
import HomeSection from './Sections/HomeSection';
import JourneySection from './Sections/JourneySection';
import PopularMapSection from './Sections/PopularMapSection';
import PopularPokemonSection from './Sections/PopularPokemonSection';
import AboutUsSection from './Sections/AboutUsSection';

// import required modules
import { Pagination, Mousewheel } from 'swiper/modules';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function LandingPage() {
    const [offsetY, setOffsetY] = useState(0);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0); // change to eansy develop pages
    const [slideChange, setSlideChange] = useState(false); // marking slide changes
    const userDevice = CheckDevice();

    // useEffect(() => {
    //     const handleScroll = () => setOffsetY(window.scrollY);
    //     window.addEventListener('scroll', handleScroll, { passive: true });
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    const sectionComponents = [
        { component: HomeSection, index: 0 },
        { component: JourneySection, index: 1 },
        { component: PopularMapSection, index: 2 },
        { component: PopularPokemonSection, index: 3 },
        { component: AboutUsSection, index: 4 }
    ];

    const renderSwiper = () => {
        return (
            <Swiper
                pagination={{
                    clickable: true
                }}
                className="!h-screen !w-screen"
                // activeSlideIndex={5}
                initialSlide={0}
                direction={'vertical'}
                speed={400}
                spaceBetween={0}
                slidesPerView={1}
                allowTouchMove={true}
                resistance={true}
                shortSwipes={false}
                longSwipes={true}
                mousewheel={{
                    forceToAxis: true,
                    releaseOnEdges: true,
                    sensitivity: 1.5,
                    thresholdDelta: 25
                    // thresholdTime: 500
                }}
                modules={[Pagination, Mousewheel]}
            >
                {sectionComponents.map(({ component: SectionComponent, index }) => (
                    <SwiperSlide key={index} className="relative">
                        <SectionComponent index={index} userDevice={userDevice} />
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    };

    return <div className="flex flex-col h-full w-full [font-family:var(--font-press)] ">{renderSwiper()}</div>;
}
