self.addEventListener("install", event => {
  console.log("ZYRE Marketing notification service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {
      title: "ZYRE Marketing",
      body: event.data ? event.data.text() : "You have a new notification."
    };
  }

  const title = data.title || "ZYRE Marketing";

  const options = {
    body: data.body || "You have a new notification.",
    icon: data.icon || "/My-Market/icon-192.png",
    badge: data.badge || "/My-Market/icon-192.png",
    data: {
      url: data.url || "/My-Market/index.html"
    },
    vibrate: [200, 100, 200],
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url =
    event.notification.data?.url ||
    "/My-Market/index.html";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(clientList => {

      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});