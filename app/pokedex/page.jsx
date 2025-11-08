import CacheLogger from './cache-logger';
import PokedexLocation from 'components/Pokedex/PokedexLocation';
import PokemonSearch from 'components/Pokedex/PokemonSearch';
import { fetchPokedexWithCache } from 'utils/pokedexCache';

async function getPokedexList() {
    try {
        const startTime = Date.now();

        const result = await fetchPokedexWithCache('list');
        const fetchTime = Date.now() - startTime;

        if (result.error) {
            throw new Error('Failed to fetch pokedex data');
        }

        // Prepare fetch info for client-side logging
        const isCached = result.fromCache || fetchTime < 50;
        const fetchInfo = {
            isCached,
            fetchTime,
            timestamp: new Date().toISOString(),
            count: result.data?.count || 0
        };

        return { data: result.data, fetchInfo };
    } catch (error) {
        console.error('❌ Error fetching pokedex:', error);
        return null;
    }
}

export default async function Page() {
    const result = await getPokedexList();
    const data = result?.data;
    const fetchInfo = result?.fetchInfo;

    return <PokedexLocation data={data} fetchInfo={fetchInfo} />;
}
