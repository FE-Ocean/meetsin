import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, remove, child, get } from "firebase/database";

const firebaseConfig = {
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const DB_PATH = "subscribers/";

export const addSubscription = async (subscription) => {
    try {
        const subscribersRef = ref(database, DB_PATH);
        const newsubscriberRef = push(subscribersRef);
        set(newsubscriberRef, subscription);

        return newsubscriberRef.key;
    } catch (error) {
        console.error(error);
    }
};

export const deleteSubscription = async (userkey) => {
    try {
        const subscribersRef = ref(database, DB_PATH + userkey);
        remove(subscribersRef);
    } catch (error) {
        console.error(error);
    }
};

export const getSubscriptions = async () => {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, DB_PATH));

        if (!snapshot.exists()) throw new Error("No data available");

        return snapshot.val();
    } catch (error) {
        console.error(error);
    }
};
