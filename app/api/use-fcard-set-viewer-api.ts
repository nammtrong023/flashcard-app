'use client';

import { FlashcardSetViewer } from '@/types';
import axios from 'axios';

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/flashcards/viewers-by-fcard-id`;

const useFcardSetViewerApi = () => {
    const getFCardSetViewerByFCardSetId = async (flashcardId: number) => {
        const response = await axios.get(`${baseUrl}/${flashcardId}`);

        return response.data as FlashcardSetViewer;
    };

    const createFCardSetViewer = async (data: any) => {
        const response = await axios.post(`${baseUrl}/`, data);

        return response.data as FlashcardSetViewer;
    };

    const updateFcardSetViewer = async (
        data: FlashcardSetViewer,
        id: number | undefined,
    ) => {
        const response = await axios.put(`${baseUrl}/${id}`, data);

        return response.data as FlashcardSetViewer;
    };

    return {
        createFCardSetViewer,
        updateFcardSetViewer,
        getFCardSetViewerByFCardSetId,
    };
};

export default useFcardSetViewerApi;
