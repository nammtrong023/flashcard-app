import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '../ui/dialog';
import { useModalStore } from '@/hooks/use-modal-store';

interface AlertModalProps {
    title: string;
    loading: boolean;
    onConfirm: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    title,
    loading,
    onConfirm,
}) => {
    const { isOpenModal, onClose, type } = useModalStore();
    const isOpen = type === 'alert' && isOpenModal;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogContent className='dark:bg-dark1'>
                <div className='text-center flex flex-col gap-y-2'>
                    <DialogTitle id='alert-dialog-title'>
                        {title.toUpperCase()}
                    </DialogTitle>
                    <DialogDescription>
                        Once this action is completed, it may not be undone.
                    </DialogDescription>
                    <DialogFooter className='mt-2 gap-y-3'>
                        <Button
                            variant='ghost'
                            onClick={onClose}
                            className='text-black border border-slate-400 hover:bg-[#f4f4f5] min-w-[60px] dark:border-dark3 dark:text-white dark:hover:bg-gray78/10 transition dark:bg-dark2/70 focus-visible:ring-0 focus-visible:ring-offset-0'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            variant='destructive'
                            className='text-white items-center capitalize min-w-[60px]'
                        >
                            {loading ? (
                                <Loader2 className='w-4 h-4 animate-spin' />
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
