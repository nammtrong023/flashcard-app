import { create } from 'zustand';

type ModalType = 'editCard' | 'alert' | 'auth' | null;

interface IModalStore {
    isOpenModal: boolean;
    type: ModalType;
    onOpen: (type: ModalType) => void;
    onClose: () => void;
}

const useModalStore = create<IModalStore>((set) => ({
    type: null,
    isOpenModal: false,
    onOpen: (type: ModalType) => set({ isOpenModal: true, type }),
    onClose: () => set({ isOpenModal: false }),
}));

export { useModalStore };
