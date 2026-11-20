export default function AwardEyebrow({ text }: {text: string}) {
    return (
        <p className="mt-12 text-center text-[clamp(1.6rem,4vw,2rem)] font-bold leading-tight text-gray-800 sm:mt-20">
            {text}
        </p>
    )
}