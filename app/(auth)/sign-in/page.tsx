'use client';
import Link from 'next/link';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AtSignIcon, Loader2, Lock } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { useAuthApi } from '@/app/api/use-auth-api';
import useSigninOauth from '@/hooks/use-signin-oauth';
import GoogleIcon from '@/components/google-icon';
import jwt from 'jsonwebtoken';
import { useAuth } from '@/components/providers/auth-provider';

const formSchema = z.object({
    email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
    password: z.string().min(6, 'Tối thiểu 6 ký tự'),
});

export type LoginFormType = z.infer<typeof formSchema>;

const LoginPage = () => {
    const router = useRouter();
    const { login } = useAuthApi();

    const { setUserId, handleCookies } = useAuth();
    const { loginGG, isLoading, setIsLoading } = useSigninOauth();

    const form = useForm<LoginFormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { data, mutate, isSuccess } = useMutation({
        mutationFn: (values: LoginFormType) => login(values),
        onError: (error: Error) => {
            setIsLoading(false);
            console.log(error);
            toast.error('Email hoặc mật khẩu không đúng');
        },
    });

    const onSubmit = (values: LoginFormType) => {
        mutate(values);
    };

    useEffect(() => {
        if (isSuccess) {
            const tokenDecode: any = jwt.decode(data.access);
            setUserId(tokenDecode.user_id);
            handleCookies(data);
            router.refresh();
            router.push('/');
        }
    }, [data, handleCookies, isSuccess, router, setUserId]);

    return (
        <>
            <div className='flex flex-col items-center justify-center gap-y-[10px]'>
                <h1 className='text-gray78 font-bold text-lg lg:text-3xl dark:text-white'>
                    Đăng nhập
                </h1>
                <p className='text-gray78 font-medium text-sm lg:text-base dark:text-white text-center'>
                    Đăng nhập để tiếp tục và kết nối với mọi người.
                </p>
            </div>

            <div className='bg-white relative dark:bg-[#212833] rounded-[20px] p-10 w-full flex flex-col gap-y-5 lg:gap-y-[30px]'>
                {isLoading && (
                    <div className='bg-white/20 dark:bg-dark2/20 backdrop-blur-[2px] rounded-[20px] h-full w-full inset-0 absolute z-50 flex items-center justify-center transition select-none'>
                        <Loader2 className='w-10 h-10 animate-spin' />
                    </div>
                )}

                <div className='flex items-center'>
                    <Button
                        onClick={() => loginGG()}
                        variant='ghost'
                        className='py-18 pl-4 bg-gray78/5 dark:bg-gray78 h-10 lg:h-[52px] rounded-[10px] w-full relative'
                    >
                        <GoogleIcon />
                        <span className='ml-5 text-sm lg:text-base font-semibold text-gray78 dark:text-white select-none'>
                            Đăng nhập với Google
                        </span>
                    </Button>
                </div>

                <div className='flex items-center'>
                    <Separator className='w-1/2 h-[1px] shrink dark:bg-gray78' />
                    <span className='px-5 text-sm lg:text-lg font-bold text-gray78 dark:text-white'>
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
                                    <AtSignIcon className='w-4 h-4 text-gray78 dark:text-white absolute left-5 top-[11px] lg:top-[19px] font-bold' />
                                    <FormControl>
                                        <Input
                                            className='h-10 lg:h-[52px] rounded-md lg:rounded-[10px] pl-11 !m-0 text-sm bg-transparent border-[#4E5D78] dark:text-white'
                                            placeholder='Your email'
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
                                    <Lock className='w-4 h-4 text-gray78 dark:text-white absolute left-5 top-[11px] lg:top-[19px] font-bold' />
                                    <FormControl>
                                        <Input
                                            placeholder='Your password'
                                            className='h-10 lg:h-[52px] rounded-md lg:rounded-[10px] pl-11 !m-0 text-sm bg-transparent border-[#4E5D78] dark:text-white'
                                            disabled={isLoading}
                                            type='password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='w-full text-right'>
                            <Link
                                href='/verify/email'
                                className='font-medium text-sm w-fit'
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <Button
                            disabled={isLoading}
                            type='submit'
                            className='w-full h-10 lg:h-[52px] rounded-md lg:rounded-[10px] mt-[30px] text-sm md:text-base'
                        >
                            Đăng nhập
                        </Button>
                    </form>
                </Form>

                <div className='text-sm md:text-base font-medium mt-[30px] text-center'>
                    Bạn chưa có tài khoản?
                    <Link href='/sign-up' className='ml-2 text-[#377DFF]'>
                        Đăng ký
                    </Link>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
