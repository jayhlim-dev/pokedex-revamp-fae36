/**
 * Loading Indicator Component
 * Animated bouncing dots to show loading state
 */
export default function LoadingIndicator() {
    return (
        <div className="flex gap-2 text-white">
            <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
            ></div>
            <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
            ></div>
            <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
            ></div>
        </div>
    );
}

