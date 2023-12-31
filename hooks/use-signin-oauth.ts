'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthApi } from '@/app/api/use-auth-api';
import { useMutation } from '@tanstack/react-query';
import jwt from 'jsonwebtoken';
import { useAuth } from '@/components/providers/auth-provider';

const API_BASE_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const useSigninOauth = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { loginOauth } = useAuthApi();
    const { handleCookies, setUserId } = useAuth();

    const { mutate, data, isSuccess } = useMutation({
        mutationFn: (data: any) => loginOauth(data),
    });

    useEffect(() => {
        if (isSuccess && data) {
            const tokenDecode: any = jwt.decode(data.access);
            setUserId(tokenDecode.user_id);
            handleCookies(data);
            router.refresh();
            router.push('/');
        }
    }, [data, handleCookies, isSuccess, router, setUserId]);

    const loginGG = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                setIsLoading(true);
                const res = await axios.get(API_BASE_URL, {
                    headers: {
                        Authorization: 'Bearer ' + response.access_token,
                    },
                });

                const data = {
                    user_id: res.data.sub,
                    email: res.data.email,
                    name: res.data.name,
                };

                mutate(data);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return { loginGG, setIsLoading, isLoading };
};

export default useSigninOauth;
