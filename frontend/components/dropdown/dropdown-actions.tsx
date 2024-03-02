'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pen, Trash } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
};

interface DropDownFcardOptions {
    onEdit: () => void;
    onDelete: () => void;
}

const DropDownFcardOptions = ({ onEdit, onDelete }: DropDownFcardOptions) => {
    const [isOpen, setIsOpen] = React.useState(false);

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
                <DropdownMenuItem
                    onClick={(e) => {
                        stopPropagation(e);
                        onEdit();
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
                        onDelete();
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
