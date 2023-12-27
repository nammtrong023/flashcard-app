import { Button } from '@/components/ui/button';
import TextareaResize from '@/components/ui/textarea-resize';
import useProcess from '@/hooks/use-process';
import { cn } from '@/lib/utils';
import { FlashcardType } from '@/types';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

const MIN_TEXTAREA_HEIGHT = 45;

const WrittenTemplate = ({
    flashcard,
    pressedKey,
}: {
    flashcard: FlashcardType;
    pressedKey: string | undefined;
}) => {
    const [isCorrect, setIsCorrect] = useState(false);

    const {
        isSkipped,
        writtenValue,
        process,
        isWrittenAnswered,
        setProcess,
        setIsAnswered,
        setWrittenValue,
    } = useProcess();

    const answer =
        (isWrittenAnswered && !isCorrect) || isSkipped
            ? flashcard.term
            : writtenValue;
    let title;

    switch (true) {
        case isWrittenAnswered && isCorrect:
            title = 'You got it right!';
            break;
        case isWrittenAnswered && !isCorrect:
            title = 'This is the right answer';
            break;
        case isSkipped:
            title = "You skipped this, here's the right response.";
            break;
        default:
            title = 'Answer to the best of your ability';
    }

    const handleSkip = useCallback(() => {
        setProcess('skip', true);
        setWrittenValue(flashcard.term);
    }, [flashcard.term, setProcess, setWrittenValue]);

    const handleAnswer = useCallback(() => {
        const cleanedText = writtenValue.replace(/\s+/g, ' ');

        if (!cleanedText.trim()) {
            return handleSkip();
        }

        setWrittenValue(cleanedText);
        setIsAnswered('writtenAnswer', true);
        setIsCorrect(cleanedText === flashcard.term);
    }, [
        flashcard.term,
        writtenValue,
        handleSkip,
        setIsAnswered,
        setWrittenValue,
    ]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (pressedKey) return;

        setWrittenValue(e.target.value);
    };

    useEffect(() => {
        if (process === null) {
            setWrittenValue('');
        }
    }, [process, setWrittenValue]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && process === null && !event.shiftKey) {
                event.preventDefault();
                handleAnswer();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleAnswer, process]);

    return (
        <div className='bg-white rounded-xl p-7 space-y-10 mx-auto'>
            <div className='space-y-10 text-lg'>
                <p>Definition</p>
                <p>{flashcard.definition}</p>
            </div>
            {isWrittenAnswered && !isCorrect && (
                <div>
                    <p className='font-medium text-base mb-3 text-red'>
                        Sorry that doesn&apos;t look right
                    </p>
                    <div className='flex items-center justify-between gap-x-3'>
                        <TextareaResize
                            value={writtenValue}
                            onChange={handleChange}
                            minTextareaHeight={MIN_TEXTAREA_HEIGHT}
                            readOnly
                            className={cn(
                                'overflow-hidden rounded-xl text-base bg-red/10 ring-red ring-2 outline-none border-0',
                            )}
                        />
                    </div>
                </div>
            )}
            <div>
                <p
                    className={cn(
                        'font-medium text-base mb-3 text-black',
                        isSkipped && 'text-purpleD9',
                        isWrittenAnswered && 'text-greenPrimary',
                    )}
                >
                    {title}
                </p>
                <div className='flex items-center justify-between gap-x-3'>
                    <TextareaResize
                        value={answer}
                        placeholder='Write your answer'
                        onChange={handleChange}
                        autoFocus={true}
                        minTextareaHeight={MIN_TEXTAREA_HEIGHT}
                        readOnly={isSkipped || isWrittenAnswered}
                        className={cn(
                            'overflow-hidden rounded-xl text-base',
                            isSkipped &&
                                'bg-purpleD9/50 ring-purpleD9 ring-2 outline-none border-0',
                            isWrittenAnswered &&
                                'bg-greenPrimary/10 ring-greenPrimary ring-2 outline-none border-0',
                        )}
                    />
                    <div
                        className={cn(
                            'flex items-center gap-x-2',
                            (isSkipped || isWrittenAnswered) && 'hidden',
                        )}
                    >
                        <Button onClick={handleSkip}>Skip</Button>
                        <Button onClick={handleAnswer}>Answer</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WrittenTemplate;
