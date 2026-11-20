import Image from "next/image";
import login from "/public/assets/login.png";
import { LoginButton, ButtonProps } from "./LoginButton";

export default function Hero({ toggleLogin }: ButtonProps) {
    return (
        <div className="flex min-w-0 flex-col items-center justify-between gap-8 py-10 sm:py-14 lg:flex-row lg:gap-10 lg:py-20">
            <div className="flex w-full min-w-0 flex-col items-center gap-6 text-center lg:max-w-[35rem] lg:items-start lg:text-left">
                <h1 className="max-w-[34rem] text-[clamp(2rem,6vw,3rem)] leading-tight font-bold text-[var(--primary)]">Gain more knowledge
in less time</h1>
                <p className="max-w-[26rem] text-base leading-relaxed text-gray-600 sm:text-lg">Great summaries for busy people,
individuals who barely have time to read,
and even people who don’t like to read.</p>
                <LoginButton {... {toggleLogin}}/>
            </div>
            <div className="flex w-full max-w-[25rem] min-w-0 justify-center lg:mt-4 lg:max-w-[25rem] lg:justify-end">
                <Image src={login} alt="Read and listen to book summaries" className="h-auto w-full max-w-[25rem] object-contain" priority />
            </div>
        </div>
    )
}