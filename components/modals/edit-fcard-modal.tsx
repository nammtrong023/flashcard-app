import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import TextareaResize from '../ui/textarea-resize';
import { useModalStore } from '@/hooks/use-modal-store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useFlashcardStore } from '@/hooks/use-flashcard-store';
import useFlashcardsApi from '@/app/api/use-flashcards-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const flashcardSchema = z.object({
    term: z.string().nullable().optional(),
    definition: z.string().nullable().optional(),
});

type FlashcardFormType = z.infer<typeof flashcardSchema>;

export function EditFCardModal() {
    const [isScrollTerm, setIsScrollTerm] = useState(false);
    const [isScrollDefinition, setIsScrollDefinition] = useState(false);

    const queryClient = useQueryClient();

    const { flashcard } = useFlashcardStore();
    const { updateFlashcard } = useFlashcardsApi();

    const { isOpenModal, type, onClose } = useModalStore();
    const isOpen = isOpenModal && type === 'editCard';

    const form = useForm<FlashcardFormType>({
        resolver: zodResolver(flashcardSchema),
        defaultValues: {
            term: flashcard.term,
            definition: flashcard.definition,
        },
    });

    const { mutate } = useMutation({
        mutationFn: (data: any) => updateFlashcard(flashcard.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-flashcard-set'] });
            onClose();
        },
    });

    useEffect(() => {
        form.setValue('term', flashcard.term);
        form.setValue('definition', flashcard.definition);
    }, [flashcard, form]);

    const onSubmit = (values: any) => {
        const data = {
            flashcard_set: flashcard.flashcard_set,
            quantity: 1,
            ...values,
        };
        mutate(data);
    };

    const handleTextAreaInput = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
        textareaName: string,
    ) => {
        const textarea = event.currentTarget;
        const isScrollable = textarea.scrollHeight > textarea.clientHeight;

        if (textareaName === 'term') {
            setIsScrollTerm(isScrollable);
        } else if (textareaName === 'definition') {
            setIsScrollDefinition(isScrollable);
        }
    };

    const disabled =
        form.getValues('term') === '' || form.getValues('definition') === '';

    if (!flashcard) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-w-[1200px] w-full min-h-[190px] !rounded-xl'>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex items-center justify-between gap-x-10 px-2'
                    >
                        <FormField
                            name='term'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormControl>
                                        <TextareaResize
                                            placeholder='Term'
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            onInput={(e) =>
                                                handleTextAreaInput(e, 'term')
                                            }
                                            className={cn(
                                                'border border-b-2 border-t-0 border-x-0 border-black rounded-none pl-0 pr-3 py-0 max-h-[300px] overflow-y-hidden',
                                                isScrollTerm &&
                                                    'overflow-y-scroll',
                                            )}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='definition'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormControl>
                                        <TextareaResize
                                            placeholder='Definiton'
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            onInput={(e) =>
                                                handleTextAreaInput(
                                                    e,
                                                    'definition',
                                                )
                                            }
                                            className={cn(
                                                'border border-b-2 border-t-0 border-x-0 border-black rounded-none pl-0 pr-3 py-0 max-h-[300px] overflow-y-hidden',
                                                isScrollDefinition &&
                                                    'overflow-y-scroll',
                                            )}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={disabled}>
                            Save changes
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
