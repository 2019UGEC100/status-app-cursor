"use client";
import { useEffect } from "react";
import { createPusherClient, orgChannelName } from "./pusher-client";

export function useOrgRealtime(
  orgId: string | null | undefined,
  events: string[],
  onEvent: (event: string, data: unknown) => void
) {
  useEffect(() => {
    if (!orgId) return;
    const pusher = createPusherClient();
    const channel = pusher.subscribe(orgChannelName(orgId));
    const handlers: Record<string, (data: unknown) => void> = {};
    for (const evt of events) {
      handlers[evt] = (data: unknown) => onEvent(evt, data);
      channel.bind(evt, handlers[evt]);
    }
    return () => {
      for (const evt of events) channel.unbind(evt, handlers[evt]);
      pusher.unsubscribe(orgChannelName(orgId));
      pusher.disconnect();
    };
  }, [orgId, onEvent, events]);
}


