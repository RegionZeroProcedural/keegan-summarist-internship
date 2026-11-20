import Footer from "@/components/Footer";
import PlanPageHeader from "./components/PlanPageHeader";
import ChoosePlanFlow from "./components/ChoosePlanFlow";
import FAQAccordion from "./components/FAQAccordion";
import CheckLoggedInAndSubscribed from "./components/CheckLoggedInAndSubscribed";

export default function ChoosePlan() {
    return (
        <>
            <CheckLoggedInAndSubscribed />
            <ChoosePlanFlow>
                <PlanPageHeader />
            </ChoosePlanFlow>
            <FAQAccordion />
            <Footer />
        </>
    );
}
