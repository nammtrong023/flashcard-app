import { useProcessStore } from './use-process-store';

const useProcess = () => {
    const {
        isCompleted,
        process,
        answerType,
        isAnswered,
        writtenValue,
        setProcess,
        setIsAnswered,
        setWrittenValue,
    } = useProcessStore();

    const isSkipped = process === 'skip' && isCompleted;
    const isNextQuestion = process === 'nextQuestion' && isCompleted;
    const isSelected = process === 'selectedAnswer' && isCompleted;
    const isWrittenAnswered = isAnswered && answerType === 'writtenAnswer';
    const isChooseAnswerd = isAnswered && answerType === 'choiceAnswer';

    return {
        process,
        isSelected,
        isAnswered,
        isWrittenAnswered,
        isChooseAnswerd,
        writtenValue,
        isSkipped,
        isNextQuestion,
        setIsAnswered,
        setWrittenValue,
        setProcess,
    };
};

export default useProcess;
