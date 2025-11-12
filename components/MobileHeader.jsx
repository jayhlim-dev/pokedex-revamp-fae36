'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackButtonClick } from 'utils/trackingUtils';
import CheckDevice from './utils/CheckDevice';
import PokemonSearch from './Pokedex/PokemonSearch';

const navItems = [
    {
        name: 'Home',
        href: '/'
    },
    {
        name: 'Pokedex',
        href: '/pokedex'
    }
];

export default function MobileHeader({ setIsShowModal, setModalMode }) {
    const pathname = usePathname();

    const handleLogoClick = () => {
        trackButtonClick('Logo', '/', 'Header');
    };

    const handleNavClick = (navItem) => {
        trackButtonClick(`${navItem.name} Navigation`, navItem.href, 'Header');
    };

    const handleBreadcrumbClick = (breadcrumb) => {
        trackButtonClick(`Breadcrumb: ${breadcrumb.name}`, breadcrumb.href, 'Header');
    };

    const isActive = (href) => {
        // Only highlight if exact match
        if (href === '/') {
            return pathname === '/';
        }
        // Only highlight Pokedex when on the main pokedex page
        if (href === '/pokedex') {
            return pathname === '/pokedex';
        }
        return pathname === href;
    };

    // Generate breadcrumbs
    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);

        // Don't show breadcrumbs on home or main pokedex page
        if (pathname === '/' || pathname === '/pokedex') {
            return null;
        }

        const breadcrumbs = [];

        if (paths[0] === 'pokedex' && paths[1]) {
            // We're in a specific region
            breadcrumbs.push({
                name: 'Pokedex',
                href: '/pokedex'
            });
            breadcrumbs.push({
                name: paths[1]
                    .replace(/original-?/gi, '')
                    .replace(/updated-?/gi, '')
                    .replace(/extended-?/gi, '')
                    .replace(/-/g, ' '),
                href: `/pokedex/${paths[1]}`
            });
        } else if (paths[0] === 'pokemon' && paths[1]) {
            // We're viewing a specific pokemon
            breadcrumbs.push({
                name: 'Pokedex',
                href: '/pokedex'
            });
            breadcrumbs.push({
                name: paths[1].replace(/-/g, ' '),
                href: `/pokemon/${paths[1]}`
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();
    const userDevice = CheckDevice();
    const isMobile = userDevice && userDevice.includes('mobile');
    // Show search/filter section when on region-specific pokedex pages (not on main /pokedex page)
    const showSearchSection = pathname.startsWith('/pokedex/');

    return (
        <div className="sticky top-0 z-40 py-4">
            <div
                className={`bg-[#09090B]/40 backdrop-blur-xs py-3 rounded-2xl shadow-md shadow-black/50 w-fit mx-auto flex gap-2 items-center px-4 min-w-[350px] flex-col`}
            >
                <div className="flex w-full justify-between items-center">
                    <div
                        className="flex items-center justify-center h-[30px] w-[30px]"
                        // onClick={() => setIsShowModal(true)}
                        onClick={() => {
                            setModalMode?.('burger');
                            setIsShowModal(true);
                        }}
                    >
                        <Image
                            src="/images/icon/burger.png"
                            alt="pokedex logo"
                            width={40}
                            height={40}
                            className="object-contain max-h-[13px]"
                        />
                    </div>

                    <Link
                        href="/"
                        onClick={handleLogoClick}
                        className="w-32 h-10 flex items-center justify-center no-underline hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/images/logo/secondary-logo.png"
                            alt="pokedex logo"
                            width={700}
                            height={400}
                            className="object-contain max-h-[27px]"
                        />
                    </Link>
                </div>

                {showSearchSection && (
                    <>
                        <div className="w-[70vw] shadow-md shadow-black/40 flex h-[1px] bg-[#FFFCE9]/30"></div>
                        <div className="flex w-full justify-between items-center">
                            <PokemonSearch />
                            <div className="w-[1px] h-[30px] bg-white/30"></div>

                            <div
                                className="flex items-center justify-center h-[38px] w-[38px] bg-white/10 rounded-md"
                                onClick={() => {
                                    setModalMode?.('filter');
                                    setIsShowModal(true);
                                }}
                            >
                                <Image
                                    src="/images/icon/filter.png"
                                    alt="menu"
                                    width={40}
                                    height={40}
                                    className="object-cover max-h-[50px] p-2"
                                />
                            </div>

                            <div
                                className="flex items-center justify-center h-[38px] w-[38px] bg-white/10 rounded-md"
                                onClick={() => {
                                    setModalMode?.('sort');
                                    setIsShowModal(true);
                                }}
                            >
                                <Image
                                    src="/images/icon/sorting.png"
                                    alt="menu"
                                    width={40}
                                    height={40}
                                    className="object-cover max-h-[50px] p-2"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
