'use client';

import { updateFlashcardSetType } from '@/components/flashcards/flashcard-set-viewer-form';
import { FlashcardSetType, FlashcardSetViewer, FlashcardType } from '@/types';
import axios from 'axios';

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/flashcards`;

const useFlashcardsApi = () => {
    const getFlashcardSets = async () => {
        const response = await axios.get(`${baseUrl}/flashcard-sets`);

        return response.data as FlashcardSetType[];
    };

    const getFlashcardSet = async (id: number) => {
        const response = await axios.get(`${baseUrl}/flashcard-sets/${id}`);

        return response.data as FlashcardSetType;
    };

    const createFlashcardSet = async () => {
        const response = await axios.post(`${baseUrl}/flashcard-sets`);

        return response.data as FlashcardSetType;
    };

    const updateFlashcardSet = async (
        flashcardSetId: number,
        data: updateFlashcardSetType,
    ) => {
        const response = await axios.put(
            `${baseUrl}/flashcard-sets/${flashcardSetId}`,
            data,
        );

        return response.data as FlashcardSetType;
    };

    const deleteFlashcardSet = async (flashcardSetId: number) => {
        await axios.delete(`${baseUrl}/flashcard-sets/${flashcardSetId}`);
    };

    const createFlashcard = async (id: number, quantity: number) => {
        const response = await axios.post(`${baseUrl}/`, {
            flashcard_set: id,
            quantity,
        });

        return response.data as FlashcardType;
    };

    const delFlashcard = async (flashcardId: number | undefined) => {
        await axios.delete(`${baseUrl}/${flashcardId}`);
    };

    return {
        getFlashcardSets,
        createFlashcardSet,
        updateFlashcardSet,
        getFlashcardSet,
        deleteFlashcardSet,

        createFlashcard,
        delFlashcard,
    };
};

export default useFlashcardsApi;
