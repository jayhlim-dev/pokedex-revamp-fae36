import clsx from 'clsx';
import CheckDevice from 'components/utils/CheckDevice';

/**
 * PokemonDetailsPanel component displays additional Pokemon details
 * @param {Object} pokemon - Pokemon data containing abilities
 * @param {Object} species - Pokemon species data containing base_happiness, capture_rate, generation
 */
export default function PokemonDetailsPanel({ pokemon, species }) {
    // Toggle for testing empty values - set to true to test default values
    const TEST_EMPTY_VALUES = false;

    const { abilities } = pokemon;
    const limitedAbilities = Array.isArray(abilities) ? abilities.slice(0, 2) : abilities;
    const { base_happiness, capture_rate, generation, egg_groups, gender_rate } = species;

    // Use test values if toggle is enabled
    const testAbilities = TEST_EMPTY_VALUES ? null : limitedAbilities;
    const testBaseHappiness = TEST_EMPTY_VALUES ? null : base_happiness;
    const testCaptureRate = TEST_EMPTY_VALUES ? null : capture_rate;
    const testGeneration = TEST_EMPTY_VALUES ? null : generation;
    const testEggGroups = TEST_EMPTY_VALUES ? null : egg_groups;
    const testGenderRate = TEST_EMPTY_VALUES ? null : gender_rate;

    const userDevice = CheckDevice();
    const isMobile = userDevice && userDevice.includes('mobile');
    return (
        <div className="col-span-1 h-fit">
            <div className={clsx('flex flex-col gap-2', isMobile ? '!gap-4 !px-4' : '')}>
                <div className="flex flex-col text-xs font-bold">Base Experience</div>

                <div className="h-[1px] shadow-md shadow-black/40 flex w-full bg-[#FFFCE9]/30"></div>

                <div className="flex gap-4 w-full">
                    <div
                        className={clsx(
                            `flex flex-col  gap-3 ${
                                isMobile ? '!w-[40%] text-3xs' : 'text-3xs w-[40%] 2xl:min-w-[8vw]'
                            }`
                        )}
                    >
                        <div
                            className={clsx('leading-relaxed whitespace-nowrap text-3xs', isMobile ? '!text-3xs' : '')}
                        >
                            Base Happiness
                        </div>
                        <div
                            className={clsx('leading-relaxed whitespace-nowrap text-3xs', isMobile ? '!text-3xs' : '')}
                        >
                            Abilities
                        </div>
                        <div
                            className={clsx('leading-relaxed whitespace-nowrap text-3xs', isMobile ? '!text-3xs' : '')}
                        >
                            Capture Rate
                        </div>
                        <div
                            className={clsx('leading-relaxed whitespace-nowrap text-3xs', isMobile ? '!text-3xs' : '')}
                        >
                            First Released
                        </div>
                        <div
                            className={clsx('leading-relaxed whitespace-nowrap text-3xs', isMobile ? '!text-3xs' : '')}
                        >
                            Egg Groups
                        </div>
                        <div
                            className={clsx('leading-relaxed whitespace-nowrap text-3xs', isMobile ? '!text-3xs' : '')}
                        >
                            Gender Rate
                        </div>
                    </div>

                    <div className={clsx(`flex flex-col  gap-3 ${isMobile ? '!w-[60%] text-3xs' : ''}`)}>
                        <p className="leading-relaxed text-3xs">{testBaseHappiness ?? 'N/A'}</p>
                        <p
                            className={clsx(
                                'leading-relaxed text-3xs',
                                isMobile
                                    ? '!text-3xs overflow-x-scroll whitespace-nowrap scrollbar-hide max-w-[55vw]'
                                    : ''
                            )}
                        >
                            {testAbilities?.map((ability) => ability.ability?.name ?? ability).join(', ') ?? 'N/A'}
                        </p>
                        <p className="leading-relaxed text-3xs">{testCaptureRate ?? 'N/A'}</p>
                        <p className="leading-relaxed text-3xs">{testGeneration?.name ?? 'N/A'}</p>
                        <p className="leading-relaxed text-3xs">
                            {testEggGroups?.map((group) => group.name).join(', ') ?? 'N/A'}
                        </p>
                        <p className="leading-relaxed text-3xs">{getGenderRateText(testGenderRate)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Format gender rate into readable text
 * @param {number} genderRate - Gender rate value from API (-1 = genderless, 0-8 = male percentage)
 * @returns {string} Formatted gender rate text
 */
function getGenderRateText(genderRate) {
    if (genderRate === null || genderRate === undefined) {
        return 'N/A';
    }

    if (genderRate === -1) {
        return 'Genderless';
    }

    const malePercentage = (genderRate / 8) * 100;
    const femalePercentage = 100 - malePercentage;

    return `${malePercentage}% Male, ${femalePercentage}% Female`;
}
