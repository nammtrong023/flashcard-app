import { create } from 'zustand';

type ProcessType = 'selectedAnswer' | 'nextQuestion' | 'skip' | null;
type AnswerType = 'writtenAnswer' | 'choiceAnswer' | null;

interface ProcessState {
    writtenValue: string;
    isAnswered: boolean;
    answerType: AnswerType;
    isCompleted: boolean;
    process: ProcessType;
    setWrittenValue: (value: string) => void;
    setIsAnswered: (type: AnswerType, value: boolean) => void;
    setProcess: (type: ProcessType, isCompleted: boolean) => void;
}

const useProcessStore = create<ProcessState>((set) => ({
    writtenValue: '',
    isAnswered: false,
    answerType: null,
    isCompleted: false,
    process: null,
    setWrittenValue: (value) => set({ writtenValue: value }),
    setIsAnswered: (type, value) =>
        set({ answerType: type, isAnswered: value }),
    setProcess: (process, isCompleted) => set({ process, isCompleted }),
}));

export { useProcessStore };
