'use client';

import useGroupsApi from '@/app/api/use-group-api';
import { useAuth } from '@/components/providers/auth-provider';
import { useMutation } from '@tanstack/react-query';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

const inviteLink = process.env.NEXT_PUBLIC_FE_URL;

const InviteCodePage = ({ params }: InviteCodePageProps) => {
    const router = useRouter();
    const { userId } = useAuth();
    const { joinGroup } = useGroupsApi();

    const { mutate, data, status } = useMutation({
        mutationKey: ['join-group', params.inviteCode],
        mutationFn: () => joinGroup(params.inviteCode, userId),
    });

    useLayoutEffect(() => {
        mutate();
    }, [mutate]);

    useEffect(() => {
        if (status === 'success' && data !== undefined) {
            router.push(`${inviteLink}/classes/${data.id}`);
        }
    }, [data, router, status]);

    if (!params.inviteCode) return redirect('/');

    return;
};

export default InviteCodePage;
