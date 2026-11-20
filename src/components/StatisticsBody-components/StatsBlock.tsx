export default function StatsBlock({ text }: {text: React.ReactNode[]}) {
    
    return (
        <>
            <div className="flex min-h-[18rem] w-full min-w-0 flex-col justify-center gap-6 rounded-md bg-[var(--statsCard)] p-4 shadow-md sm:p-6 lg:max-w-[30rem]">
                {text.map((t, i) => (
                    <div className="flex flex-row gap-3" key={i}>
                        {t}
                    </div>
                ))}
            </div>
        </>
    )
}