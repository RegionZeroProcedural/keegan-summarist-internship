import Image from "next/image";
import HeroImage from "../../../../public/assets/pricing-top.webp";
import { IoNewspaperSharp } from "react-icons/io5";
import { GiThreeLeaves } from "react-icons/gi";
import { FaHandshake } from "react-icons/fa";

export default function PlanPageHeader() {
    return (
        <>
            <section className="relative flex w-full flex-col items-center rounded-b-[clamp(3rem,16vw,21rem)] bg-[var(--primary)] px-4 pb-0 pt-12 text-center text-white sm:px-6 sm:pt-16">
                <h1 className="max-w-[72rem] text-[clamp(2rem,6vw,3.65rem)] font-bold leading-[1.12]">
                    Get unlimited access to many amazing books to read
                </h1>
                <p className="mt-6 max-w-[50rem] text-base leading-relaxed sm:mt-8 sm:text-[1.4rem]">
                    Turn ordinary moments into amazing learning opportunities
                </p>
                <div className="mt-9 w-full max-w-[27.5rem] overflow-hidden rounded-t-[45%] sm:mt-12">
                    <Image src={HeroImage} alt="Summarist premium reading" className="h-auto w-full object-contain" priority />
                </div>
            </section>
            <section aria-label="Subscription benefits" className="mx-auto grid w-full max-w-[80rem] grid-cols-1 gap-8 px-5 py-12 sm:grid-cols-3 sm:gap-6 sm:px-8 lg:gap-14 lg:py-20">
                <div className="flex flex-col items-center gap-4 text-center">
                    <IoNewspaperSharp aria-hidden="true" className="text-[3.25rem] text-[var(--primary)] sm:text-[4rem]" />
                    <p className="text-base leading-relaxed text-gray-700 sm:text-lg"><strong>Key ideas in few min</strong> with many books to read</p>
                </div>
                <div className="flex flex-col items-center gap-4 text-center">
                    <GiThreeLeaves aria-hidden="true" className="text-[3.25rem] text-[var(--primary)] sm:text-[4rem]" />
                    <p className="text-base leading-relaxed text-gray-700 sm:text-lg"><strong>3 million</strong> people growing with Summarist everyday</p>
                </div>
                <div className="flex flex-col items-center gap-4 text-center">
                    <FaHandshake aria-hidden="true" className="text-[3.25rem] text-[var(--primary)] sm:text-[4rem]" />
                    <p className="text-base leading-relaxed text-gray-700 sm:text-lg"><strong>Precise recommendations</strong> collections curated by experts</p>
                </div>
            </section>
        </>
    );
}
