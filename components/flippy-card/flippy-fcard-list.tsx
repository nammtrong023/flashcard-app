'use client';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import React, { useState } from 'react';
import FlippyCard from './flippy-fcard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FlashcardType } from '@/types';

const CLASS_NAME_BUTTON = `flex items-center justify-center w-fit rounded-full bg-greenPrimary hover:bg-greenPrimary/80 transition-colors p-2 flex-shrink-0 cursor-pointer text-white`;

const FlippyFCardList = ({ flashcards }: { flashcards: FlashcardType[] }) => {
    const totalFcards = flashcards.length;
    const [index, setIndex] = useState(1);

    return (
        <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            allowTouchMove={false}
            speed={500}
            draggable={false}
            navigation={{
                prevEl: '.prev',
                nextEl: '.next',
            }}
            className='!w-full !h-[600px] relative !bg-transparent'
        >
            {flashcards.map((flashcard) => (
                <SwiperSlide
                    key={flashcard.id}
                    className='!w-full !h-[88%] rounded-2xl !bg-transparent'
                >
                    <FlippyCard flashcard={flashcard} />
                </SwiperSlide>
            ))}

            <div className='flex items-center justify-between gap-x-2 absolute bottom-0 bg-white max-h-[50px] w-fit h-full rounded-full p-2 z-30 left-1/2'>
                <button
                    className={`prev ${CLASS_NAME_BUTTON}`}
                    disabled={index === 1}
                    onClick={() => setIndex((prev) => prev - 1)}
                >
                    <ChevronLeft size={16} />
                </button>
                <div className='w-fit text-sm'>
                    {index}/{totalFcards}
                </div>
                <button
                    disabled={index === totalFcards}
                    className={`next ${CLASS_NAME_BUTTON}`}
                    onClick={() => setIndex((prev) => prev + 1)}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </Swiper>
    );
};

export default FlippyFCardList;
