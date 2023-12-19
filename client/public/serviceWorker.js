self.addEventListener("push", (event) => {
    const { title, body, icon } = event.data.json();

    event.waitUntil(self.registration.showNotification(title, { body, icon }));
});
