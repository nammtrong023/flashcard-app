'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import axios from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { AtSignIcon, Loader2, Lock, Smile } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@/components/google-icon';
import useSigninOauth from '@/hooks/use-signin-oauth';

const formSchema = z.object({
    name: z.string().min(5, 'Tối thiểu 5 ký tự'),
    password: z.string().min(6, 'Tối thiểu 6 ký tự'),
    email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
});

type RegisterFormType = z.infer<typeof formSchema>;

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`;

const RegisterPage = () => {
    const router = useRouter();

    const { setEmailSignUp } = useAuth();
    const { loginGG, isLoading, setIsLoading } = useSigninOauth();

    const form = useForm<RegisterFormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const { mutate: signUp, isSuccess } = useMutation({
        mutationFn: async (values: RegisterFormType) => {
            return await axios.post(`${baseUrl}/register`, values);
        },
        onSuccess: () => {
            toast.success('Thành công');
            setIsLoading(false);
        },
        onError: (error) => {
            setIsLoading(false);
            console.log(error);
            toast.error('Email đã tồn tại!');
        },
    });

    const onSubmit = async (values: RegisterFormType) => {
        setIsLoading(true);
        signUp(values);
    };

    useEffect(() => {
        const emailValue = form.getValues('email');

        if (isSuccess) {
            setEmailSignUp(emailValue);
            router.refresh();
            router.push('/verify/otp');
        }
    }, [form, isSuccess, router, setEmailSignUp]);

    return (
        <>
            <div className='flex flex-col items-center justify-center gap-y-[10px]'>
                <h1 className=' font-bold text-lg lg:text-3xl'>
                    {!isSuccess ? 'Đăng ký tài khoản' : 'Xác thực email'}
                </h1>
                <p className='font-medium text-sm lg:text-base text-center'>
                    {!isSuccess
                        ? 'Tạo tài khoản để tiếp tục và kết nối với mọi người.'
                        : 'Vui lòng kiểm tra email của bạn.'}
                </p>
            </div>
            <div className='bg-white dark:bg-[#212833] rounded-[20px] p-6 lg:p-10 flex flex-col gap-y-5 lg:gap-y-[30px] w-full'>
                {isLoading && (
                    <div className='bg-white/20 dark:bg-dark2/20 backdrop-blur-[2px] rounded-[20px] h-full w-full inset-0 absolute z-50 flex items-center justify-center transition select-none'>
                        <Loader2 className='w-10 h-10 animate-spin' />
                    </div>
                )}

                <div className='flex items-center'>
                    <Button
                        variant='ghost'
                        onClick={() => loginGG()}
                        className='py-18 pl-4 bg-gray78/5 dark:bg-gray78 h-10 lg:h-[52px] rounded-[10px] w-full'
                    >
                        <GoogleIcon />
                        <span className='ml-5 text-sm lg:text-base font-semibold '>
                            Đăng nhập với Google
                        </span>
                    </Button>
                </div>
                <div className='flex items-center'>
                    <Separator className='w-1/2 h-[1px] shrink dark:bg-gray78' />
                    <span className='px-5 text-sm lg:text-lg font-bold '>
                        Hoặc
                    </span>
                    <Separator className='w-1/2 h-[1px] shrink dark:bg-gray78' />
                </div>
                <Form {...form}>
                    <form
                        method='post'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col w-full space-y-5'
                    >
                        {/* EMAIL */}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem className='w-full relative'>
                                    <AtSignIcon className='w-4 h-4 absolute left-5 top-[11px] lg:top-[19px] font-bold' />
                                    <FormControl>
                                        <Input
                                            className='h-10 lg:h-[52px] rounded-md lg:rounded-[10px] pl-11 !m-0 text-sm bg-transparent dark:bg-dark2'
                                            placeholder='Your email'
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* NAME */}
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='w-full relative'>
                                    <Smile
                                        className='w-4 h-4 absolute left-5 top-[11px] lg:top-[19px]
                                        font-bold'
                                    />
                                    <FormControl>
                                        <Input
                                            className='h-10 lg:h-[52px] rounded-md lg:rounded-[10px] pl-11 !m-0 text-sm dark:bg-dark2'
                                            placeholder='Your name'
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
                            name='password'
                            render={({ field }) => (
                                <FormItem className='w-full relative'>
                                    <Lock className='w-4 h-4  absolute left-5 top-[11px] lg:top-[19px] font-bold' />
                                    <FormControl>
                                        <Input
                                            placeholder='Your password'
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
                            className='w-full h-10 lg:h-[52px] rounded-md lg:rounded-[10px] text-sm md:text-base'
                        >
                            Đăng ký
                        </Button>
                    </form>
                </Form>

                <div className='flex items-center justify-center text-sm md:text-base font-medium mt-[30px]'>
                    Bạn đã có tài khoản?
                    <Link href='/sign-in' className='ml-2 text-[#377DFF]'>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
