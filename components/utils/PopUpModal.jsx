'use client';

export default function PopUpModal({
    isShowModal,
    setIsShowModal,
    children,
    actionButton = true,
    bodyHeight = '70vh',
    modalMode = 'filter',
    bgTransparent = false,
    onApply = null
}) {
    return (
        <>
            {/* Backdrop */}
            {isShowModal && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setIsShowModal(false)}
                />
            )}

            {/* Bottom Sheet Modal */}
            <div
                className={`fixed bottom-0 left-0 right-0 ${
                    bgTransparent ? 'bg-[#1F1F1F]/70 backdrop-blur-2xs' : 'bg-[#1F1F1F]'
                } z-50 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
                    isShowModal ? 'translate-y-0' : 'translate-y-full pointer-events-none'
                }`}
                style={{
                    height: bodyHeight
                }}
            >
                <div className="flex flex-col overflow-hidden h-fit">
                    {/* Drag Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-white/30 rounded-full" />
                    </div>

                    {/* Content Area - Empty for now, will be filled with filter/sort options */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {/* Content will go here */}
                        {children}
                    </div>

                    {/* Action Button */}
                    {actionButton && (
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => {
                                    if (onApply) {
                                        onApply();
                                    }
                                    setIsShowModal(false);
                                }}
                                className="w-full bg-[#3EA2FF]/70 hover:bg-[#3EA2FF] text-white font-medium py-3 px-4 rounded-lg transition-colors text-2xs"
                            >
                                {modalMode === 'filter' ? 'Apply Filters' : 'Apply Sorting'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
