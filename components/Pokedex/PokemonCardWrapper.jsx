'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function PokemonCardWrapper({ children, href }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleClick = (e) => {
        e.preventDefault();
        // Store the current pathname as the referrer
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('pokemonReferrer', pathname);
            // console.log('🚀 Stored referrer:', pathname);
        }
        // Use client-side navigation for faster loading
        router.push(href);
    };

    return (
        <div onClick={handleClick} className="cursor-pointer">
            {children}
        </div>
    );
}
