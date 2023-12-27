'use client';

import * as React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import useFlashcardsApi from '@/app/api/use-flashcards-api';
import { MoreVertical, Pen, PenLine, Trash } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
};

const DropDownFcardOptions = ({ fcardSetId }: { fcardSetId: number }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = React.useState(false);

    const { deleteFlashcardSet } = useFlashcardsApi();
    const { mutate } = useMutation({
        mutationFn: () => deleteFlashcardSet(fcardSetId),
        onSuccess: () => {
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ['get-flashcard-sets'] });
            toast.success('Flashcard set deleted');
        },
    });

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    size='icon'
                    variant='ghost'
                    onClick={(e) => {
                        stopPropagation(e);
                        setIsOpen(true);
                    }}
                    className='rounded-full hover:bg-slate-100 w-8 h-8'
                >
                    <MoreVertical className='w-4 h-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 rounded-xl' align='start'>
                <DropdownMenuItem className='w-full flex items-center gap-x-2'>
                    <PenLine size={18} />
                    Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        stopPropagation(e);
                        router.push(`/flashcards/${fcardSetId}/edit`);
                    }}
                    className='w-full flex items-center gap-x-2'
                >
                    <Pen size={16} />
                    Edit this set
                </DropdownMenuItem>
                <DropdownMenuItem
                    className='w-full flex items-center gap-x-2'
                    onClick={(e) => {
                        stopPropagation(e);
                        mutate();
                    }}
                >
                    <Trash size={16} />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropDownFcardOptions;
