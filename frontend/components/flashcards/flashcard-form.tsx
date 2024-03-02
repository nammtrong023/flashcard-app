import React, { useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { FlashcardFormType } from './flashcard-set-viewer-form';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import useFlashcardsApi from '@/app/api/use-flashcards-api';
import { FlashcardType } from '@/types';
import toast from 'react-hot-toast';

interface FlashcardFormProps {
    control: any;
    isDeleted: boolean;
    flashcards: FlashcardType[];
    setIsDeleted: (state: boolean) => void;
    setDeletedId: (state: number | undefined) => void;
    validateData: (
        flashcards: FlashcardType[],
        type: 'create' | 'delete',
    ) => boolean;
}

const FlashCardForm = ({
    control,
    isDeleted,
    flashcards,
    validateData,
    setIsDeleted,
    setDeletedId,
}: FlashcardFormProps) => {
    const { delFlashcard } = useFlashcardsApi();

    const handleDelete = (
        id: number | undefined,
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.stopPropagation();
        e.preventDefault();
        const isValid = validateData(flashcards, 'delete');

        if (!isValid) {
            return toast.error('Please create at least 4 non-empty flashcards');
        }

        try {
            delFlashcard(id);
            setDeletedId(id);
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleted(true);
        }
    };

    useEffect(() => {
        if (isDeleted) {
            setIsDeleted(false);
        }
    }, [isDeleted, setIsDeleted]);

    return (
        <FormField
            name='flashcards'
            control={control}
            render={({ field }) => (
                <div className='space-y-6'>
                    {field.value.map(
                        (flashcard: FlashcardFormType, index: number) => (
                            <div
                                key={flashcard.id}
                                className='gap-x-10 p-5 border rounded-xl min-h-[180px] h-full bg-white space-y-5'
                            >
                                <div className='flex items-center justify-between'>
                                    <div className='font-semibold text-lg'>
                                        {index + 1}
                                    </div>
                                    <Button
                                        onClick={(e) =>
                                            handleDelete(flashcard.id, e)
                                        }
                                        className='bg-[#F47B7B] hover:bg-[#f47b7b]/80 flex items-center justify-center rounded-full w-8 h-8 p-3'
                                    >
                                        <Trash className='w-5 h-5 shrink-0' />
                                    </Button>
                                </div>

                                <div className='flex items-center justify-between min-h-[85px] h-full gap-x-5'>
                                    <FormItem className='hidden select-none'>
                                        <FormControl>
                                            <Input
                                                defaultValue={flashcard.id}
                                            />
                                        </FormControl>
                                    </FormItem>

                                    <FormItem className='w-full h-full flex flex-col gap-y-1'>
                                        <FormControl>
                                            <Input
                                                value={
                                                    field.value[index].term ||
                                                    ''
                                                }
                                                className='w-full rounded-none border-b-2 border-t-0 border-x-0 border-b-black bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0'
                                                placeholder='Add a new term'
                                                onChange={(e) => {
                                                    const newTerms = [
                                                        ...field.value,
                                                    ];
                                                    newTerms[index].term =
                                                        e.target.value;
                                                    field.onChange(newTerms);
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className='!text-black text-base'>
                                            Term
                                        </FormLabel>
                                    </FormItem>

                                    <FormItem className='w-full h-full flex flex-col gap-y-1'>
                                        <FormControl>
                                            <Input
                                                className='w-full rounded-none border-b-2 border-t-0 border-x-0 border-b-black bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0'
                                                value={
                                                    field.value[index]
                                                        .definition || ''
                                                }
                                                onChange={(e) => {
                                                    const newDefinitions = [
                                                        ...field.value,
                                                    ];
                                                    newDefinitions[
                                                        index
                                                    ].definition =
                                                        e.target.value;
                                                    field.onChange(
                                                        newDefinitions,
                                                    );
                                                }}
                                                placeholder='Add a new definition'
                                            />
                                        </FormControl>
                                        <FormLabel className='!text-black text-base mt-3'>
                                            Definition
                                        </FormLabel>
                                    </FormItem>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            )}
        />
    );
};

export default FlashCardForm;
