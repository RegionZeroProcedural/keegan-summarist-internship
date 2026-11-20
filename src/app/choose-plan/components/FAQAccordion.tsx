"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: "How does the free 7-day trial work?",
        answer:
            "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
    },
    {
        question:
            "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
        answer:
            "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
    },
    {
        question: "What's included in the Premium plan?",
        answer:
            "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
    },
    {
        question: "Can I cancel during my trial or subscription?",
        answer:
            "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
    },
];

export default function FAQAccordion() {

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    function toggleFAQ(index: number) {
        setExpandedIndex((previous) =>
            previous === index ? null : index
        );
    }

    return (
        <section className="mx-auto w-full max-w-[80rem] px-5">

            {faqItems.map((item, index) => {

                const isExpanded = expandedIndex === index;

                return (
                    <div
                        key={index}
                        className="border-b border-gray-300"
                    >

                        {/* Question */}
                        <button
                            type="button"
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={isExpanded}
                            aria-controls={`faq-answer-${index}`}
                            className="flex w-full cursor-pointer items-center justify-between gap-3 py-5 text-left text-[var(--primary)] sm:gap-6 sm:py-8"
                        >
                            <span className="text-[clamp(1.15rem,3.5vw,1.75rem)] font-semibold">
                                {item.question}
                            </span>

                            <FiChevronDown
                                className={[
                                    "shrink-0",
                                    "text-[1.5rem] sm:text-[1.75rem]",
                                    "transition-transform",
                                    "duration-300",
                                    "ease-in-out",
                                    isExpanded ? "rotate-180" : "rotate-0",
                                ].join(" ")}
                            />
                        </button>

                        {/* Animated answer */}
                        <div
                            id={`faq-answer-${index}`}
                            aria-hidden={!isExpanded}
                            className={[
                                "grid",
                                "transition-[grid-template-rows,opacity]",
                                "duration-300",
                                "ease-in-out",
                                isExpanded
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0",
                            ].join(" ")}
                        >
                            <div className="min-h-0 overflow-hidden">

                                <p className="pb-6 text-base leading-relaxed text-[var(--primary)] sm:pb-7 sm:text-[1.25rem]">
                                    {item.answer}
                                </p>

                            </div>
                        </div>

                    </div>
                );
            })}

        </section>
    );
}