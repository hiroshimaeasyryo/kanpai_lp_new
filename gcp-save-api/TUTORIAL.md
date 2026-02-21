# チュートリアル：保存 API を 1 ステップずつデプロイする

このファイルは、README の手順を **1 ステップずつ** 進めるためのチェックリストです。各ステップが終わったら ✅ してから次へ進んでください。

---

## Step 1：準備（gcloud と 2 つの「値」を用意する）

**やること**

1. **gcloud CLI** が入っているか確認する。
2. **Google Cloud にログイン**し、**プロジェクトを選択**する。
3. **GitHub PAT**（Personal Access Token）を 1 つ用意する（repo スコープ）。
4. **共有シークレット**を 1 つ決める（あとで repo-config にも同じ値を書く）。

**確認コマンド**（ターミナルで実行）:

```bash
gcloud --version
gcloud auth list
gcloud config get-value project
```

- `gcloud --version` でバージョンが出れば OK。
- `gcloud auth list` でログイン済みのアカウントが出る。未ログインなら `gcloud auth login`。
- `gcloud config get-value project` でプロジェクト ID が出る。未設定なら `gcloud config set project YOUR_PROJECT_ID`。

**メモ欄（自分用）**

- [ ] 使用する GCP プロジェクト ID: `________________`
- [ ] 共有シークレット（英数字で決める）: `________________`（あとで repo-config にも同じ値を書く）
- [ ] GitHub PAT は用意した（repo スコープ）

---

## Step 2：Cloud Functions をデプロイする

**やること**

1. ターミナルで **このリポジトリの `gcp-save-api` ディレクトリ** に移動する。
2. 次のコマンドを **自分の値に置き換えて** 実行する。
   - `ghp_xxxx` → 実際の GitHub PAT（全体を引用符で囲む）
   - `あなたの共有シークレット` → Step 1 で決めた共有シークレット（同じ値を Step 4 でも使う）

```bash
cd /path/to/kanpai_lp_new/gcp-save-api

gcloud functions deploy saveContent \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region asia-northeast1 \
  --set-env-vars "GITHUB_TOKEN=ghp_xxxx,CONTENTS_SAVE_SECRET=あなたの共有シークレット"
```

3. デプロイが終わると **URL** が表示される。その URL をメモする（Step 4 で使う）。

**メモ欄**

- [ ] デプロイ後の URL: `________________________________________________`

---

## Step 3：repo-config.json を用意する

**やること**

1. `client/public/repo-config.json.example` をコピーして `client/public/repo-config.json` を作成する（すでにあれば編集）。
2. 次の 5 項目を入れる。
   - `owner`: GitHub のユーザー名または組織名
   - `repo`: この LP のリポジトリ名（例: `kanpai_lp_new`）
   - `branch`: `main`
   - `saveApiUrl`: **Step 2 でメモした URL**（そのまま貼り付け、末尾が `/saveContent` になっていること）
   - `saveApiSecret`: **Step 1 で決めた共有シークレット**（デプロイ時に渡した値と完全に同じ）

3. 保存する。

---

## Step 4：動作確認する

**やること**

1. 本番（またはプレビュー）の **コンテンツ管理画面**（`/contents-manager`）を開く。
2. アクセスコードで入室する。
3. 「保存して反映」ブロックに **「保存 API が設定されています。トークン入力は不要です。」** と出ているか確認する（トークン入力欄が無いこと）。
4. テストで 1 つだけ編集して **「保存してデプロイ」** をクリックする。
5. 「保存しました。push により数分以内にサイトに反映されます。」と出れば OK。

---

## うまくいかないとき

| 症状 | 確認すること |
|------|----------------|
| デプロイでエラー | `gcloud config set project` で正しいプロジェクトか、課金が有効か確認。 |
| 保存時に「保存に失敗しました」 | `saveApiSecret` と GCP の `CONTENTS_SAVE_SECRET` が完全に同じか、`saveApiUrl` が正しいか。 |
| 401 Unauthorized | 共有シークレットの前後にスペースが入っていないか。 |
| GitHub 側のエラー | PAT に repo 権限があるか、`owner` / `repo` が実際のリポジトリと一致しているか。 |
