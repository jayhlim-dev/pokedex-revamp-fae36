import CheckDevice from 'components/utils/CheckDevice';
import PokemonBag from 'public/images/home/pokemon-bag.png';
import Image from 'next/image';
import { useEffect } from 'react';
import { trackSectionView } from 'utils/trackingUtils';
export default function PopularMapSection({ index = 2 }) {
    const section = {
        title: 'Regions That Shaped Our Story',
        desc: 'Four regions, countless memories. Each map holds its own magic, its own legends waiting to unfold',
        background: '/images/home/pokemon-popular.png',
        background_xl: '/images/home/xl/pokemon-popular-xl.png',
        secondary_desc: 'From the nostalgia of Kanto to the tropical warmth of Alola, every region left its mark on us'
    };

    const mapImage = [
        {
            name: 'Kanto',
            image: '/images/map/home/kanto.png',
            desc: 'Where it all began.The land of first steps and first friends. Simple roads, iconic faces Kanto is the beating heart of every journey that came after.'
        },
        {
            name: 'Hoenn',
            image: '/images/map/home/hoenn.png',
            desc: 'Where land meets sea, and myths breathe deep.A region of wild storms and ancient legends. Hoenn pulses with tropical heat, mystery, and the call of soaring dragons.'
        },
        {
            name: 'Sinnoh',
            image: '/images/map/home/sinnoh.png',
            desc: 'Where time and space were born. Blanketed in snow and rich in lore, Sinnoh whispers stories of gods and champions. A place where every peak holds a secret'
        },
        {
            name: 'Alola',
            image: '/images/map/home/alola.png',
            desc: 'Where the sun kisses the sea. A warm, island embrace wrapped in tradition. Alola redefined what it means to be a trainer with trials, aloha spirit, and Pokémon reimagined'
        }
    ];

    useEffect(() => {
        trackSectionView('Popular Map', index);
    }, [index]);

    return (
        <div className="relative capitalize">
            <div className={'absolute h-screen flex z-0 w-full blur-xs'}></div>

            <div className={'relative h-screen flex flex-col justify-center items-center text-white text-center'}>
                <div className="absolute inset-0 bg-[url('/images/home/xl/pokemon-popular-xl.png')] bg-repeat-round bg-contain z-0"></div>
                <div className="flex flex-col gap-20 z-10 justify-center h-full items-center">
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <div className="flex flex-col">
                            <h1 className="text-2xl">{section.title}</h1>
                        </div>
                        <p className="text-xs max-w-2xl">{section.desc}</p>
                    </div>

                    <div className="w-full flex gap-8">
                        {mapImage.map((map) => (
                            <div
                                key={map.name}
                                className="flex flex-col items-center justify-center border-white rounded-[19px] border-2 relative"
                            >
                                <div className="absolute bottom-0 left-0 w-full bg-black/40 rounded-[19px] flex items-center justify-center h-[190px] flex-col gap-2 px-8">
                                    <p className="text-white uppercase text-center text-xs">{map.name}</p>
                                    <div className="bg-white h-[1px] w-full"></div>
                                    <p className="text-white text-3xs text-justify">{map.desc}</p>
                                </div>

                                <div className="w-full !min-w-[250px]">
                                    <Image
                                        src={map.image}
                                        alt={map.name}
                                        width={400}
                                        height={400}
                                        priority
                                        key={map.name}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs max-w-3xl">{section.secondary_desc}</p>
                </div>
            </div>
        </div>
    );
}
