"use server";

import { db } from "@/lib/database";
import webpush from "web-push";
import { auth } from "@/auth";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  "mailto:example@yourdomain.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function subscribeUser(subscription: any) {
  const session = await auth();
  console.log("[DEBUG auth] session:", session);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // 1. Handle Expo Push Token (Mobile)
    if (subscription.expoPushToken) {
      await db.pushSubscription.upsert({
        where: { expoPushToken: subscription.expoPushToken },
        update: { userId: session.user.id },
        create: {
          expoPushToken: subscription.expoPushToken,
          userId: session.user.id,
          endpoint: `expo-${subscription.expoPushToken.substring(0, 20)}`, // Dummy endpoint for unique constraint
        },
      });
      return { success: true };
    }

    // 2. Handle Standard Web Push (Browser)
    const { endpoint, keys } = subscription || {};
    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      // If we are here and we don't have a valid web sub, just return silently or with info
      console.log("[DEBUG] Skipping empty or invalid web subscription");
      return { success: true, message: "No valid subscription provided" };
    }

    await db.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: session.user.id,
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: session.user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to subscribe user:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}

export async function unsubscribeUser(endpoint: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await db.pushSubscription.delete({
      where: { 
        endpoint,
        userId: session.user.id
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to unsubscribe user:", error);
    return { success: false, error: "Failed to unsubscribe" };
  }
}

export async function sendNotification(message: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  return await triggerBackendNotification(session.user.id, message);
}

export async function triggerBackendNotification(userId: string, message: string) {
  try {
    const subscriptions = await db.pushSubscription.findMany({
      where: { userId }
    });
    
    console.log(`[DEBUG] Found ${subscriptions.length} subscriptions for user ${userId}`);
    
    const notifications = subscriptions.map(async (sub) => {
      try {
        // A. Handle Expo Push (Mobile)
        if (sub.expoPushToken) {
          console.log(`[DEBUG] Sending Expo notification to: ${sub.expoPushToken}`);
          const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: sub.expoPushToken,
              title: 'Medicare+ Reminder',
              body: message,
              sound: 'alarm',
              channelId: 'medication-alerts',
              data: { alarm: true, title: 'Medicare+ Reminder', body: message },
            }),
          });
          const result = await response.json();
          console.log('[DEBUG] Expo send result:', result);
        } 
        // B. Handle Web Push (Browser)
        else if (sub.endpoint && sub.p256dh && sub.auth) {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            JSON.stringify({
              title: "Medicare+ Reminder",
              body: message,
              icon: "/icon-192x192.png",
              alarm: true,
              vibrate: [200, 100, 200]
            })
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          await db.pushSubscription.delete({ where: { id: sub.id } });
        }
        console.error("Error sending notification to sub:", sub.id, error);
      }
    });

    await Promise.all(notifications);
    return { success: true };
  } catch (error) {
    console.error("Failed to trigger backend notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
