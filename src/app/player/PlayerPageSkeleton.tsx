export default function PlayerPageSkeleton() {
    return (
        <>
            <div
                role="status"
                aria-label="Loading media player"
                className="flex flex-col gap-6 animate-pulse motion-reduce:animate-none"
            >
                <div className="h-9 w-2/3 max-w-[24rem] rounded bg-gray-200" />
                <div className="h-px w-full bg-gray-300" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-11/12 rounded bg-gray-200" />
                <div className="h-4 w-4/5 rounded bg-gray-200" />
                <span className="sr-only">Loading media player…</span>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-50 w-full bg-[var(--primary)] text-white shadow-lg">
                <div className="mx-auto flex w-full max-w-[108rem] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-8">
                    <div className="flex min-w-0 items-center gap-3 lg:w-[28%] lg:shrink-0">
                        <div className="h-14 w-12 shrink-0 animate-pulse rounded bg-white/20 motion-reduce:animate-none" />
                        <div className="min-w-0 flex-1">
                            <div className="font-semibold">Loading book...</div>
                            <div className="text-sm text-gray-300">Fetching audio...</div>
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col items-center gap-3 sm:flex-row sm:gap-5">
                        <div className="flex shrink-0 items-center gap-1 opacity-40">
                            <span className="flex h-11 w-11 items-center justify-center" aria-hidden="true">↶</span>
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-[var(--primary)]" aria-hidden="true">▶</span>
                            <span className="flex h-11 w-11 items-center justify-center" aria-hidden="true">↷</span>
                        </div>
                        <div className="flex w-full min-w-0 flex-1 items-center gap-3 text-sm">
                            <span>0:00</span>
                            <div className="h-1.5 min-w-0 flex-1 rounded-full bg-gray-500" />
                            <span>0:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
