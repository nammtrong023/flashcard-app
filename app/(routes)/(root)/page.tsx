'use client';

import FlashcardItem from '@/components/flashcards/flashcard-set-item';
import { DropdownMenuCreate } from '@/components/dropdown-menu-create';
import useFlashcardsApi from '@/app/api/use-flashcards-api';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
    const { getFlashcardSets } = useFlashcardsApi();

    const { data } = useQuery({
        queryKey: ['get-flashcard-sets'],
        queryFn: getFlashcardSets,
    });

    if (!data) return null;

    return (
        <div className='max-w-5xl'>
            <div className='w-full space-y-20'>
                <div>
                    <DropdownMenuCreate />
                </div>
                <div className='space-y-2'>
                    <h2 className=''>Your file</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {data.map((flashcardSet) => (
                            <FlashcardItem
                                key={flashcardSet.id}
                                flashcardSet={flashcardSet}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
