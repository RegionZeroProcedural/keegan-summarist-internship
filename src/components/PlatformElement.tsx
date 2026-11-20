import { AiFillFileText, AiFillBulb, AiFillAudio } from "react-icons/ai";

const icons = [AiFillFileText, AiFillBulb, AiFillAudio];

type PlatformElementProps = {
    titleText: string;
    bodyText: string;
    position: number;
};

export default function PlatformElement({
    titleText,
    bodyText,
    position
}: PlatformElementProps) {

    const Icon = icons[position];

    return (
        <div className="flex w-full max-w-[18.75rem] flex-col items-center justify-center px-2">

            {Icon && <Icon className="text-6xl text-[var(--primary)]" />}

            <div className="pt-4 text-center text-[1.25rem] font-bold leading-tight text-[var(--primary)] sm:text-[1.4rem]">
                {titleText}
            </div>

            <div className="max-w-[22rem] text-center text-base leading-relaxed text-gray-600 sm:text-[1.1rem]">
                {bodyText}
            </div>

        </div>
    );
}