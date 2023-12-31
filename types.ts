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
    flashcard_set: number;
    definition: string;
    created_at: Date;
    updated_at: Date;
};

export type FlashcardSetViewer = {
    id?: number;
    flashcard_set?: number;
    is_first_setting: boolean;
    question_types: string[];
    created_at?: Date;
    updated_at?: Date;
};

export type Tokens = {
    access: string;
    refresh: string;
};

export type UserType = {
    id: number;
    name: string;
    email: string;
};

export type GroupType = {
    id: number;
    name: string;
    description: string;
    invite_code: string;
    owner: UserType;
    members: UserType[];
    flashcard_sets: FlashcardSetType[];
};
