'use client';

import useFlashcardsApi from '@/app/api/use-flashcards-api';
import Container from '@/components/container';
import FlashcardSetViewerForm from '@/components/flashcards/flashcard-set-viewer-form';
import IconButton from '@/components/icon-button';
import { Input } from '@/components/ui/input';
import { FlashcardSetType } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';

const FlashcardPage = ({ params }: { params: { flashcardId: string } }) => {
    const queryClient = useQueryClient();
    const [inputValue, setInputValue] = useState(1);

    const { getFlashcardSet, createFlashcard } = useFlashcardsApi();

    const { data } = useQuery({
        queryKey: ['get-flashcard-set'],
        queryFn: () => getFlashcardSet(parseInt(params.flashcardId)),
    });

    const { mutate } = useMutation({
        mutationKey: ['create-new-flashcard'],
        mutationFn: () =>
            createFlashcard(parseInt(params.flashcardId), inputValue),

        onSuccess: (newFlashcard) => {
            queryClient.invalidateQueries({ queryKey: ['get-flashcard-set'] });

            queryClient.setQueryData(
                ['get-flashcard-set'],
                (existingData: FlashcardSetType) => {
                    const newData = {
                        ...existingData,
                        flashcards: [...existingData.flashcards, newFlashcard],
                    };

                    return newData;
                },
            );
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let inputValue = Number(e.target.value);

        if (!isNaN(inputValue)) {
            inputValue = Math.min(inputValue, 100);

            setInputValue(inputValue);
        }

        return inputValue;
    };

    if (!data) return null;

    return (
        <Container>
            <div className='h-full w-full mx-auto'>
                <FlashcardSetViewerForm initialData={data} />

                <div className='mt-6 w-full bg-white rounded-xl h-[90px] p-5 flex items-center justify-center'>
                    <div className='flex items-center justify-center gap-x-7'>
                        <IconButton
                            className='border-none hover:bg-transparent w-fit'
                            size={24}
                            disabled={inputValue === 0}
                            icon={Plus}
                            onClick={() => mutate()}
                        />
                        <p className='text-xl font-medium'>Add card(s)</p>
                        <Input
                            type='text'
                            value={inputValue}
                            maxLength={3}
                            onChange={handleChange}
                            className='text-black rounded-full w-fit h-[40px] max-w-[80px] text-base font-medium'
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default FlashcardPage;
