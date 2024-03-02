'use client';

import useAxiosPrivate from '@/hooks/use-axios-private';
import { FlashcardSetType, FlashcardType } from '@/types';
import { updateFlashcardSetType } from '@/components/flashcards/flashcard-set-viewer-form';

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/flashcards`;

const useFlashcardsApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const getFlashcardSets = async (ownerId: string) => {
        const response = await axiosPrivate.get(
            `${baseUrl}/flashcard-sets-by-owner/${ownerId}`,
        );

        return response.data as FlashcardSetType[];
    };

    const getFlashcardSet = async (id: number) => {
        const response = await axiosPrivate.get(
            `${baseUrl}/flashcard-sets/${id}`,
        );

        return response.data as FlashcardSetType;
    };

    const createFlashcardSet = async (ownerId: string) => {
        const response = await axiosPrivate.post(
            `${baseUrl}/flashcard-sets-by-owner/${ownerId}`,
            { owner: ownerId },
        );
        return response.data as FlashcardSetType;
    };

    const updateFlashcardSet = async (
        flashcardSetId: number,
        data: updateFlashcardSetType,
    ) => {
        const response = await axiosPrivate.put(
            `${baseUrl}/flashcard-sets/${flashcardSetId}`,
            data,
        );

        return response.data as FlashcardSetType;
    };

    const deleteFlashcardSet = async (flashcardSetId: number) => {
        await axiosPrivate.delete(
            `${baseUrl}/flashcard-sets/${flashcardSetId}`,
        );
    };

    const updateFlashcard = async (flashcardId: number, data: any) => {
        const response = await axiosPrivate.put(
            `${baseUrl}/${flashcardId}`,
            data,
        );

        return response.data as FlashcardSetType;
    };

    const createFlashcard = async (id: number, quantity: number) => {
        const response = await axiosPrivate.post(`${baseUrl}/`, {
            flashcard_set: id,
            quantity,
        });

        return response.data as FlashcardType;
    };

    const delFlashcard = async (flashcardId: number | undefined) => {
        await axiosPrivate.delete(`${baseUrl}/${flashcardId}`);
    };

    return {
        getFlashcardSets,
        createFlashcardSet,
        updateFlashcardSet,
        getFlashcardSet,
        deleteFlashcardSet,

        updateFlashcard,
        createFlashcard,
        delFlashcard,
    };
};

export default useFlashcardsApi;
