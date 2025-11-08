import CheckDevice from 'components/utils/CheckDevice';
import Image from 'next/image';
import { useEffect } from 'react';
import PokemonBag from 'public/images/home/pokemon-bag.png';
import { trackSectionView } from 'utils/trackingUtils';

export default function JourneySection({ index = 1 }) {
    const section = {
        title: 'PokeHex',
        desc: 'The sun is warm. The breeze carries a whisper. In front of you: one old bag, three Poké Balls, and a choice that shaped everything.',
        background: '/images/home/pokemon-journey.png',
        background_xl: '/images/home/xl/pokemon-journey-xl.png',
        secondary_desc:
            'No rush, just like before. This is simply a gentle reminder for you. Inside lies a familiar partner, and perhaps a message you were always meant to hear'
    };

    // Track page view when component mounts
    useEffect(() => {
        trackSectionView('Journey', index);
    }, []);

    return (
        <div className="relative capitalize">
            <div className={'absolute h-screen flex z-0 w-full blur-xs'}></div>

            <div className={'relative h-screen flex flex-col justify-center items-center text-white text-center'}>
                <div className="absolute inset-0 bg-[url('/images/home/xl/pokemon-journey-xl.png')] bg-repeat-round bg-contain z-0"></div>

                <div className="flex flex-col gap-20 z-10 justify-center h-full items-center">
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <div className="flex flex-col">
                            <h1 className="text-2xl">Every Journey Begins with a Choice</h1>
                        </div>
                        <p className="text-xs max-w-2xl">{section.desc}</p>
                    </div>

                    <div className="w-full h-96">
                        <Image
                            src={PokemonBag}
                            alt="pokemon bag"
                            className="!w-full !h-full !object-contain"
                            width={1205}
                            height={500}
                            priority
                        />
                    </div>

                    <p className="text-xs max-w-3xl">{section.secondary_desc}</p>
                </div>
            </div>
        </div>
    );
}
