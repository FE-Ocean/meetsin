import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "../styles/reset.css";
import "../styles/global.scss";

const noto_Sans_KR = Noto_Sans_KR({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "meetsin",
    description: "meetsin",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="ko">
            <body className={noto_Sans_KR.className}>{children}</body>
        </html>
    );
};
export default RootLayout;
