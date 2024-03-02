'use client';

import useFlashcardsApi from '@/app/api/use-flashcards-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import WrittenTemplate from './_components/written-template';
import useProcess from '@/hooks/use-process';
import MultipleChoiceTemplate from './_components/mutiple-choice-template';
import { FlashcardType } from '@/types';
import QuestionOptions from './_components/question-options';
import QuestionOptionsModal from '@/components/modals/question-options-modal';
import { shuffleArray } from '@/lib/utils';
import { X } from 'lucide-react';
import Logo from '@/components/logo';

type TemplateType = React.ElementType<{
    flashcard: FlashcardType;
    pressedKey: string;
    flashcards: FlashcardType[];
}>;

const LearnPage = ({ params }: { params: { flashcardId: string } }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { getFlashcardSet } = useFlashcardsApi();

    const [pressedKey, setPressedKey] = useState('');
    const [currentFcardIndex, setCurrentFcardIndex] = useState(0);
    const [currentTemplate, setCurrentTemplate] = useState<TemplateType>();

    const {
        isWrittenAnswered,
        isChooseAnswerd,
        isSkipped,
        setProcess,
        setWrittenValue,
        setIsAnswered,
    } = useProcess();

    const handleNextQuestion = useCallback(
        (event: any) => {
            setProcess(null, false);
            setIsAnswered(null, false);
            setWrittenValue('');

            setPressedKey(event.key);
            setCurrentFcardIndex((prevIndex) => prevIndex + 1);
        },
        [setIsAnswered, setProcess, setWrittenValue],
    );

    useEffect(() => {
        const handleKeyPress = (e: any) => {
            if (isWrittenAnswered || isChooseAnswerd || isSkipped) {
                handleNextQuestion(e);
            }
        };

        const handleKeyUp = () => {
            setPressedKey('');
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleNextQuestion, isChooseAnswerd, isSkipped, isWrittenAnswered]);

    const { data } = useQuery({
        queryKey: ['get-flashcard-set'],
        queryFn: () => getFlashcardSet(parseInt(params.flashcardId)),
    });

    useEffect(() => {
        const Template = getTemplate(
            data?.flashcard_set_viewer.question_types,
            currentFcardIndex,
        );
        setCurrentTemplate(() => Template);
    }, [currentFcardIndex, data?.flashcard_set_viewer.question_types]);

    if (!data) return null;

    if (data.flashcard_set_viewer.is_first_setting) {
        return <QuestionOptions fcardSetViewer={data.flashcard_set_viewer} />;
    }

    const renderCurrentFlashcard = () => {
        const filteredData = data.flashcards.filter(
            (flashcard) => flashcard.term !== '' && flashcard.definition !== '',
        );

        const flashcard = filteredData[currentFcardIndex];

        if (!flashcard) {
            return (
                <div className='flex flex-col items-center gap-y-4'>
                    <div>Quiz completed!</div>
                    <Button
                        variant='green'
                        onClick={() => router.push(`/flashcards/${data.id}`)}
                    >
                        Go back
                    </Button>
                </div>
            );
        }

        return (
            <>
                <div className='bg-white w-full fixed z-40 top-0 min-h-[60px] flex items-center justify-between py-1 px-5'>
                    <Logo />
                    <p className='font-semibold text-xl'>{data.title}</p>
                    <div className='flex items-center justify-center gap-x-3'>
                        <QuestionOptionsModal
                            fcardSetViewer={data.flashcard_set_viewer}
                        />
                        <Button
                            size='icon'
                            variant='outline'
                            className='rounded-full'
                            onClick={router.back}
                        >
                            <X />
                        </Button>
                    </div>
                </div>
                <div className='ml-[15%] w-full mt-20'>
                    {currentTemplate === WrittenTemplate ? (
                        <WrittenTemplate
                            flashcard={flashcard}
                            pressedKey={pressedKey}
                        />
                    ) : (
                        <MultipleChoiceTemplate
                            flashcard={flashcard}
                            flashcards={data.flashcards}
                        />
                    )}
                    {(isWrittenAnswered || isChooseAnswerd || isSkipped) && (
                        <div className='bg-white mt-10 p-3 w-full rounded-full flex items-center'>
                            <p className='text-center flex-1 text-base'>
                                Press any key to continue
                            </p>
                            <Button
                                onClick={handleNextQuestion}
                                variant='green'
                                className=' px-7 ml-auto flex-shrink-0'
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return <div key={currentFcardIndex}>{renderCurrentFlashcard()}</div>;
};

const getTemplate = (
    questionTypes: string[] | undefined,
    currentFcardIndex: number,
) => {
    if (!questionTypes) return;

    if (questionTypes.length === 1) {
        return questionTypes.includes('Written')
            ? WrittenTemplate
            : MultipleChoiceTemplate;
    }

    const shuffledFlashcards = shuffleArray(questionTypes);

    const templateIndex = currentFcardIndex % shuffledFlashcards.length;
    return shuffledFlashcards[templateIndex] === 'Written'
        ? WrittenTemplate
        : MultipleChoiceTemplate;
};

export default LearnPage;
