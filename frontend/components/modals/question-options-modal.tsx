import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import QuestionOptions from '@/app/(routes)/flashcards/[flashcardId]/learn/_components/question-options';
import { FlashcardSetViewer } from '@/types';

const QuestionOptionsModal = ({
    fcardSetViewer,
}: {
    fcardSetViewer: FlashcardSetViewer;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className='border rounded-full p-2 px-3 hover:bg-slate-200/30'>
                Options
            </DialogTrigger>
            <DialogContent>
                <QuestionOptions
                    fcardSetViewer={fcardSetViewer}
                    onClose={() => setIsOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
};

export default QuestionOptionsModal;
