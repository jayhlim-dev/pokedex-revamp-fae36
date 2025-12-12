import CheckDevice from 'components/utils/CheckDevice';
import LandingPage from './LandingPage';
import MobileLandingPage from './MobileLandingPage';
import PokemonLoadingScreen from 'components/Pokemon/PokemonLoadingScreen';

export default function Homepage() {
    const userDevice = CheckDevice();

    if (!userDevice) {
        return null;
    }

    if (userDevice && userDevice.includes('mobile')) {
        return (
            <div className="flex flex-col gap-12 sm:gap-16">
                <MobileLandingPage />
                {/* Hidden navigation for SEO */}
                <nav className="sr-only" aria-label="Main navigation">
                    <ul>
                        <li>
                            <a href="/pokedex">Pokédex</a>
                        </li>
                        <li>
                            <a href="/pokedex/kanto">Kanto Region</a>
                        </li>
                        <li>
                            <a href="/pokedex/hoenn">Hoenn Region</a>
                        </li>
                        <li>
                            <a href="/pokedex/sinnoh">Sinnoh Region</a>
                        </li>
                        <li>
                            <a href="/pokedex/alola">Alola Region</a>
                        </li>
                        <li>
                            <a href="/pokemon/charizard">Charizard</a>
                        </li>
                        <li>
                            <a href="/pokemon/gengar">Gengar</a>
                        </li>
                        <li>
                            <a href="/pokemon/pikachu">Pikachu</a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <LandingPage />
            {/* Hidden navigation for SEO */}
            <nav className="sr-only" aria-label="Main navigation">
                <ul>
                    <li>
                        <a href="/pokedex">Pokédex</a>
                    </li>
                    <li>
                        <a href="/pokedex/kanto">Kanto Region</a>
                    </li>
                    <li>
                        <a href="/pokedex/hoenn">Hoenn Region</a>
                    </li>
                    <li>
                        <a href="/pokedex/sinnoh">Sinnoh Region</a>
                    </li>
                    <li>
                        <a href="/pokedex/alola">Alola Region</a>
                    </li>
                    <li>
                        <a href="/pokemon/charizard">Charizard</a>
                    </li>
                    <li>
                        <a href="/pokemon/gengar">Gengar</a>
                    </li>
                    <li>
                        <a href="/pokemon/pikachu">Pikachu</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
