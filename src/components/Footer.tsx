export default function Footer() {
    return (
        <>
            <div className="mt-14 flex w-full min-w-0 flex-col items-center bg-[var(--footerBG)] px-5 pb-8 pt-10 sm:px-8 lg:pt-14">

                    <div className="grid w-full max-w-[72rem] grid-cols-1 gap-x-5 gap-y-9 text-left min-[360px]:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-12">
                        <div className="flex min-w-0 flex-col items-start">
                            <div className="text-gray-700 text-[1.1rem] font-bold sm:text-[1.35rem]">
                                Actions
                            </div>
                            <div className="flex min-w-0 flex-col gap-2 pt-3 text-start text-gray-600">
                                <p className="cursor-not-allowed text-sm sm:text-base">Summarist Magazine</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Cancel Subscription</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Help</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Contact Us</p>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-start">
                            <div className="text-gray-700 text-[1.1rem] font-bold sm:text-[1.35rem]">
                                Useful Links
                            </div>
                            <div className="flex min-w-0 flex-col gap-2 pt-3 text-start text-gray-600">
                                <p className="cursor-not-allowed text-sm sm:text-base">Pricing</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Summarist Business</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Gift Cards</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Authors & Publishers</p>
                            </div>
                        </div><div className="flex min-w-0 flex-col items-start">
                            <div className="text-gray-700 text-[1.1rem] font-bold sm:text-[1.35rem]">
                                Company
                            </div>
                            <div className="flex min-w-0 flex-col gap-2 pt-3 text-start text-gray-600">
                                <p className="cursor-not-allowed text-sm sm:text-base">About</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Careers</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Partners</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Code of Conduct</p>
                            </div>
                        </div><div className="flex min-w-0 flex-col items-start">
                            <div className="text-gray-700 text-[1.1rem] font-bold sm:text-[1.35rem]">
                                Other
                            </div>
                            <div className="flex min-w-0 flex-col gap-2 pt-3 text-start text-gray-600">
                                <p className="cursor-not-allowed text-sm sm:text-base">Sitemap</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Legal Notice</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Terms of Service</p>
                                <p className="cursor-not-allowed text-sm sm:text-base">Privacy Policies</p>
                            </div>
                        </div>
                    </div>
                <div className="mt-10 text-center text-sm font-semibold text-gray-700 sm:text-base">
                    Copyright © 2023 Summarist.
                </div>
            </div>
        </>
    )
}