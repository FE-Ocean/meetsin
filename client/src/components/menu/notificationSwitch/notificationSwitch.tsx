import { useState, useEffect } from "react";
import { cancelSubscription, getExistingSubscription, startSubscription } from "./notification";
import style from "./notificationSwitch.module.scss";

const NotificationSwitch = () => {
    const [hasSubscription, setHasSubscription] = useState<boolean>();

    useEffect(() => {
        const getActiveSubscription = async () => {
            const subscription = await getExistingSubscription();
            setHasSubscription(!!subscription);
        };
        getActiveSubscription();
    }, []);

    const toggleNotificationSwitch = async (isOn: boolean) => {
        try {
            if (isOn) {
                await startSubscription();
            } else {
                await cancelSubscription();
            }

            setHasSubscription(isOn);
        } catch (error) {
            console.error(error);
        }
    };

    return hasSubscription ? (
        <button
            type="button"
            className={style.on}
            onClick={() => toggleNotificationSwitch(false)}
        />
    ) : (
        <button
            type="button"
            className={style.off}
            onClick={() => toggleNotificationSwitch(true)}
        />
    );
};
export default NotificationSwitch;
