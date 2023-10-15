import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import JotaiProvider from "@/jotai/jotaiProvider";
import Modal from "@/components/modal/modal";
import "../styles/reset.css";
import "../styles/global.scss";

const noto_Sans_KR = Noto_Sans_KR({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
    title: "meetsin",
    description: "meetsin",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="ko">
            <body className={noto_Sans_KR.className}>
                <JotaiProvider>
                    {children}
                    <Modal />
                </JotaiProvider>
            </body>
        </html>
    );
};
export default RootLayout;
