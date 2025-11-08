'use client';

import { useEffect } from 'react';

export default function CacheLogger({ fetchInfo }) {
    useEffect(() => {
        console.log('🔍 POKEDEX API FETCH STATUS (Browser):');
        console.log(`   ${fetchInfo.isCached ? '✅ FROM CACHE' : '🌐 FRESH FETCH'}`);
        console.log(`   Fetch time: ${fetchInfo.fetchTime}ms`);
        console.log(`   Timestamp: ${fetchInfo.timestamp}`);
        console.log(`   Total regions: ${fetchInfo.count}`);
        console.log('-----------------------------------');
    }, [fetchInfo]);

    return null;
}
