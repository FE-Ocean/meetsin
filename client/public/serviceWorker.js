self.addEventListener("push", (event) => {
    const { title, body, icon } = event.data.json();

    const isClientFocused = async () => {
        const windowClients = await self.clients.matchAll({ type: "window" });

        if (windowClients.length > 0) {
            return windowClients.some((client) => client.focused);
        }

        return false;
    };

    const shouldSendNotification = async () => {
        const clientFocused = await isClientFocused();

        if (clientFocused) return;

        self.registration.showNotification(title, { body, icon });
    };

    event.waitUntil(shouldSendNotification());
});

self.addEventListener("notificationclick", (event) => {
    const clickedNotification = event.notification;
    clickedNotification.close();

    const handleNotificationClick = async () => {
        const windowClients = await self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
        });

        if (windowClients.length > 0) {
            await windowClients[0].focus();
        }
    };

    event.waitUntil(handleNotificationClick());
});
