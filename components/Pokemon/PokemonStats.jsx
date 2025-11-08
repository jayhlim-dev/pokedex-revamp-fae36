import clsx from 'clsx';
import { getStatColor } from 'utils/pokemonUtils';

/**
 * Pokemon Stats Component
 * Displays Pokemon's base stats with colored progress bars
 */
export default function PokemonStats({ pokemon, device }) {
    const isMobile = device && device.includes('mobile');
    return (
        <div className={clsx("flex flex-col gap-2", isMobile ? '!gap-4 px-4' : '')}>
            <div className="flex gap-2 w-full">
                <div className={clsx("flex flex-col gap-2 w-full", isMobile ? '!gap-4' : '')}>
                    <div className="flex flex-col text-xs font-bold">Status</div>
                    <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>
                </div>
            </div>

            {/* Base Stats */}
            <div className="flex flex-col gap-2">
                {pokemon.stats
                    .filter((stat) => ['hp', 'attack', 'defense', 'speed'].includes(stat.stat.name))
                    .map((stat) => {
                        return (
                            <div key={stat.stat.name} className="flex flex-col gap-1">
                                <div className="flex justify-between text-3xs ">
                                    <span className="uppercase">{stat.stat.name.replace(/-/g, ' ')}</span>
                                    <span className="font-bold ">{stat.base_stat} / 255</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-[.8vh] border border-white/20 flex flex-col gap">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                                            backgroundColor: getStatColor(stat.stat.name)
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
