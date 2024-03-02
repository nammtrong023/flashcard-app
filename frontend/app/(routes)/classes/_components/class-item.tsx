import React from 'react';
import { Users } from 'lucide-react';
import { GroupType } from '@/types';
import { useRouter } from 'next/navigation';

interface ClassItemProps {
    group: GroupType;
}

const ClassItem: React.FC<ClassItemProps> = ({ group }) => {
    const router = useRouter();
    const { name, flashcard_sets, members } = group;

    const renderFlashcardSets = () => {
        const numSets = flashcard_sets?.length;
        if (numSets === 0) return '0 set';

        return `${numSets} set${numSets > 1 ? 's' : ''}`;
    };

    const renderMembers = () => {
        const numMembers = members?.length;

        return numMembers
            ? `${numMembers} member${numMembers > 1 ? 's' : ''}`
            : '0 members';
    };

    const goToGroup = () => {
        router.push(`classes/${group.id}`);
    };

    return (
        <div
            onClick={goToGroup}
            className='w-full min-h-[75px] h-full p-3 bg-white space-y-2 hover:bg-gray-50 cursor-pointer transition-colors'
        >
            <div className='flex items-center w-full gap-x-2'>
                <Users className='w-5 h-5 text-slate-400' />
                <span className='font-medium text-lg'>{name}</span>
            </div>
            <div className='flex items-center gap-x-3 text-sm text-black'>
                <div className='border border-y-0 border-l-0 border-r-2 w-[80px]'>
                    {renderFlashcardSets()}
                </div>
                <div>{renderMembers()}</div>
            </div>
        </div>
    );
};

export default ClassItem;
