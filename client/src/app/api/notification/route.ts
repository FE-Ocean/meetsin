import webpush from "web-push";
import { getSubscriptions } from "@/firebase/firebase";

export const POST = async () => {
    try {
        const subscribers = await getSubscriptions();
        const userIds = Object.keys(subscribers);

        webpush.setVapidDetails(
            "mailto:meetsin@meetsin.com",
            process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
            process.env.NEXT_PUBLIC_WEB_PUSH_PRIVATE_KEY!,
        );

        userIds.forEach((userId) => {
            webpush.sendNotification(
                subscribers[userId],
                JSON.stringify({
                    title: `${userId}님 시간이 종료되었습니다.`,
                    body: "타이머 설정 시간이 종료되었습니다.",
                    icon: "/timer.svg",
                }),
            );
        });

        return Response.json({ message: "OK~" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "server error" }, { status: 500 });
    }
};
