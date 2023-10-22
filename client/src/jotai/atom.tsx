import { atom } from "jotai";

interface IModalAtom {
    open: boolean;
    content?: React.ReactNode | null;
}

export const modalAtom = atom<IModalAtom>({
    open: false,
    content: null,
});

export const timerAtom = atom({
    minute: 0,
    second: 0,
});

export const isTimerVisibleAtom = atom(false);
