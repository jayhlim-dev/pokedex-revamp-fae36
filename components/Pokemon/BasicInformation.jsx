import clsx from "clsx";

/**
 * Basic Information Component
 * Displays Pokemon's basic stats like height, weight, color, shape, growth rate, and habitat
 */
export default function BasicInformation({ pokemon, species, device }) {
    const isMobile = device && device.includes('mobile');
    const { color, shape, growth_rate, habitat } = species;

    return (
        <div className={clsx(`flex gap-2 flex-col w-full capitalize ${isMobile ? 'px-4' : ''}`)}>
            <div className={clsx("flex flex-col gap-2", isMobile ? '!gap-4' : '')}>
                <div className="flex flex-col text-xs font-bold">Basic Information</div>
                <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>

                <div className={clsx(`flex gap-10 text-2xs ${isMobile ? 'flex-col !gap-3 w-full text-3xs' : ''}`)}>
                    <div className={clsx(`flex gap-4 w-min ${isMobile ? '!w-full' : ''}`)}>
                        <div className={clsx(`flex flex-col w-[7vw] gap-1 ${isMobile ? '!w-[60%] gap-3' : ''}`)}>
                            <div className={`leading-relaxed`}>Height</div>
                            <div className={`leading-relaxed`}>Weight</div>
                            <div className={`leading-relaxed`}>Color</div>
                        </div>
                        <div className={clsx(`flex flex-col text-2xs w-min gap-1 ${isMobile ? '!w-full text-3xs gap-3' : ''}`)}>
                            <p className="leading-relaxed ">{pokemon.height / 10}m</p>
                            <p className="leading-relaxed ">{pokemon.weight / 10}kg</p>
                            <p className="leading-relaxed ">{color.name}</p>
                        </div>
                    </div>
                    
                    {
                        !isMobile && (
                            <div className={clsx(`w-[1px] shadow-md shadow-black/40 flex h-full bg-[#FFFCE9]/30 ${isMobile ? '!w-full' : ''}`)}></div>
                        )
                    }

                    <div className={clsx(`flex gap-4 w-[50%] ${isMobile ? '!w-full text-3xs' : ''}`)}>
                        <div className={clsx(`flex flex-col gap-1 w-[15vw] ${isMobile ? '!w-[60%] gap-3' : ''}`)}>
                            <div className="leading-relaxed">Shape</div>
                            <div className="leading-relaxed">Habitat</div>
                            <div className="leading-relaxed">Growth Rate</div>
                        </div>
                        <div className={clsx(`flex flex-col gap-1 ${isMobile ? '!w-full text-3xs gap-3' : ''}`)}>
                            <p className="leading-relaxed  whitespace-nowrap">{shape.name}</p>
                            <p className="leading-relaxed  whitespace-nowrap">{habitat?.name}</p>
                            <p className="leading-relaxed  whitespace-nowrap">{growth_rate.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
