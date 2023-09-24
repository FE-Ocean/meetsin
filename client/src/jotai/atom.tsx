import { atom } from "jotai";

interface IModalAtom {
    open : boolean,
    content : React.ReactNode | null
};

export const modalAtom = atom<IModalAtom>({
    open : false,
    content : null
});