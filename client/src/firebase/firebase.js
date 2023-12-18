import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, remove } from "firebase/database";

const firebaseConfig = {
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export const addSubscription = async (subscription) => {
    try {
        const subscribersRef = ref(database, "subscribers/");
        const newsubscriberRef = push(subscribersRef);
        set(newsubscriberRef, subscription);

        return newsubscriberRef.key;
    } catch (error) {
        console.error(error);
    }
};

export const deleteSubscription = async (userkey) => {
    try {
        const subscribersRef = ref(database, "subscribers/" + userkey);
        remove(subscribersRef);
    } catch (error) {
        console.error(error);
    }
};
