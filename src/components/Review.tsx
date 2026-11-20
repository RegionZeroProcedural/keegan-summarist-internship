import react from "react";
import BsStars from "./BsStars";

export default function Review({ name, comment }: { name?: string; comment?: react.ReactNode; }) {
    return (
        <>
            <div className="flex w-full max-w-[37.5rem] min-w-0 flex-col gap-2 rounded-sm bg-[var(--reviewBG)] p-4 shadow-md sm:p-5">
                <div className="text-lg font-extralight text-gray-900">
                    <div className="flex max-w-[25rem] flex-wrap items-center gap-2 sm:gap-3">
                        {name || "Anonymous"} 
                        <BsStars rating={5} />
                    </div>
                </div>
                <div className="text-gray-600 font-extralight">
                    {comment || "No comment provided."}
                </div>
            </div>
        </>
    )
}