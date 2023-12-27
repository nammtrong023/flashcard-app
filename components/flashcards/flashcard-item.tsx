import React from 'react';
import { FlashcardType } from '@/types';
import { Button } from '../ui/button';
import { Edit2 } from 'lucide-react';
import { useModalStore } from '@/hooks/use-modal-store';
import { useFlashcardStore } from '@/hooks/use-flashcard-store';

const FlashcardItem = ({ flashcard }: { flashcard: FlashcardType }) => {
    const { onOpen } = useModalStore();
    const { setFcard } = useFlashcardStore();

    const handleClick = () => {
        setFcard(flashcard);
        onOpen('editCard');
    };

    return (
        <div className='bg-white p-5 min-h-[150px] h-full rounded-xl w-full flex items-center justify-center relative'>
            <div className='min-h-[110px] h-full w-full flex items-center justify-center'>
                <div className='border border-y-0 border-l-0 border-r-2 h-full flex items-center justify-center min-h-[60px] w-[40%]'>
                    {flashcard.term}
                </div>
                <div className='w-full h-full min-h-[80px] flex items-center justify-center flex-1'>
                    {flashcard.definition}
                </div>
            </div>
            <div className='absolute right-5 top-3 z-40'>
                <Button
                    variant='outline'
                    size='icon'
                    className='rounded-full border border-black'
                    onClick={handleClick}
                >
                    <Edit2 className='w-4 h-4' />
                </Button>
            </div>
        </div>
    );
};

export default FlashcardItem;
