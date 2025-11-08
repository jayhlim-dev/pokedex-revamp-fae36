'use client';

import { useRouter } from 'next/navigation';

export default function PokedexRegionLink({ href, children, className }) {
    const router = useRouter();

    const handleClick = (e) => {
        e.preventDefault();
        // Use client-side navigation for faster loading
        router.push(href);
    };

    return (
        <button onClick={handleClick} className={className}>
            {children}
        </button>
    );
}
