import React from 'react';
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconButtonProps {
    title?: string;
    icon: LucideIcon;
    className?: string;
    size?: number;
    disabled?: boolean;
    variantType?: VariantType;

    onClick?: () => void;
}

type VariantType =
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'green'
    | null
    | undefined;

const IconButton = ({
    title,
    icon: Icon,
    disabled = false,
    variantType = 'outline',
    size = 16,
    className,
    onClick,
}: IconButtonProps) => {
    return (
        <Button
            type='button'
            variant={variantType}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'flex items-center justify-center gap-x-1',
                className,
            )}
        >
            <span className='flex items-center justify-center w-fit rounded-full bg-greenPrimary hover:bg-greenPrimary/80 transition-colors p-2'>
                <Icon size={size} className='text-white' />
            </span>
            {title ? <p>{title}</p> : null}
        </Button>
    );
};

export default IconButton;
