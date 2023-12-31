'use client';

import { GroupType } from '@/types';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { ClassData } from '@/components/modals/create-class-modal';

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/classes`;

const useGroupsApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const getGroups = async (ownerId: number) => {
        const response = await axiosPrivate.get(
            `${baseUrl}/by-owner/${ownerId}`,
        );

        return response.data as GroupType[];
    };

    const getGroup = async (ownerId: string, groupId: string) => {
        const response = await axiosPrivate.get(
            `${baseUrl}/by-group-id/${groupId}/${ownerId}`,
        );

        return response.data as GroupType;
    };

    const createGroup = async (data: ClassData) => {
        const response = await axiosPrivate.post(
            `${baseUrl}/by-owner/${data.owner}`,
            data,
        );

        return response.data as GroupType;
    };

    const updateGroup = async (data: any, ownerId: string, groupId: string) => {
        const response = await axiosPrivate.patch(
            `${baseUrl}/by-group-id/${groupId}/${ownerId}`,
            data,
        );

        return response.data as GroupType;
    };

    const joinGroup = async (inviteCode: string, userId: string) => {
        const respone = await axiosPrivate.patch(
            `${baseUrl}/invite/${inviteCode}`,
            { user_id: userId },
        );

        return respone.data.data as GroupType;
    };

    const deleteGroup = async (ownerId: string, groupId: string) => {
        const response = await axiosPrivate.delete(
            `${baseUrl}/by-group-id/${groupId}/${ownerId}`,
        );

        return response.data as GroupType;
    };

    return {
        getGroup,
        createGroup,
        updateGroup,
        getGroups,
        joinGroup,
        deleteGroup,
    };
};

export default useGroupsApi;
