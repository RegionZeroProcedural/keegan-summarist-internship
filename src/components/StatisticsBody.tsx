import TextBlock from "./StatisticsBody-components/TextBlock";
import StatsBlock from "./StatisticsBody-components/StatsBlock";

const centerPadding = 'hidden lg:block lg:w-8'

export default function StatisticsBody() {
    
    return (
        <div className="my-12 flex min-w-0 flex-col items-stretch gap-8 sm:my-20 lg:items-center lg:gap-10">
            <div className="flex w-full min-w-0 flex-col items-stretch justify-center gap-6 lg:flex-row lg:items-center lg:gap-10">
                <TextBlock flip={false} text={['Enhance your knowledge', 'Achieve greater success', 'Improve your health', 'Develop better parenting skills', 'Increase happiness', 'Be the best version of yourself!']}/>
                <div className={centerPadding} />
                <StatsBlock
                    text={[
                            <div key={0} className="flex flex-col gap-2">
                                <div className="flex flex-row justify-start items-start gap-3">
                                    <div className="font-bold justify-start text-base sm:text-[1.25rem] text-blue-500">93%</div> 
                                    <div className="text-base sm:text-[1.25rem] text-gray-700 leading-6 font-extralight">of Summarist members <span className="font-semibold text-gray-800">significantly increase</span> reading frequency.</div>
                                </div>
                            </div>,
                            <div key={1} className="flex flex-col gap-2">
                                <div className="flex flex-row justify-start items-start gap-3">
                                    <div className="font-bold justify-start text-base sm:text-[1.25rem] text-blue-500">96%</div> 
                                    <div className="text-base sm:text-[1.25rem] text-gray-700 leading-6 font-extralight">of Summarist members <span className="font-semibold text-gray-800">establish better</span> habits.</div>
                                </div>
                            </div>,
                            <div key={2} className="flex flex-col gap-2">
                                <div className="flex flex-row justify-start items-start gap-3">
                                    <div className="font-bold justify-start text-base sm:text-[1.25rem] text-blue-500">90%</div> 
                                    <div className="text-base sm:text-[1.25rem] text-gray-700 leading-6 font-extralight">have made <span className="font-semibold text-gray-800">significant positive</span> change to their lives.</div>
                                </div>
                            </div>
                        ]}
                />
            </div>
            <div className="h-5" />
            <div className="flex w-full min-w-0 flex-col items-stretch justify-center gap-6 lg:flex-row lg:items-center lg:gap-10">
                <StatsBlock
                    text={[
                        <div key={0} className="flex flex-col gap-2">
                                <div className="flex flex-row justify-start items-start gap-3">
                                    <div className="font-bold justify-start text-base sm:text-[1.25rem] text-blue-500">91%</div> 
                                    <div className="text-base sm:text-[1.25rem] text-gray-700 leading-6 font-extralight">of Summarist members <span className="font-semibold text-gray-800">report feeling more productive</span> after incorporating the service into their daily routine.</div>
                                </div>
                            </div>,
                            <div key={1} className="flex flex-col gap-2">
                                <div className="flex flex-row justify-start items-start gap-3">
                                    <div className="font-bold justify-start text-base sm:text-[1.25rem] text-blue-500">94%</div> 
                                    <div className="text-base sm:text-[1.25rem] text-gray-700 leading-6 font-extralight">of Summarist members <span className="font-semibold text-gray-800">noticed an improvement</span> in their overall comprehension and retention of information.</div>
                                </div>
                            </div>,
                            <div key={2} className="flex flex-col gap-2">
                                <div className="flex flex-row justify-start items-start gap-3">
                                    <div className="font-bold justify-start text-base sm:text-[1.25rem] text-blue-500">88%</div> 
                                    <div className="text-base sm:text-[1.25rem] text-gray-700 leading-6 font-extralight">of Summarist members <span className="font-semibold text-gray-800">feel more informed</span> about current events and industry trends since using the platform.</div>
                                </div>
                            </div>
                        ]}
                />
                <div className={centerPadding} />
                <TextBlock flip={true} text={['Expand your learning', 'Accomplish your goals', 'Strengthen your vitality', 'Become a better caregiver', 'Improve your mood', 'Maximize your abilities']}/>
            </div>
        </div>
    )

}