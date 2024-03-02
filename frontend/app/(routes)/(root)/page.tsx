'use client';

import FlashcardItem from '@/components/flashcards/flashcard-set-item';
import { DropdownMenuCreate } from '@/components/dropdown/dropdown-menu-create';
import useFlashcardsApi from '@/app/api/use-flashcards-api';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/header';
import { useAuth } from '@/components/providers/auth-provider';
import useGroupsApi from '@/app/api/use-group-api';
import GroupItem from '@/components/class-item';
import CreateClassModal from '@/components/modals/create-class-modal';
import Container from '@/components/container';

export default function Home() {
    const { userId } = useAuth();
    const { getFlashcardSets } = useFlashcardsApi();
    const { getGroups } = useGroupsApi();

    const { data } = useQuery({
        queryKey: ['get-flashcard-sets'],
        queryFn: () => getFlashcardSets(userId),
    });

    const { data: groups } = useQuery({
        queryKey: ['get-groups'],
        queryFn: () => getGroups(parseInt(userId)),
    });

    if (!data || !groups) return null;

    return (
        <>
            <Container>
                <div className='w-full space-y-20'>
                    <div>
                        <DropdownMenuCreate />
                    </div>
                    <div className='space-y-2'>
                        <h2 className=''>Your file</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {data.map((flashcardSet) => (
                                <FlashcardItem
                                    key={flashcardSet.id}
                                    flashcardSet={flashcardSet}
                                />
                            ))}
                            {groups.map((group) => (
                                <GroupItem key={group.id} group={group} />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
            <CreateClassModal />
        </>
    );
}
