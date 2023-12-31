import { GroupType } from '@/types';
import { create } from 'zustand';

type ModalType =
    | 'editCard'
    | 'createClass'
    | 'invite'
    | 'alert'
    | 'auth'
    | 'choose-sets'
    | null;

type ModalData = {
    group?: GroupType;
};

interface IModalStore {
    isOpenModal: boolean;
    type: ModalType;
    data: ModalData;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

const useModalStore = create<IModalStore>((set) => ({
    type: null,
    data: {},
    isOpenModal: false,
    onOpen: (type, data) => set({ isOpenModal: true, type, data }),
    onClose: () => set({ isOpenModal: false }),
}));

export { useModalStore };
