'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackButtonClick } from 'utils/trackingUtils';
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

export default function Header() {
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

    return (
        <div className="sticky top-0 z-50 py-4">
            <div className="bg-[#231502]/58 backdrop-blur-xs py-3 rounded-2xl shadow-md shadow-black/50 w-fit mx-auto flex gap-8 items-center justify-center px-12">
                <Link
                    href="/"
                    onClick={handleLogoClick}
                    className="w-32 h-10 flex items-center justify-center no-underline hover:opacity-80 transition-opacity min-w-[126px]"
                >
                    <Image
                        src="/images/logo/secondary-logo.png"
                        alt="pokedex logo"
                        width={700}
                        height={400}
                        className="object-contain max-h-[27px]"
                    />
                </Link>

                <div className="w-[1px] bg-white h-6 rounded-full"></div>

                <div className="flex gap-8 items-center">
                    {breadcrumbs && breadcrumbs.length > 0 ? (
                        // Show breadcrumbs when on sub-pages
                        <div className="flex items-center gap-2 text-xs">
                            {breadcrumbs.map((crumb, index) => (
                                <div key={crumb.href} className="flex items-center gap-2">
                                    <Link
                                        href={crumb.href}
                                        onClick={() => handleBreadcrumbClick(crumb)}
                                        className={`no-underline transition-colors uppercase ${
                                            index === breadcrumbs.length - 1
                                                ? 'text-primary font-bold whitespace-nowrap'
                                                : 'text-[#FFFCE9] hover:text-primary'
                                        }`}
                                    >
                                        {crumb.name}
                                    </Link>
                                    {index < breadcrumbs.length - 1 && <span className="text-[#FFFCE9]">/</span>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Show regular nav items when on home or main pokedex
                        navItems.map((item) => (
                            <Link
                                href={item.href}
                                key={item.name}
                                onClick={() => handleNavClick(item)}
                                className={`text-xs font-medium transition-colors duration-200 no-underline ${
                                    isActive(item.href) ? 'text-primary font-bold' : 'text-[#FFFCE9] hover:text-primary'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))
                    )}
                </div>

                <div className="w-[1px] bg-white h-6 rounded-full"></div>
                <PokemonSearch className="!max-w-[45%] min-w-[260px]" inputClassName="!py-2 !text-2xs !px-4 !pr-4" />

            </div>
        </div>
    );
}
