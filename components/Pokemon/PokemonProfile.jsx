import clsx from "clsx";
import CheckDevice from "components/utils/CheckDevice";

/**
 * Pokemon Profile Component
 * Displays Pokemon description/flavor text
 */
export default function PokemonProfile({ flavorText }) {
    const userDevice = CheckDevice();
    const isMobile = userDevice && userDevice.includes('mobile');
    return (
        <div className={clsx(`flex flex-col gap-2 ${isMobile ? 'px-4 !gap-4' : ''}`)}>
            <div className="flex flex-col text-xs font-bold">Pokemon Profile</div>
            <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>
            <p className={clsx("text-2xs leading-relaxed", isMobile ? 'text-3xs !leading-5' : '')}>{flavorText}</p>
        </div>
    );
}
