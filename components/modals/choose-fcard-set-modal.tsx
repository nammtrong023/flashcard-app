'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { FlashcardSetType } from '@/types';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { useModalStore } from '@/hooks/use-modal-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useGroupsApi from '@/app/api/use-group-api';
import { useAuth } from '../providers/auth-provider';

const FormSchema = z.object({
    flashcard_sets: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: 'You have to select at least one flashcard.',
        }),
});

export function ChooseFlashcardSetModal({
    flashcardSets,
    chosenFcardSets,
    groupId,
}: {
    groupId: string;
    flashcardSets: FlashcardSetType[];
    chosenFcardSets: FlashcardSetType[];
}) {
    const { userId } = useAuth();
    const { updateGroup } = useGroupsApi();
    const queryClient = useQueryClient();

    const { isOpenModal, onClose, type } = useModalStore();
    const isOpen = isOpenModal && type === 'choose-sets';

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            flashcard_sets: chosenFcardSets.map((item) => item.id.toString()),
        },
    });

    const { mutate } = useMutation({
        mutationKey: ['update-flashcard-set'],
        mutationFn: (values: any) => updateGroup(values, userId, groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-group'] });
            onClose();
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        mutate(data);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className='font-semibold text-2xl'>
                    Add a set
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                    >
                        <FormField
                            control={form.control}
                            name='flashcard_sets'
                            render={() => (
                                <FormItem className='space-y-5'>
                                    {flashcardSets.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name='flashcard_sets'
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className='flex flex-row items-center space-x-3 space-y-0 w-full h-[60px] bg-slate-50 p-3'
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(
                                                                    item.id.toString(),
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) => {
                                                                    return checked
                                                                        ? field.onChange(
                                                                              [
                                                                                  ...field.value,
                                                                                  item.id.toString(),
                                                                              ],
                                                                          )
                                                                        : field.onChange(
                                                                              field.value?.filter(
                                                                                  (
                                                                                      value,
                                                                                  ) =>
                                                                                      value !==
                                                                                      item.id.toString(),
                                                                              ),
                                                                          );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className='text-base font-normal'>
                                                            {item.title}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            variant='green'
                            type='submit'
                            className='flex ml-auto'
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
