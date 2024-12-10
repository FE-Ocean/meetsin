import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import JotaiProvider from "@/jotai/jotaiProvider";
import "../styles/reset.css";
import "../styles/global.scss";
import ModalProvider from "@/components/modal/modalProvider/modalProvider";
import { QueryProvider } from "@/query/queryProvider";
import NewQueryProviders from "@/query/newQueryProvider";

const noto_Sans_KR = Noto_Sans_KR({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MEETSIN",
    description: "실시간 소통과 맵 탐험을 한 번에 즐겨보세요.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="ko">
            <body className={noto_Sans_KR.className}>
                {/* <QueryProvider> */}
                <NewQueryProviders>
                    <JotaiProvider>
                        <ModalProvider>{children}</ModalProvider>
                    </JotaiProvider>
                </NewQueryProviders>
                {/* </QueryProvider> */}
            </body>
        </html>
    );
};
export default RootLayout;
