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
import MobileHomeSection from './Sections/MobileHomeSection';
import MobileJourneySection from './Sections/MobileJourneySection';
import MobilePopularMapSection from './Sections/MobilePopularMapSection';
import MobilePopularPokemonSection from './Sections/MobilePopularPokemonSection';
import MobileAboutUsSection from './Sections/MobileAboutUsSection';

export default function MobileLandingPage() {
    const userDevice = CheckDevice();

    const sectionComponents = [
        { component: MobileHomeSection, index: 0 },
        { component: MobileJourneySection, index: 1 },
        { component: MobilePopularPokemonSection, index: 2 },
        { component: MobilePopularMapSection, index: 3 },
        { component: MobileAboutUsSection, index: 4 }
    ];

    const renderSwiper = () => {
        return (
            <Swiper
                pagination={{
                    clickable: true
                }}
                className="!h-screen !w-screen"
                initialSlide={0}
                direction={'vertical'}
                speed={1000}
                spaceBetween={0}
                slidesPerView={1}
                allowTouchMove={true}
                resistance={true}
                shortSwipes={false}
                longSwipes={true}
                // mousewheel={{
                //     forceToAxis: true,
                //     releaseOnEdges: true,
                //     sensitivity: 1.5,
                //     thresholdDelta: 25
                // }}
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
