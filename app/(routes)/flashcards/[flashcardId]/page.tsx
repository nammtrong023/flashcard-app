'use client';

import useFlashcardsApi from '@/app/api/use-flashcards-api';
import Container from '@/components/container';
import FlashcardItem from '@/components/flashcards/flashcard-item';
import FlippyFCardList from '@/components/flippy-card/flippy-fcard-list';
import IconButton from '@/components/icon-button';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import React from 'react';

const FlashcardPage = ({ params }: { params: { flashcardId: string } }) => {
    const router = useRouter();
    const { getFlashcardSet } = useFlashcardsApi();
    const fcardId = parseInt(params.flashcardId);

    const { data, isFetching } = useQuery({
        queryKey: ['get-flashcard-set'],
        queryFn: () => getFlashcardSet(fcardId),
    });

    if (isFetching) return null;

    if (!data?.flashcard_set_viewer) {
        return redirect(`/flashcards/${params.flashcardId}/edit`);
    }

    return (
        <Container>
            <div className='space-y-5 mx-auto'>
                <IconButton
                    title='Go back'
                    icon={ArrowLeft}
                    onClick={() => router.push('/')}
                />
                <h2 className='font-medium text-3xl'>{data.title}</h2>
                <div className='flex justify-between gap-x-3 w-full min-h-[600px] h-full'>
                    <div className='w-full h-full relative'>
                        <FlippyFCardList flashcards={data.flashcards} />
                        <Button
                            variant='outline'
                            onClick={() => router.push(`${fcardId}/learn`)}
                            className='absolute top-5 right-5 z-40'
                        >
                            Learn
                        </Button>
                    </div>
                </div>
                <div className='h-full'>
                    <span className='font-medium text-3xl'>
                        {data.flashcards.length} Terms
                    </span>
                    <div className='space-y-10 h-full'>
                        {data.flashcards.map((flashcard) => (
                            <FlashcardItem
                                key={flashcard.id}
                                flashcard={flashcard}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default FlashcardPage;
