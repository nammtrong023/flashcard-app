'use client';

import dayjs from 'dayjs';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { useAuth } from '@/components/providers/auth-provider';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const useAxiosPrivate = () => {
    const { authToken, handleCookies } = useAuth();

    const axiosPrivate = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken?.access}`,
        },
    });

    axiosPrivate.interceptors.request.use(async (req) => {
        const user: any = authToken?.access && jwt.decode(authToken?.access);

        const currentTime = dayjs();
        const expirationTime = dayjs.unix(user.exp);

        const timeUntilExpire = expirationTime.diff(currentTime, 'minutes');

        const isExpired = timeUntilExpire < 5;

        if (!isExpired) return req;

        const { data } = await axios.post(`${baseURL}/auth/token-refresh/`, {
            refresh: authToken?.refresh,
        });

        if (authToken?.refresh) {
            handleCookies({ access: data.access, refresh: authToken?.refresh });
        }

        req.headers.Authorization = `Bearer ${data.access}`;

        return req;
    });

    return axiosPrivate;
};

export default useAxiosPrivate;
