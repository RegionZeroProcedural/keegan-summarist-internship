"use client";

type SubscriptionPlan = "yearly" | "monthly";

interface ChoosePlanSectionProps {
    selectedPlan: SubscriptionPlan;
    onPlanChange: (plan: SubscriptionPlan) => void;
}

export default function ChoosePlanSection({
    selectedPlan,
    onPlanChange,
}: ChoosePlanSectionProps) {
    const primarySelected = selectedPlan === "yearly";

    const transition =
        "transition-[background-color,border-color,box-shadow] duration-350 ease-in-out";

    const selectedStyle =
        "border-green-400 bg-green-50 shadow-[0_0_28px_rgba(74,222,128,0.28)]";

    const unselectedStyle =
        "border-gray-300 bg-gray-100 shadow-[0_0_0px_rgba(74,222,128,0)]";

    return (
        <section className="mx-auto flex w-full max-w-[53.75rem] flex-col items-center px-4">

            {/* SECTION TITLE */}
            <h2 className="mb-7 text-center text-[clamp(1.7rem,5vw,2.5rem)] font-bold text-gray-800 sm:mb-10">
                Choose the plan that fits you
            </h2>

            {/* PLAN SELECTOR */}
            <fieldset className="flex w-full flex-col">
                <legend className="sr-only">
                    Select your subscription plan
                </legend>

                {/* YEARLY PLAN */}
                <label
                    className={`
                        relative
                        flex
                        min-h-[10.75rem]
                        w-full
                        cursor-pointer
                        items-center
                        gap-4
                        rounded-md
                        border-2
                        p-4
                        sm:gap-7
                        sm:border-4
                        sm:p-7
                        focus-within:ring-2
                        focus-within:ring-green-500
                        focus-within:ring-offset-2
                        ${transition}
                        ${primarySelected ? selectedStyle : unselectedStyle}
                    `}
                >
                    <input
                        type="radio"
                        name="subscription-plan"
                        value="yearly"
                        checked={primarySelected}
                        onChange={() => onPlanChange("yearly")}
                        className="sr-only"
                    />

                    {/* RADIO CIRCLE */}
                    <span
                        aria-hidden="true"
                        className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border-3
                            ${transition}
                            ${
                                primarySelected
                                    ? "border-green-500 bg-white"
                                    : "border-gray-600 bg-gray-100"
                            }
                        `}
                    >
                        <span
                            className={`
                                h-3
                                w-3
                                rounded-full
                                bg-green-500
                                transition-[opacity,transform]
                                duration-350
                                ease-in-out
                                ${
                                    primarySelected
                                        ? "scale-100 opacity-100"
                                        : "scale-50 opacity-0"
                                }
                            `}
                        />
                    </span>

                    {/* PLAN INFORMATION */}
                    <div className="flex min-w-0 flex-col">
                        <div className="text-[clamp(1.15rem,4vw,1.5rem)] font-bold text-[var(--primary)]">
                            Premium Plus Yearly
                        </div>

                        <div className="text-[clamp(1.45rem,5vw,2rem)] font-bold text-[var(--primary)]">
                            $99.99/year
                        </div>

                        <div className="text-[1rem] text-gray-500">
                            7-day free trial included
                        </div>
                    </div>
                </label>

                {/* DIVIDER */}
                <div className="my-8 flex w-full items-center gap-5 px-4">
                    <div className="h-px flex-1 bg-gray-300" />

                    <span className="text-[1rem] font-semibold text-gray-500">
                        or
                    </span>

                    <div className="h-px flex-1 bg-gray-300" />
                </div>

                {/* MONTHLY PLAN */}
                <label
                    className={`
                        relative
                        flex
                        min-h-[9.5rem]
                        w-full
                        cursor-pointer
                        items-center
                        gap-4
                        rounded-md
                        border-2
                        p-4
                        sm:gap-7
                        sm:border-4
                        sm:p-7
                        focus-within:ring-2
                        focus-within:ring-green-500
                        focus-within:ring-offset-2
                        ${transition}
                        ${!primarySelected ? selectedStyle : unselectedStyle}
                    `}
                >
                    <input
                        type="radio"
                        name="subscription-plan"
                        value="monthly"
                        checked={!primarySelected}
                        onChange={() => onPlanChange("monthly")}
                        className="sr-only"
                    />

                    {/* RADIO CIRCLE */}
                    <span
                        aria-hidden="true"
                        className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border-3
                            ${transition}
                            ${
                                !primarySelected
                                    ? "border-green-500 bg-white"
                                    : "border-gray-600 bg-gray-100"
                            }
                        `}
                    >
                        <span
                            className={`
                                h-3
                                w-3
                                rounded-full
                                bg-green-500
                                transition-[opacity,transform]
                                duration-350
                                ease-in-out
                                ${
                                    !primarySelected
                                        ? "scale-100 opacity-100"
                                        : "scale-50 opacity-0"
                                }
                            `}
                        />
                    </span>

                    {/* PLAN INFORMATION */}
                    <div className="flex min-w-0 flex-col">
                        <div className="text-[clamp(1.15rem,4vw,1.5rem)] font-bold text-[var(--primary)]">
                            Premium Plus Monthly
                        </div>

                        <div className="text-[clamp(1.45rem,5vw,2rem)] font-bold text-[var(--primary)]">
                            $9.99/month
                        </div>

                        <div className="text-[1rem] text-gray-500">
                            7-day free trial not included
                        </div>
                    </div>
                </label>
            </fieldset>

        </section>
    );
}