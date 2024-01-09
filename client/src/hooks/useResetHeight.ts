import { RefObject, useCallback, useEffect, useRef } from "react";

const useResetHeight = ({
    inputRef,
}: {
    inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
}) => {
    const initInputHeight = useRef<string>("");

    useEffect(() => {
        if (inputRef.current) {
            const computedStyle = getComputedStyle(inputRef.current);
            initInputHeight.current = computedStyle.height;
        }
    }, [inputRef]);

    return useCallback(() => {
        if (inputRef.current) {
            inputRef.current.style.height = initInputHeight.current;
        }
    }, [inputRef]);
};

export default useResetHeight;
