/**
 * Cache Statistics Display Component
 * Shows cache performance metrics and provides cache management
 */
export default function CacheStats({ cacheStats, cachedCount, onClearCache }) {
    const totalRequests = cacheStats.hits + cacheStats.misses;
    const cacheHitRate = totalRequests > 0 ? ((cacheStats.hits / totalRequests) * 100).toFixed(1) : 0;

    return (
        <>
            {/* Initial Cache Info - shown before any requests are made */}
            {cachedCount > 0 && totalRequests === 0 && (
                <div className="px-6 py-3 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/50 rounded-lg">
                    <span className="text-green-400 font-semibold">💾 {cachedCount} Pokémon cached</span>
                    <span className="text-gray-300 ml-2">- Loading will be faster!</span>
                </div>
            )}

            {/* Cache Statistics - shown after requests are made */}
            {totalRequests > 0 && (
                <div className="flex flex-wrap gap-4 items-center justify-center text-sm">
                    {/* Cache Hits */}
                    <div className="px-4 py-2 bg-green-600/20 border border-green-500/50 rounded-lg">
                        <span className="text-green-400 font-semibold">Cache Hits: </span>
                        <span className="text-white">{cacheStats.hits}</span>
                    </div>

                    {/* API Calls */}
                    <div className="px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg">
                        <span className="text-blue-400 font-semibold">API Calls: </span>
                        <span className="text-white">{cacheStats.misses}</span>
                    </div>

                    {/* Hit Rate */}
                    <div className="px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-lg">
                        <span className="text-purple-400 font-semibold">Hit Rate: </span>
                        <span className="text-white">{cacheHitRate}%</span>
                    </div>

                    {/* Clear Cache Button */}
                    <button
                        onClick={onClearCache}
                        className="px-4 py-2 bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 text-red-400 rounded-lg transition-all duration-200 text-xs font-semibold"
                        title="Clear cache and reload"
                    >
                        🗑️ Clear Cache
                    </button>
                </div>
            )}
        </>
    );
}
