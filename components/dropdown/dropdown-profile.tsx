'use client';

import * as React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';

export function DropdownMenuProfile() {
    const router = useRouter();
    const { userId, logout } = useAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className='flex items-center justify-center rounded-full p-1 w-10 h-10'
                >
                    <User className='w-5 h-5' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-10' align='start'>
                <DropdownMenuItem onClick={() => router.push(`/u/${userId}`)}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
