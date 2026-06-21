import type { ContentPayload } from "@/types/content-payload";

const CHANNEL_NAME = "cm-preview-draft";

type DraftMessage = { slug: string; payload: ContentPayload };

let channel: BroadcastChannel | null | undefined;

function getChannel(): BroadcastChannel | null {
  if (channel !== undefined) return channel;
  if (typeof BroadcastChannel === "undefined") {
    channel = null;
    return channel;
  }
  channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

/** ContentsManager → プレビュー iframe へ draft をブロードキャスト（postMessage の冗長経路） */
export function broadcastCmDraft(slug: string, payload: ContentPayload): void {
  getChannel()?.postMessage({ slug, payload } satisfies DraftMessage);
}

/** LP プレビュー側: draft ブロードキャストを購読 */
export function subscribeCmDraft(
  callback: (slug: string, payload: ContentPayload) => void,
): () => void {
  const ch = getChannel();
  if (!ch) return () => {};

  const handler = (event: MessageEvent<DraftMessage>) => {
    const data = event.data;
    if (!data?.slug || !data.payload) return;
    callback(data.slug, data.payload);
  };

  ch.addEventListener("message", handler);
  return () => ch.removeEventListener("message", handler);
}
