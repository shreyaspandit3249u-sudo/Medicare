/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "Medicare+ Reminder";
  const body = data.body || "It is time for your medication!";

  // Show notification
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: data.alarm ? [200, 100, 200, 100, 200, 100, 200] : [100, 50, 100],
      tag: "medicare-plus-alarm",
      requireInteraction: true, // Keep it on screen until dismissed
    } as any)
  );

  // Send message to all open tabs to trigger the loud audio alarm
  if (data.alarm) {
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
        for (const client of clients) {
          client.postMessage({
            type: "NOTIFICATION_RECEIVED",
            title,
            body,
            alarm: true,
          });
        }
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      // If a window is already open, focus it
      for (const client of clients) {
        if (client.url.includes("/") && "focus" in client) {
          // Tell the client to stop the alarm since the user clicked the notification
          client.postMessage({ type: "STOP_ALARM" });
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow("/");
      }
    })
  );
});
