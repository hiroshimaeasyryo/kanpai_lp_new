/**
 * GitHub Contents API で content.json を更新する（保存してデプロイ）
 */
import type { ContentPayload } from "@/types/content-payload";
import { CONTENT_JSON_REPO_PATH } from "@/types/content-payload";

export interface RepoConfig {
  owner: string;
  repo: string;
  branch?: string;
  /** 設定時は「保存してデプロイ」でトークン入力不要（GCP の save API が PAT を使用） */
  saveApiUrl?: string;
  saveApiSecret?: string;
}

/**
 * リポジトリ内の content.json を更新する。
 * 成功時はコミットが作成され push されるため、push トリガーの Actions でデプロイされる。
 */
export async function saveContentToGitHub(
  payload: ContentPayload,
  token: string,
  config: RepoConfig,
): Promise<void> {
  const branch = config.branch ?? "main";
  const apiPath = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${CONTENT_JSON_REPO_PATH}`;

  const res = await fetch(`${apiPath}?ref=${branch}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
    },
  });
  const existing = await res.json();
  const sha = existing?.sha ?? undefined;

  const content = JSON.stringify(payload, null, 2);
  const bytes = new TextEncoder().encode(content);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const contentBase64 = btoa(binary);

  const putRes = await fetch(apiPath, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "contents-manager: update content.json",
      content: contentBase64,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    const err = (await putRes.json()) as { message?: string };
    throw new Error(err.message ?? "保存に失敗しました");
  }
}

/**
 * 保存用 GCP API 経由で content.json を更新する（トークン入力不要）。
 * repo-config に saveApiUrl と saveApiSecret が設定されている場合に使用。
 */
export async function saveContentViaApi(
  payload: ContentPayload,
  config: RepoConfig,
): Promise<void> {
  const url = config.saveApiUrl?.trim();
  const secret = config.saveApiSecret?.trim();
  if (!url || !secret) {
    throw new Error("saveApiUrl と saveApiSecret が設定されていません");
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: CONTENT_JSON_REPO_PATH,
      content: payload,
      owner: config.owner,
      repo: config.repo,
      branch: config.branch ?? "main",
      secret,
    }),
  });
  const data = (await res.json()) as { ok?: boolean; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "保存に失敗しました");
  }
}

/**
 * /repo-config.json を取得。未設定の場合は null。
 */
export async function fetchRepoConfig(): Promise<RepoConfig | null> {
  if (typeof window === "undefined") return null;
  try {
    const base =
      typeof import.meta.env?.BASE_URL === "string" && import.meta.env.BASE_URL !== "/"
        ? import.meta.env.BASE_URL.replace(/\/$/, "")
        : "";
    const res = await fetch(`${base}/repo-config.json`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      owner?: string;
      repo?: string;
      branch?: string;
      saveApiUrl?: string;
      saveApiSecret?: string;
    };
    if (typeof data.owner === "string" && typeof data.repo === "string") {
      return {
        owner: data.owner,
        repo: data.repo,
        branch: typeof data.branch === "string" ? data.branch : "main",
        saveApiUrl: typeof data.saveApiUrl === "string" ? data.saveApiUrl : undefined,
        saveApiSecret: typeof data.saveApiSecret === "string" ? data.saveApiSecret : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}
