import { IScreenShareState } from "@/types/peer.type";
import { IUser } from "@/types/user.type";
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
    login: {
        open: false,
    },
});

export const timerAtom = atom({
    minute: 0,
    second: 0,
});

export const isTimerVisibleAtom = atom(false);


export const screenShareStateAtom = atom<IScreenShareState>(IScreenShareState.NOT_SHARING);

export const roomIdAtom = atom("");
