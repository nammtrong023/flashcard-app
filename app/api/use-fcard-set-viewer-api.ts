'use client';

import useAxiosPrivate from '@/hooks/use-axios-private';
import { FlashcardSetViewer } from '@/types';

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/flashcards`;

const useFcardSetViewerApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const getFCardSetViewerByFCardSetId = async (id: number) => {
        const response = await axiosPrivate.get(`${baseUrl}/viewers/${id}`);

        return response.data as FlashcardSetViewer;
    };

    const createFCardSetViewer = async (data: any) => {
        const response = await axiosPrivate.post(`${baseUrl}/viewers`, data);

        return response.data as FlashcardSetViewer;
    };

    const updateFcardSetViewer = async (
        data: FlashcardSetViewer,
        id: number | undefined,
    ) => {
        const response = await axiosPrivate.put(
            `${baseUrl}/viewers-by-fcard-id/${id}`,
            data,
        );

        return response.data as FlashcardSetViewer;
    };

    return {
        createFCardSetViewer,
        updateFcardSetViewer,
        getFCardSetViewerByFCardSetId,
    };
};

export default useFcardSetViewerApi;
