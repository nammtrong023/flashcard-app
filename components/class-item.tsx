import React from 'react';
import { GroupType } from '@/types';
import { useRouter } from 'next/navigation';
import DropDownFcardOptions from './dropdown/dropdown-actions';
import useGroupsApi from '@/app/api/use-group-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './providers/auth-provider';
import toast from 'react-hot-toast';

const GroupItem = ({ group }: { group: GroupType }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { userId } = useAuth();

    const goToGroup = () => {
        if (!group.id) return;

        router.push(`/classes/${group.id}`);
    };

    const { deleteGroup } = useGroupsApi();

    const { mutate } = useMutation({
        mutationFn: () => deleteGroup(userId, group.id.toString()),
        onSuccess: () => {
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ['get-groups'] });
            toast.success('Classes deleted');
        },
    });

    return (
        <div
            className='p-3 w-full min-w-[225px] group bg-white hover:bg-graySecondary transition-colors rounded-xl cursor-pointer text-sm font-medium'
            onClick={goToGroup}
        >
            <div className='flex items-center justify-between'>
                <p className=''>{group?.name}</p>
                <DropDownFcardOptions
                    onDelete={mutate}
                    onEdit={() => router.push(`/classes/${group.id}`)}
                />
            </div>
            <div className='space-y-3 mt-3 px-1'>
                <div className='rounded-full bg-blue-200 p-2 w-fit text-black group-hover:bg-blue-400/80 text-center min-w-[60px] transition-colors'>
                    Class
                </div>
                <div className='flex items-center gap-x-2'>
                    <div className='min-w-[60px] rounded-full w-fit bg-graySecondary/60 p-2 group-hover:bg-gray-100 transition-colors text-center'>
                        {group?.flashcard_sets?.length || 0} sets
                    </div>
                    <div className='min-w-[60px] rounded-full w-fit bg-graySecondary/60 p-2 group-hover:bg-gray-100 transition-colors text-center'>
                        {group?.members?.length || 0} members
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupItem;
