'use client';

import { useAuthApi } from '@/app/api/use-auth-api';
import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const formShema = z.object({
    name: z.string().min(3, 'Tối thiểu 3 ký tự'),
});

export type UpdateProfileFormType = z.infer<typeof formShema>;

const ProfileIdPage = ({ params }: { params: { userId: string } }) => {
    const { updatedUser, getUserById } = useAuthApi();
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['get-user'],
        queryFn: () => getUserById(params.userId),
    });

    const form = useForm<UpdateProfileFormType>({
        resolver: zodResolver(formShema),
        defaultValues: {
            name: user?.name,
        },
    });

    useEffect(() => {
        if (user) {
            form.setValue('name', user.name);
        }
    }, [form, user]);

    const { mutate, data, isSuccess } = useMutation({
        mutationFn: (data: UpdateProfileFormType) =>
            updatedUser(params.userId, data),
        onSuccess: () => {
            toast.success('Success');
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });

    const onSubmit = (data: UpdateProfileFormType) => {
        mutate(data);
    };

    useEffect(() => {
        if (data && isSuccess) {
            queryClient.invalidateQueries({ queryKey: ['get-user'] });
        }
    }, [data, isSuccess, queryClient]);

    if (!user) {
        return null;
    }

    return (
        <Container>
            <div className='bg-[#fafbfc] rounded-lg h-full mx-auto max-w-3xl p-10'>
                <h1 className='font-bold text-2xl mb-10'>Cá nhân</h1>
                <Form {...form}>
                    <form
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name='name'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên của bạn</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Tên của bạn'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='space-y-2'>
                            <span>Email</span>
                            <Input
                                readOnly
                                className='focus-visible:ring-0 focus-visible:ring-offset-0'
                                defaultValue={user?.email}
                            />
                        </div>
                        <div className='flex items-end w-full'>
                            <Button
                                variant='outline'
                                className='ml-auto min-w-[100px]'
                            >
                                Lưu
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Container>
    );
};

export default ProfileIdPage;
