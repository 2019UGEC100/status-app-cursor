import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "mt1",
  useTLS: process.env.PUSHER_USE_TLS !== "false",
});

export function orgChannel(orgId: string) {
  return `org-${orgId}`;
}

export function canUsePusher() {
  return Boolean(
    process.env.PUSHER_APP_ID &&
      process.env.PUSHER_KEY &&
      process.env.PUSHER_SECRET
  );
}

export async function triggerOrgEvent(
  orgId: string,
  event: string,
  payload: unknown
) {
  if (!canUsePusher()) return; // no-op in local/dev without keys
  try {
    await pusherServer.trigger(orgChannel(orgId), event, payload as Record<string, unknown>);
  } catch (err) {
    // Avoid breaking user flows if realtime fails
    console.warn("Pusher trigger failed", err);
  }
}

