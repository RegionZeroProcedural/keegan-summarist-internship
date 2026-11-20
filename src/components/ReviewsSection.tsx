import Review from "./Review";
import { LoginButton, ButtonProps } from "./LoginButton";

export default function ReviewsSection({ toggleLogin }: ButtonProps) {

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="text-center text-[clamp(1.6rem,4vw,1.8rem)] font-bold text-gray-900">
                    What our members say
                </div>
                <div className="mt-8 flex w-full max-w-[80rem] flex-col items-center justify-center gap-6 sm:gap-8">
                    <Review name="Hanna M." comment={<p>This app has been a <span className="font-semibold text-gray-700">game-changer</span> for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers.</p>} />
                    <Review name="David B." comment={<p>I love this app! It provides <span className="font-semibold text-gray-700">concise and accurate summaries</span> of books in a way that is easy to understand. It's also very user-friendly and intuitive.</p>} />
                    <Review name="Nathan S." comment={<p>This app is a great way to get the main takeaways from a book without having to read the entire thing. <span className="font-semibold text-gray-700">The summaries are well-written and informative.</span> Definitely worth downloading.</p>} />
                    <Review name="Ryan R." comment={<p>If you're a busy person who <span className="font-semibold text-gray-700">loves reading but doesn't have the time</span> to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content.</p>} />
                    <LoginButton {... {toggleLogin}}/>
                </div>
            </div>
        </>
    )

}