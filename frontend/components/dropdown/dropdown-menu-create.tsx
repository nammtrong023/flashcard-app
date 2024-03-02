'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import useFlashcardsApi from '@/app/api/use-flashcards-api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useClassesApi from '@/app/api/use-group-api';
import { useAuth } from '../providers/auth-provider';
import { useModalStore } from '@/hooks/use-modal-store';

export function DropdownMenuCreate() {
    const router = useRouter();
    const { userId } = useAuth();
    const { onOpen } = useModalStore();

    const { createFlashcardSet } = useFlashcardsApi();

    const { mutate, data, isSuccess } = useMutation({
        mutationFn: () => createFlashcardSet(userId),
        onError: (error) => {
            console.log(error);
            toast.error('Something went wrong');
        },
    });

    React.useEffect(() => {
        if (data && isSuccess) {
            return router.push(`flashcards/${data.id}`);
        }
    }, [data, isSuccess, router]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className='flex items-center justify-center gap-x-1'
                >
                    <span className='flex items-center justify-center w-fit rounded-full bg-greenPrimary p-1'>
                        <Plus className='w-4 h-4' />
                    </span>
                    Create new
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='start'>
                <DropdownMenuItem onClick={() => mutate()}>
                    Study set
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpen('createClass')}>
                    Class
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
