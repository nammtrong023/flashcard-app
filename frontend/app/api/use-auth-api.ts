import { LoginFormType } from '@/app/(auth)/sign-in/page';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Tokens, UserType } from '@/types';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const useAuthApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const resetPassword = async (value: any) => {
        const response = await axios.patch(
            `${baseUrl}/auth/set-new-password/`,
            value,
        );
        return response.data as Tokens;
    };

    const login = async (values: LoginFormType) => {
        const response = await axios.post(`${baseUrl}/auth/login`, values);

        return response.data as Tokens;
    };

    const loginOauth = async (data: any) => {
        const response = await axios.post(
            `${baseUrl}/oauth/google-oauth`,
            data,
        );
        return response.data as Tokens;
    };

    const getUserById = async (userId: string) => {
        const response = await axiosPrivate.get(
            `${baseUrl}/auth/users/${userId}`,
        );

        return response.data as UserType;
    };

    const updatedUser = async (userId: string, data: any) => {
        const response = await axiosPrivate.patch(
            `${baseUrl}/auth/users/${userId}`,
            data,
        );

        return response.data;
    };

    return { resetPassword, login, loginOauth, updatedUser, getUserById };
};
