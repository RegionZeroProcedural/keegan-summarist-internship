import { BsStarFill, BsStarHalf } from "react-icons/bs";

export default function BsStars({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 === 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, i) => (
                <BsStarFill key={i} className="text-blue-600" />
            ))}
            {halfStar && <BsStarFill key="half" className="text-blue-600" />}
            {[...Array(emptyStars)].map((_, i) => (
                <BsStarHalf key={i} className="text-blue-600" />
            ))}
        </div>
    );
}