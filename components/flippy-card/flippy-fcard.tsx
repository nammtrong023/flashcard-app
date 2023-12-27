import ReactCardFlip from 'react-card-flip';

import React, { useState } from 'react';
import { FlashcardType } from '@/types';

interface FlippyCardProps {
    flashcard: FlashcardType;
}

const FlippyCard = ({ flashcard }: FlippyCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsFlipped((prevState) => !prevState);
    };

    return (
        <ReactCardFlip
            isFlipped={isFlipped}
            flipDirection='vertical'
            containerClassName='w-full h-full'
        >
            <div
                className='w-full h-full flex items-center justify-center bg-white rounded-2xl'
                onClick={handleClick}
            >
                {flashcard.term}
            </div>
            <div
                className='w-full h-full flex items-center justify-center bg-white rounded-2xl'
                onClick={handleClick}
            >
                {flashcard.definition}
            </div>
        </ReactCardFlip>
    );
};

export default FlippyCard;
