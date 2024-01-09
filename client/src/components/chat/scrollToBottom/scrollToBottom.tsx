"use client";

import { useEffect, useRef } from "react";

interface Props {
    children: React.ReactNode;
}

const ScrollToBottom = ({ children }: Props) => {
    const endRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (endRef.current) {
            endRef.current.scrollIntoView();
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [children]);

    return (
        <div>
            {children}
            <div ref={endRef} />
        </div>
    );
};

export default ScrollToBottom;
