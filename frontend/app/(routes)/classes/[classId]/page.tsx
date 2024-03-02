'use client';

import useFlashcardsApi from '@/app/api/use-flashcards-api';
import useGroupsApi from '@/app/api/use-group-api';
import Container from '@/components/container';
import FlashcardSetItem from '@/components/flashcards/flashcard-set-item';
import IconButton from '@/components/icon-button';
import { AlertModal } from '@/components/modals/alert-modal';
import { ChooseFlashcardSetModal } from '@/components/modals/choose-fcard-set-modal';
import CreateClassModal from '@/components/modals/create-class-modal';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/hooks/use-modal-store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, Copy, Pen, Plus, Trash, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const FE_URL = process.env.NEXT_PUBLIC_FE_URL;

const ClassIdPage = ({ params }: { params: { classId: string } }) => {
    const { userId } = useAuth();
    const router = useRouter();

    const { getGroup } = useGroupsApi();
    const { onOpen, onClose } = useModalStore();

    const { getFlashcardSets } = useFlashcardsApi();
    const { deleteGroup } = useGroupsApi();
    const [copied, setCopied] = useState(false);

    const { data: flashcardSets } = useQuery({
        queryKey: ['get-flashcard-sets'],
        queryFn: () => getFlashcardSets(userId),
    });

    const { data } = useQuery({
        queryKey: ['get-group'],
        queryFn: () => getGroup(userId, params.classId),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteGroup(userId, params.classId),
        onSuccess: () => {
            onClose();
            router.push('/classes');
        },
    });

    if (!data || !flashcardSets) return null;

    const filterFcardSets = flashcardSets?.filter((item) => item.title);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${FE_URL}/join/${data.invite_code}`);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <Container>
            <div className='space-y-2'>
                <div className='flex items-center w-full gap-x-2'>
                    <Users className='w-6 h-6 text-slate-400' />
                    <span className='font-medium text-2xl'>{data.name}</span>
                </div>
                <div className='flex items-center gap-x-2'>
                    <IconButton
                        icon={Plus}
                        className='bg-none w-fit p-0'
                        variantType='ghost'
                        onClick={() => onOpen('choose-sets')}
                    />
                    <IconButton
                        icon={Pen}
                        className='bg-none w-fit p-0'
                        variantType='ghost'
                        onClick={() => onOpen('createClass')}
                    />
                    <IconButton
                        icon={Trash}
                        className='bg-none w-fit p-0'
                        variantType='ghost'
                        onClick={() => onOpen('alert')}
                    />
                </div>
            </div>
            <div className='flex justify-between gap-x-10'>
                <div className='space-y-5 flex-1'>
                    {data?.flashcard_sets.length === 0 ? (
                        <Button onClick={() => onOpen('choose-sets')}>
                            Add study set
                        </Button>
                    ) : (
                        <>
                            {data?.flashcard_sets.map((flascardSet) => (
                                <FlashcardSetItem
                                    key={flascardSet.id}
                                    flashcardSet={flascardSet}
                                />
                            ))}
                        </>
                    )}
                </div>
                <div className='w-[300px] space-y-6'>
                    <div className='space-y-2'>
                        <h2 className='uppercase text-sm'>Invitation link</h2>
                        <div className='flex items-center justify-center gap-x-3'>
                            <div className='border border-black/70 rounded-md p-2 line-clamp-1 w-full'>
                                {`${FE_URL}/join/${data.invite_code}`}
                            </div>
                            <Button
                                size='icon'
                                variant='outline'
                                className='min-w-[50px]'
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <Check className='w-4 h-4' />
                                ) : (
                                    <Copy className='w-4 h-4' />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <h2 className='uppercase text-sm'>Class detail</h2>
                        <div>{data.flashcard_sets.length} set</div>
                        <div>{data.members.length} member</div>
                    </div>
                </div>
            </div>
            <ChooseFlashcardSetModal
                groupId={data.id.toString()}
                flashcardSets={filterFcardSets}
                chosenFcardSets={data.flashcard_sets}
            />
            <CreateClassModal initialData={data} />
            <AlertModal
                title='Delete class'
                loading={isPending}
                onConfirm={() => mutate()}
            />
        </Container>
    );
};

export default ClassIdPage;
