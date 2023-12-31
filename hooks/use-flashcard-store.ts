import { FlashcardType } from '@/types';
import { create } from 'zustand';

interface FlashcardStore {
    flashcard: FlashcardType;
    setFcard: (value: FlashcardType) => void;
}

const useFlashcardStore = create<FlashcardStore>((set) => ({
    flashcard: {
        id: 0,
        term: '',
        flashcard_set: 0,
        definition: '',
        created_at: new Date(),
        updated_at: new Date(),
    },
    setFcard: (value: FlashcardType) => set({ flashcard: value }),
}));

export { useFlashcardStore };
