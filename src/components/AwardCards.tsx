import AwardEyebrow from "./AwardCards-components/AwardEyebrow";
import AwardCard from "./AwardCards-components/AwardCard";
import BsStars from "./BsStars";
import { BiLeaf, BiCrown } from "react-icons/bi";

export default function AwardCards() {

    return (
        <>
            <div className="flex flex-col">
                <AwardEyebrow text="Start growing with Summarist now" />
                <div className="mt-8 grid w-full grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    <AwardCard icon={
                            <div className='text-blue-600'>
                                <BiCrown className="text-[3rem]"/>
                            </div>
                        } title="3 Million" description="Downloads on all platforms" />
                    <AwardCard icon={
                        <div className="max-w-[7rem] h-4 m-4 translate-y-[-0.5rem]">
                            <BsStars rating={4.5} />
                        </div>
                        }
                        title="4.5 Stars" description="Average ratings on iOS and Google Play" />
                    <AwardCard icon={
                        <div className="text-blue-600">
                            <BiLeaf className="text-[3rem]"/>
                        </div>
                        } title="97%" description="Of Summarist members create a better reading habit" />
                </div>
            </div>
        </>
    )

}