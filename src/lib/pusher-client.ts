import PusherClient from "pusher-js";

export function createPusherClient() {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY || process.env.PUSHER_KEY || "";
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.PUSHER_CLUSTER || "mt1";
  const client = new PusherClient(key, { cluster });
  return client;
}

export function orgChannelName(orgId: string) {
  return `org-${orgId}`;
}

