import PlatformElement from "./PlatformElement";

export default function HeroPlatform() {

    return (
        <div className="flex min-w-0 flex-col items-center justify-center">
            <div className="text-[--primaryColor]">
                <h1 className="max-w-[42rem] pt-10 text-center text-[clamp(1.65rem,4.5vw,1.9rem)] font-bold leading-tight text-[var(--primary)] sm:pt-16">Understand books in few minutes</h1>
            </div>
            <div className="mt-8 grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                <PlatformElement position={0} titleText="Read or listen" bodyText="Save time by getting the core ideas from the best books." />
                <PlatformElement position={1} titleText="Find your next read" bodyText="Explore book lists and personalized recommendations." />
                <div className="sm:col-span-2 lg:col-span-1">
                    <PlatformElement position={2} titleText="Briefcasts" bodyText="Gain valuable insights from briefcasts" />
                </div>
            </div>
        </div>
    )

}