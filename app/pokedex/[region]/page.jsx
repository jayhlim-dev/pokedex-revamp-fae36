import RegionPage from './RegionPage';
import { fetchPokedexWithCache } from 'utils/pokedexCache';

async function getRegionPokemon(region) {
    try {
        const result = await fetchPokedexWithCache(region);

        if (result.error) {
            throw new Error('Failed to fetch region data');
        }

        return result.data;
    } catch (error) {
        console.error('❌ Error fetching region:', error);
        return null;
    }
}

export default async function RegionPageWrapper({ params }) {
    if (!params) {
        return (
            <div className="text-center text-gray-400">
                <p>Invalid region parameter.</p>
            </div>
        );
    }

    const resolvedParams = await params;
    const { region } = resolvedParams || {};

    if (!region) {
        return (
            <div className="text-center text-gray-400">
                <p>Region parameter is missing.</p>
            </div>
        );
    }

    const data = await getRegionPokemon(region);

    return <RegionPage data={data} region={region} />;
}
