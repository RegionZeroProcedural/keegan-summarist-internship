import Image from 'next/image';
import { FiClock } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import SubPill from './SubPill';

interface bookProps {
    image: string
    title: string
    author: string
    body: string
    time: string
    rating: number
    subscriptionRequired: boolean
}

export default function Book({ image, title, author, body, time, rating, subscriptionRequired }: bookProps) {
    return (
        <>
            {subscriptionRequired && (
                <div className="absolute top-2 right-2 z-10">
                    <SubPill />
                </div>
            )}
            <div className="pt-10 flex flex-col">
                <Image src={image} alt='Book Cover' width={176} height={180} className='h-45 w-44 object-contain' />
                <h1 className='font-bold text-[0.95rem] leading-4.5 h-auto w-44'>{title}</h1>
                <h2 className='font-extralight mt-1 mb-1 w-44 text-[0.95em] text-gray-400'>{author}</h2>
                <p className='font-light text-[0.85rem] w-44 text-gray-700 leading-4.5'>{body}</p>
                <div className="flex flex-row items-start">
                    <FiClock className="w-4 h-4 font-bold mt-2"/> 
                    <div className="font-light text-gray-400 pt-1.5 pl-2">{time}</div>
                    <FaRegStar className="w-4 h-4 ml-3 font-bold mt-2"/>
                    <div className="font-light text-gray-400 pt-1.5 pl-2">{rating}</div>
                </div>
            </div>
        </>
    )
}