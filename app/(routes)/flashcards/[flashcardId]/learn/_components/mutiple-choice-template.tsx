import useProcess from '@/hooks/use-process';
import { useProcessStore } from '@/hooks/use-process-store';
import { cn } from '@/lib/utils';
import { FlashcardType } from '@/types';
import { Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const MultipleChoiceTemplate = ({
    flashcard,
    flashcards,
}: {
    flashcard: FlashcardType;
    flashcards: FlashcardType[];
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState({
        id: 0,
        answer: '',
    });
    const [isMounted, setIsMounted] = useState(false);

    const { isSelected, setProcess, setIsAnswered } = useProcess();
    const colors = ['#dbeeff', '#fdf0e3', '#e6dff2', '#ebf2df'];

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        };
    }, []);

    const isCorrectAnswer = selectedAnswer.answer === flashcard.definition;
    const [otherFcards, setOtherFcards] = useState<FlashcardType[]>([]);

    function getRandomItems(
        list: FlashcardType[] | undefined,
        exclude: FlashcardType,
    ) {
        if (!list) return [];

        const filterCurrent = list.filter((fcard) => fcard.id !== exclude.id);

        const shuffled = filterCurrent.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }

    useEffect(() => {
        const updatedOtherFlashcards = getRandomItems(flashcards, flashcard);
        setOtherFcards(updatedOtherFlashcards);
    }, [flashcard, flashcards]);

    useEffect(() => {
        if (isSelected === true && isCorrectAnswer) {
            console.log('correct');
        }

        if (isSelected === true && !isCorrectAnswer) {
            console.log('wrong');
        }
    }, [isCorrectAnswer, isSelected, selectedAnswer]);

    const handleAnswer = (id: number, answer: string) => {
        setProcess('selectedAnswer', true);
        setIsAnswered('choiceAnswer', true);
        setSelectedAnswer({ id, answer });
    };

    const wrongAnswer = (id: number) =>
        isSelected && !isCorrectAnswer && id === selectedAnswer.id;

    if (!isMounted) return null;

    return (
        <div className='bg-white rounded-xl p-7 space-y-20 mx-auto'>
            <div className='space-y-10 text-lg'>
                <p>Definition</p>
                <p>{flashcard.definition}</p>
            </div>
            <div>
                <p className='font-medium text-base mb-3'>
                    Select the matching term
                </p>
                <div className='grid grid-cols-2 gap-3'>
                    <AnswerOption
                        isSelected={isSelected}
                        term={flashcard.term}
                        onClick={() =>
                            handleAnswer(flashcard.id, flashcard.term)
                        }
                        className={cn(
                            isSelected &&
                                'border-greenPrimary bg-greenPrimary/10',
                        )}
                        backgroundColor={isSelected ? '#50d2c2' : colors[0]}
                    >
                        {isSelected ? <Check className='text-white' /> : 1}
                    </AnswerOption>

                    {otherFcards.map((otherFcard, index) => (
                        <AnswerOption
                            key={otherFcard.id}
                            isSelected={isSelected}
                            term={otherFcard.term}
                            className={cn(
                                isSelected &&
                                    wrongAnswer(otherFcard.id) &&
                                    'bg-red/10 border-red',
                            )}
                            onClick={() =>
                                handleAnswer(otherFcard.id, otherFcard.term)
                            }
                            backgroundColor={
                                wrongAnswer(otherFcard.id)
                                    ? '#f47b7b'
                                    : colors[index + 1]
                            }
                        >
                            {wrongAnswer(otherFcard.id) ? (
                                <X className='text-white' />
                            ) : (
                                index + 2
                            )}
                        </AnswerOption>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AnswerOption = ({
    term,
    isSelected,
    backgroundColor,
    children,
    className,
    onClick,
}: {
    term: string;
    isSelected: boolean | null;
    backgroundColor: string;
    children: React.ReactNode;
    className: string;
    onClick: () => void;
}) => (
    <div
        className={cn(
            'border flex items-center gap-x-2 h-fit p-3 cursor-pointer rounded-xl',
            isSelected && 'pointer-events-none',
            className,
        )}
        onClick={onClick}
    >
        <div
            className='w-10 h-10 p-2 rounded-lg flex items-center justify-center text-base'
            style={{
                background: backgroundColor,
            }}
        >
            {children}
        </div>
        {term}
    </div>
);

export default MultipleChoiceTemplate;
