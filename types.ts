export type FlashcardSetType = {
    id: number;
    title: string;
    description: string;
    flashcards: FlashcardType[];
    flashcard_set_viewer: FlashcardSetViewer;
    created_at: Date;
    updated_at: Date;
};

export type FlashcardType = {
    id: number;
    term: string;
    definition: string;
    created_at: Date;
    updated_at: Date;
};

export type FlashcardSetViewer = {
    id?: string;
    flashcard_set?: number;
    is_first_setting: boolean;
    question_types: string[];
    created_at?: Date;
    updated_at?: Date;
};
