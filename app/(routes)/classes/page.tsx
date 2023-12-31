'use client';

import React from 'react';
import ClassItem from './_components/class-item';
import { useAuth } from '@/components/providers/auth-provider';
import useGroupsApi from '@/app/api/use-group-api';
import { useQuery } from '@tanstack/react-query';
import Container from '@/components/container';

const ClassesPage = () => {
    const { userId } = useAuth();
    const { getGroups } = useGroupsApi();

    const { data } = useQuery({
        queryKey: ['get-groups'],
        queryFn: () => getGroups(parseInt(userId)),
    });

    if (!data) return null;

    return (
        <Container>
            <div className=''>User</div>
            <div className='space-y-4'>
                {data.map((group) => (
                    <ClassItem key={group.id} group={group} />
                ))}
            </div>
        </Container>
    );
};

export default ClassesPage;
