'use client';

import * as z from 'zod';
import jwt from 'jsonwebtoken';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Loader2, Lock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { useAuthApi } from '@/app/api/use-auth-api';

const formSchema = z.object({
    newPassword: z.string().min(6, 'Tối thiểu 6 ký tự'),
    confirmNewPassword: z.string().min(6, 'Tối thiểu 6 ký tự'),
});

export type VerifyEmailForm = z.infer<typeof formSchema> & {
    resetToken: string;
};

const PasswordRecoveryPage = () => {
    const router = useRouter();
    const params = useParams<{ uidb64: string; token: string }>();
    const { uidb64, token } = params;

    const { authToken, handleCookies } = useAuth();

    const { resetPassword } = useAuthApi();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<VerifyEmailForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    const { data, mutate, isSuccess } = useMutation({
        mutationKey: ['confirm-password'],
        mutationFn: (values: any) => resetPassword(values),
        onError: () => setIsLoading(false),
    });

    useEffect(() => {
        if (isSuccess) {
            handleCookies(data);
        }

        if (isSuccess && authToken?.access) {
            router.refresh();
            router.push('/');
        }
    }, [router, authToken?.access, isSuccess, handleCookies, data]);

    if (!uidb64 || !token || authToken?.access) {
        return redirect('/sign-in');
    }

    const onSubmit = (value: VerifyEmailForm) => {
        const { newPassword, confirmNewPassword } = value;

        if (newPassword !== confirmNewPassword) {
            return toast.error('Password not match!');
        }

        setIsLoading(true);

        const data = {
            uidb64,
            token,
            password: newPassword,
            confirm_password: confirmNewPassword,
        };

        mutate(data);
    };

    return (
        <>
            <div className='flex flex-col items-center justify-center gap-y-[10px]'>
                <h1 className=' font-bold text-lg lg:text-3xl'>
                    Set a new password
                </h1>
            </div>
            <div className='bg-white dark:bg-[#212833] rounded-[20px] p-6 lg:p-10 flex flex-col gap-y-5 lg:gap-y-[30px] w-full'>
                <Form {...form}>
                    <form
                        method='post'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col w-full space-y-5'
                    >
                        <FormField
                            control={form.control}
                            name='newPassword'
                            render={({ field }) => (
                                <FormItem className='w-full relative'>
                                    <Lock className='w-4 h-4  absolute left-5 top-[11px] lg:top-[19px] font-bold' />
                                    <FormControl>
                                        <Input
                                            className='h-10 lg:h-[52px] rounded-md lg:rounded-[10px] pl-11 !m-0 text-sm bg-transparent dark:bg-dark2'
                                            placeholder='New password'
                                            type='password'
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='confirmNewPassword'
                            render={({ field }) => (
                                <FormItem className='w-full relative'>
                                    <Lock className='w-4 h-4  absolute left-5 top-[11px] lg:top-[19px] font-bold' />
                                    <FormControl>
                                        <Input
                                            placeholder='Confirm new password'
                                            type='password'
                                            className='h-10 lg:h-[52px] rounded-md lg:rounded-[10px] pl-11 !m-0 text-sm dark:bg-dark2'
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={isLoading}
                            type='submit'
                            className='w-full h-10 lg:h-[52px] rounded-md lg:rounded-[10px] text-sm md:text-base flex items-center justify-center gap-x-2'
                        >
                            {isLoading && (
                                <Loader2 className='w-[22px] h-[22px] animate-spin' />
                            )}
                            Xác nhận và đăng nhập
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    );
};

export default PasswordRecoveryPage;
