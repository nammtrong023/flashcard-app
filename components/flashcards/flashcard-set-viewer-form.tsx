import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FlashcardSetType, FlashcardType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFlashcardsApi from '@/app/api/use-flashcards-api';
import toast from 'react-hot-toast';
import FlashCardForm from './flashcard-form';
import IconButton from '../icon-button';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { formatedDate } from '@/lib/utils';
import useFcardSetViewerApi from '@/app/api/use-fcard-set-viewer-api';

export const flashcardSchema = z.object({
    id: z.coerce.number().optional(),
    term: z.string().nullable().optional(),
    definition: z.string().nullable().optional(),
});
export type FlashcardFormType = z.infer<typeof flashcardSchema>;

const updateFlashcardSetSchema = z.object({
    title: z.string().min(1, {
        message: 'This field is required.',
    }),
    description: z.string().max(255, 'The length is max').optional(),
    flashcards: z.array(flashcardSchema).optional(),
});

export type updateFlashcardSetType = z.infer<typeof updateFlashcardSetSchema>;

const FlashcardSetViewerForm = ({
    initialData,
}: {
    initialData: FlashcardSetType;
}) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isDeleted, setIsDeleted] = useState(false);
    const [deletedId, setDeletedId] = useState<number | undefined>(undefined);

    const { updateFlashcardSet } = useFlashcardsApi();
    const { createFCardSetViewer } = useFcardSetViewerApi();

    const form = useForm<updateFlashcardSetType>({
        resolver: zodResolver(updateFlashcardSetSchema),
        defaultValues: {
            title: initialData.title || '',
            description: initialData.description || '',
            flashcards: initialData.flashcards || [],
        },
    });

    useEffect(() => {
        if (isDeleted) {
            queryClient.refetchQueries({ queryKey: ['get-flashcard-set'] });
            const updatedFlashcards = form.getValues('flashcards');

            const filterFCard = updatedFlashcards?.filter(
                (card) => card.id !== deletedId,
            );

            form.setValue('flashcards', filterFCard);
        }
    }, [deletedId, form, isDeleted, queryClient]);

    useEffect(() => {
        const prevFlashcards = form.getValues('flashcards');

        const newData = [
            // @ts-ignore
            ...prevFlashcards,
            ...initialData.flashcards.slice(prevFlashcards?.length),
        ];

        form.setValue('flashcards', newData);
    }, [form, initialData.flashcards]);

    const validateData = (
        flashcards: FlashcardType[],
        type: 'create' | 'delete',
    ) => {
        let nonEmptyCount = 0;

        flashcards.forEach((flashcard) => {
            if (flashcard.term !== '' && flashcard.definition !== '') {
                nonEmptyCount++;
            }
        });

        if (type === 'create' && nonEmptyCount < 4) {
            return false;
        }

        if (type === 'delete' && flashcards.length === 4) {
            return false;
        }

        return true;
    };

    const { mutate } = useMutation({
        mutationKey: ['update-flashcard-set'],
        mutationFn: (values: updateFlashcardSetType) =>
            updateFlashcardSet(initialData.id, values),
        onSuccess: () => {
            router.push(`/flashcards/${initialData.id}`);
        },
    });

    const onSubmit = (values: updateFlashcardSetType) => {
        // @ts-ignore
        const isValid = validateData(values.flashcards, 'create');

        if (!isValid) {
            return toast.error('Please create at least 4 non-empty flashcards');
        }

        if (!initialData.flashcard_set_viewer) {
            createFCardSetViewer({
                question_types: ['Written', 'Flashcards'],
                flashcard_set: initialData.id,
            });
        }

        mutate(values);
    };

    const handleGoBack = () => {
        if (!initialData.flashcard_set_viewer) {
            return router.push('/');
        }

        router.back();
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='w-full flex items-center justify-between'>
                        <IconButton
                            title='Go back'
                            icon={ArrowLeft}
                            onClick={handleGoBack}
                        />
                        <div className='flex items-center justify-center gap-x-2'>
                            {initialData.flashcard_set_viewer && (
                                <p className='text-sm text-muted-foreground'>
                                    Last saved{' '}
                                    {formatedDate(initialData.updated_at) ||
                                        '...'}{' '}
                                    ago
                                </p>
                            )}
                            <Button
                                type='submit'
                                className='bg-greenPrimary rounded-full text-base'
                            >
                                {!initialData.flashcard_set_viewer
                                    ? 'Save'
                                    : 'Update'}
                            </Button>
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <FormField
                            name='title'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            className='w-full rounded-xl'
                                            placeholder='Add a new title'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='description'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            value={field.value || ''}
                                            maxLength={255}
                                            className='w-full min-h-[100px] max-h-[250px] rounded-xl'
                                            onChange={field.onChange}
                                            placeholder='Add a new description'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FlashCardForm
                            control={form.control}
                            isDeleted={isDeleted}
                            flashcards={initialData.flashcards}
                            validateData={validateData}
                            setIsDeleted={setIsDeleted}
                            setDeletedId={setDeletedId}
                        />
                    </div>
                </form>
            </Form>
        </>
    );
};

export default FlashcardSetViewerForm;
