import { RefObject, useCallback } from "react";

const useAdjustHeight = ({
    inputRef,
}: {
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
}) => {
    return useCallback(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [inputRef]);
};

export default useAdjustHeight;
