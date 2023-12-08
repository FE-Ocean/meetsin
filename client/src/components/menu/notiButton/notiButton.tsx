import { useState } from "react";
import style from "./NotiButton.module.scss";

async function saveSubscriptionToDB(subscription: PushSubscription) {
    console.log(subscription, "이거 디비에 저장할 것..");
}
async function deleteSubscriptionFromDB(subscription: PushSubscription) {
    console.log(subscription, "이거 디비에서 지울 것..");
}

const startSubscription = () => {
    try {
        if (!("PushManager" in window)) {
            alert("푸시 알림 이 브라우저에서 지원 안 함");
            return;
        }

        navigator.serviceWorker.ready.then((registration) => {
            registration.pushManager.getSubscription().then((subscription) => {
                if (subscription) {
                    // 이미 구독 있음
                    return;
                }

                registration.pushManager
                    .subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
                    })
                    .then((subscription) => saveSubscriptionToDB(subscription));
            });
        });
    } catch (error) {
        console.error(error);
        if (Notification.permission === "denied") {
            alert("알림 허용해주세요");
        }
    }
};

const cancelSubscription = () => {
    navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
            if (!subscription) {
                // 취소할 구독이 없다.
                return;
            }
            subscription.unsubscribe();
        });
    });
};

const NotiButton = () => {
    const [hasSubscription, setHasSubscription] = useState(false);

    return hasSubscription ? (
        <button className={style.on} onClick={cancelSubscription} />
    ) : (
        <button className={style.off} onClick={startSubscription} />
    );
};
export default NotiButton;
