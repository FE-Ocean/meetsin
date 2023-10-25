import { atom } from "jotai";

interface IModalAtom {
    [fileName: string]: {
        open: boolean;
    };
}

export const modalAtom = atom<IModalAtom>({
    testModal: {
        open: false,
    },
});

export const timerAtom = atom({
    minute: 0,
    second: 0,
});

export const isTimerVisibleAtom = atom(false);
