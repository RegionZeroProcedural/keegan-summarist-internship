"use client";

import { useState, type ReactNode } from "react";
import ChoosePlanSection from "./ChoosePlanSection";
import StartTrialButton from "./StartTrialButton";

type SubscriptionPlan = "yearly" | "monthly";

interface ChoosePlanFlowProps {
    children: ReactNode;
}

export default function ChoosePlanFlow({ children }: ChoosePlanFlowProps) {
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("yearly");

    return (
        // Keep the hero, cards and CTA inside the same containing block.
        // Avoid overflow-hidden/auto here: either would break bottom sticky behavior.
        <div className="relative w-full">
            {children}

            <ChoosePlanSection
                selectedPlan={selectedPlan}
                onPlanChange={setSelectedPlan}
            />

            {/*
                Before the cards enter view, this bar sticks to the viewport bottom.
                Once scrolling reaches this spot in normal document flow, it
                becomes an ordinary part of the page and scrolls away with it.
                No fixed overlay, duplicate button or scroll listener is needed.
            */}
            <div
                className="sticky bottom-0 z-30 w-full bg-[var(--background)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 sm:pb-6 sm:pt-7"
            >
                <StartTrialButton plan={selectedPlan} />
            </div>
        </div>
    );
}
