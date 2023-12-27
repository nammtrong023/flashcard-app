import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import useFcardSetViewerApi from '@/app/api/use-fcard-set-viewer-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FlashcardSetViewer } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface QuestionOptionsProps {
    fcardSetViewer: FlashcardSetViewer;
    onClose?: () => void;
}

const FormSchema = z.object({
    written: z.boolean().default(false),
    multiple_choice: z.boolean(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const QuestionOptions = ({ fcardSetViewer, onClose }: QuestionOptionsProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { updateFcardSetViewer } = useFcardSetViewerApi();

    const isWritten = fcardSetViewer.question_types.includes('Written');
    const isMultipleChoice =
        fcardSetViewer.question_types.includes('Multiple Choice');

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            multiple_choice: isMultipleChoice || false,
            written: isWritten || false,
        },
    });

    const { mutate } = useMutation({
        mutationKey: ['updateFcardSetViewer'],
        mutationFn: (data: FlashcardSetViewer) =>
            updateFcardSetViewer(data, fcardSetViewer.flashcard_set),
        onSuccess: () => {
            router.refresh();
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['get-flashcard-set'] });
        },
        onError: () => {},
    });

    const onSubmit = (values: FormSchemaType) => {
        if (!values.multiple_choice && !values.written) {
            return toast.error('Please select at least one option');
        }

        const questionTypes: string[] = [];

        if (values.written) {
            questionTypes.push('Written');
        }

        if (values.multiple_choice) {
            questionTypes.push('Multiple Choice');
        }

        const data = {
            question_types: questionTypes,
            flashcard_set: fcardSetViewer.flashcard_set,
            is_first_setting: false,
        };

        mutate(data);
    };

    const handleClose = useCallback(() => {
        onClose && onClose();
    }, [onClose]);

    return (
        <div className='bg-white rounded-xl w-full h-full p-4 max-w-3xl mx-auto'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-3xl'>Options</h1>
            </div>
            <div className='p-3 border w-full mt-5 border-t-2 border-b-0 border-x-0'>
                <h2 className='font-medium text-xl'>Question Types</h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col gap-y-1 mt-5'
                    >
                        <FormField
                            control={form.control}
                            name='written'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between p-3'>
                                    <div className='space-y-0.5'>
                                        <FormLabel className='font-normal text-base'>
                                            Written
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='multiple_choice'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between p-3'>
                                    <div className='space-y-0.5'>
                                        <FormLabel className='font-normal text-base'>
                                            Multiple Choice
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='border border-t-2 border-b-0 border-x-0 flex mt-3'>
                            <Button
                                type='submit'
                                className='w-fit ml-auto mt-3'
                                variant='green'
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default QuestionOptions;
