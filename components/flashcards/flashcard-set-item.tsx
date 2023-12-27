import React from 'react';
import { FlashcardSetType } from '@/types';
import { useRouter } from 'next/navigation';
import DropDownFcardOptions from '../dropdown-fcard-options';

const FlashcardSetItem = ({
    flashcardSet,
}: {
    flashcardSet: FlashcardSetType;
}) => {
    const router = useRouter();

    const goToFlashcardSet = () => {
        if (!flashcardSet.id) return;

        router.push(`/flashcards/${flashcardSet.id}`);
    };

    return (
        <div
            className='p-3 w-full min-w-[225px] group bg-white hover:bg-graySecondary transition-colors rounded-xl cursor-pointer text-sm font-medium'
            onClick={goToFlashcardSet}
        >
            <div className='flex items-center justify-between'>
                <p className=''>{flashcardSet.title || '(Untitled)'}</p>
                <DropDownFcardOptions fcardSetId={flashcardSet.id} />
            </div>
            <div className='space-y-3 mt-3 px-1'>
                <div className='rounded-full bg-graySecondary/60 p-2 w-fit group-hover:bg-gray-100'>
                    Flashcard
                </div>
                <div className='rounded-full w-fit bg-graySecondary/60 p-2 group-hover:bg-gray-100'>
                    {flashcardSet.flashcards.length} Terms
                </div>
            </div>
        </div>
    );
};

export default FlashcardSetItem;
