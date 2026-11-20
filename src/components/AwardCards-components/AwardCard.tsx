export default function AwardCard({ icon, title, description }: { icon?: React.ReactNode; title?: string; description?: string }) {

    return (
        <>
            <div className="flex min-h-52 w-full max-w-[20rem] flex-col items-center gap-5 rounded-lg bg-[var(--awardBG)] p-6 text-center font-extralight leading-5 shadow-md">
                <div className="text-4xl">
                    {icon}
                </div>
                <div className="text-[2.5rem] font-bold mb-2">{title}</div>
                <p className="text-gray-600">{description}</p>
            </div>
        </>
    )

}