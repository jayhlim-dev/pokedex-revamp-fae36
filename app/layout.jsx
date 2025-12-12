import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import Script from 'next/script';
import { Press_Start_2P } from 'next/font/google';

const pressStart = Press_Start_2P({
    weight: '400',
    subsets: ['latin'],
    display: 'swap'
});

export const metadata = {
    title: {
        template: '%s | PokeEon',
        default: 'PokeEon - Modern Pokédex for Pokémon Trainers'
    },
    description:
        'Discover PokeEon, the modern Pokédex for Pokémon Trainers. Explore stats, types, and information for Kanto, Hoenn, Sinnoh, Alola, and more regions.',
    keywords: [
        'pokemon',
        'pokedex',
        'pokemon go',
        'pokemon database',
        'pokemon stats',
        'pokemon types',
        'pokemon information',
        'pokemon trainer',
        'pokemon fan',
        'pokeapi',
        'pokemon cards',
        'pokemon data'
    ],
    authors: [{ name: 'Jason', url: 'https://pokeeon.com' }],
    creator: 'Jason',
    publisher: 'PokeEon',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://pokeeon.com',
        siteName: 'PokeEon',
        title: 'PokeEon - Modern Pokédex for Pokémon Trainers',
        description:
            "It's still a Pokédex just not how they remember it. Explore Pokémon stats, types, and information in a beautiful, interactive experience.",
        images: [
            {
                url: '/images/logo/main-gengar-char.png',
                width: 1200,
                height: 630,
                alt: 'PokeEon - Modern Pokédex'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PokeEon - Modern Pokédex for Pokémon Trainers',
        description:
            "It's still a Pokédex just not how they remember it. Explore Pokémon in a beautiful, interactive experience.",
        images: ['/images/logo/main-gengar-char.png']
    },
    icons: {
        icon: [
            { url: '/browser-logo.png', sizes: 'any' },
            { url: '/images/logo/main-gengar-char.png', sizes: 'any' }
        ],
        apple: [{ url: '/browser-logo.png', sizes: '180x180' }]
    },
    manifest: '/manifest.json',
    metadataBase: new URL('https://pokeeon.com'),
    alternates: {
        canonical: '/'
    },
    category: 'gaming'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Google Analytics */}
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-YVQ7XEX0QM" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-YVQ7XEX0QM');
                    `}
                </Script>
            </head>
            <body className={`${pressStart.className} antialiased text-white bg-blue-900 font-sans`}>
                <div className="flex flex-col min-h-screen bg-noise">
                    <div className="flex flex-col w-full mx-auto grow">
                        {/* <Header /> */}
                        <main className="grow">{children}</main>
                        {/* <Footer /> */}
                    </div>
                </div>
            </body>
        </html>
    );
}
