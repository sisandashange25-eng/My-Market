const CACHE_NAME = "zyre-marketing-v2";

const FILES_TO_CACHE = [
  "/My-Market/",
  "/My-Market/index.html",
  "/My-Market/style.css",
  "/My-Market/app.js",
  "/My-Market/manifest.json"
];


// =========================
// INSTALL
// =========================

self.addEventListener("install", event => {

  console.log(
    "ZYRE Marketing service worker installed"
  );

  event.waitUntil(

    caches.open(CACHE_NAME).then(cache => {

      return cache.addAll(FILES_TO_CACHE);

    }).catch(error => {

      console.error(
        "ZYRE cache setup failed:",
        error
      );

    })

  );

  self.skipWaiting();

});


// =========================
// ACTIVATE
// =========================

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames.map(cacheName => {

          if (cacheName !== CACHE_NAME) {

            return caches.delete(cacheName);

          }

        })

      );

    }).then(() => {

      return self.clients.claim();

    })

  );

});


// =========================
// FETCH / OFFLINE SUPPORT
// =========================

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    fetch(event.request)

      .then(response => {

        const responseClone =
          response.clone();

        caches.open(CACHE_NAME).then(cache => {

          cache.put(
            event.request,
            responseClone
          );

        });

        return response;

      })

      .catch(() => {

        return caches.match(event.request);

      })

  );

});


// =========================
// PUSH NOTIFICATIONS
// =========================

self.addEventListener("push", event => {

  let data = {};

  try {

    data =
      event.data
        ? event.data.json()
        : {};

  } catch (error) {

    data = {

      title: "ZYRE Marketing",

      body:
        event.data
          ? event.data.text()
          : "You have a new notification."

    };

  }


  const title =
    data.title ||
    "ZYRE Marketing";


  const options = {

    body:
      data.body ||
      "You have a new notification.",

    icon:
      data.icon ||
      "/My-Market/icon-192.png",

    badge:
      data.badge ||
      "/My-Market/icon-192.png",

    data: {

      url:
        data.url ||
        "/My-Market/index.html"

    },

    vibrate: [
      200,
      100,
      200
    ],

    requireInteraction: false

  };


  event.waitUntil(

    self.registration.showNotification(
      title,
      options
    )

  );

});


// =========================
// NOTIFICATION CLICK
// =========================

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();


    const url =
      event.notification.data?.url ||
      "/My-Market/index.html";


    event.waitUntil(

      clients.matchAll({

        type: "window",

        includeUncontrolled: true

      }).then(clientList => {


        for (
          const client of clientList
        ) {

          if ("focus" in client) {

            client.navigate(url);

            return client.focus();

          }

        }


        if (clients.openWindow) {

          return clients.openWindow(
            url
          );

        }

      })

    );

  }
);