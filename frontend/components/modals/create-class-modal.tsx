import React, { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { useModalStore } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/auth-provider';
import useGroupsApi from '@/app/api/use-group-api';
import toast from 'react-hot-toast';
import { GroupType } from '@/types';

const groupFormSchema = z.object({
    name: z.string().min(1, {
        message: 'This field is required.',
    }),
    description: z.string().max(255, 'The length is max').optional(),
});

export type GroupFormType = z.infer<typeof groupFormSchema>;

export type ClassData = {
    owner: string;
} & GroupFormType;

const CreateClassModal = ({ initialData }: { initialData?: GroupType }) => {
    const router = useRouter();
    const { userId } = useAuth();
    const queryClient = useQueryClient();

    const { type, isOpenModal, onClose } = useModalStore();
    const isModalOpen = type === 'createClass' && isOpenModal;

    const { createGroup, updateGroup } = useGroupsApi();

    const form = useForm<GroupFormType>({
        resolver: zodResolver(groupFormSchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
        },
    });

    const { mutate, data, isSuccess } = useMutation({
        mutationFn: (data: ClassData) => {
            if (initialData) {
                return updateGroup(data, userId, initialData.id.toString());
            }

            return createGroup(data);
        },
        onError: (error) => {
            console.log(error);
            toast.error('Something went wrong');
        },
    });

    const onSubmit = (values: GroupFormType) => {
        const data = {
            owner: userId,
            ...values,
        };

        mutate(data);
    };

    useEffect(() => {
        if (isSuccess && data) {
            onClose();

            queryClient.invalidateQueries({
                queryKey: ['get-group'],
            });
            router.push(`/classes/${data.id}`);
        }
    }, [data, isSuccess, onClose, queryClient, router]);

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className='text-2xl font-semibold'>
                    Create a new class
                </DialogHeader>
                <DialogDescription>
                    Organise your study materials and share them with your
                    classmates.
                </DialogDescription>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            name='name'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className='w-full rounded-xl'
                                            placeholder='Enter a class name'
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
                                        <Input
                                            className='w-full rounded-xl'
                                            placeholder='Enter a description (optional)'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant='green' className='mt-5 flex ml-auto'>
                            Create class
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateClassModal;
