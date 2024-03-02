'use client';

import { Tokens } from '@/types';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';
import { getCookie, setCookie } from 'cookies-next';
import React, { createContext, useCallback, useContext, useState } from 'react';

type ContextDataType = {
    userId: string;
    authToken: Tokens | undefined;
    emailSignUp: string;
    setEmailSignUp: (email: string) => void;
    handleCookies: (data: Tokens) => void;
    setAuthToken: (authToken: Tokens) => void;
    setUserId: (userId: string) => void;
    logout: () => void;
};

const access = getCookie('access')?.valueOf() || '';
const refresh = getCookie('refresh')?.valueOf() || '';

const AuthContext = createContext<ContextDataType>({
    userId: '',
    authToken: {
        access,
        refresh,
    },
    emailSignUp: '',
    setEmailSignUp: () => {},
    handleCookies: () => {},
    setAuthToken: () => {},
    setUserId: () => {},
    logout: () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [userId, setUserId] = useLocalStorage('user_id', '');

    const [emailSignUp, setEmailSignUp] = useState('');
    const [authToken, setAuthToken] = useState<Tokens | undefined>({
        access,
        refresh,
    });

    const handleCookies = useCallback(
        (data: Tokens) => {
            setCookie('access', data?.access);
            setCookie('refresh', data?.refresh);

            setAuthToken({
                access: data?.access,
                refresh: data?.refresh,
            });
        },
        [setAuthToken],
    );

    const logout = () => {
        setUserId('');
        setAuthToken(undefined);
        setCookie('refresh', '');
        setCookie('access', '');
        router.push('/sign-in');
    };

    const contextData = {
        authToken,
        userId,
        emailSignUp,
        setEmailSignUp,
        setAuthToken,
        handleCookies,
        setUserId,
        logout,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
