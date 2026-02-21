# GitHub Pages デプロイで repo-config.json を Secrets から生成するガイド

`client/public/repo-config.json` には **saveApiSecret** が含まれるため、Git にはコミットせず `.gitignore` で除外しています。  
GitHub Actions でビルドする際に、**リポジトリの Secrets から `repo-config.json` を自動生成**することで、GitHub Pages 上でも管理画面の「保存してデプロイ」（GCP API 経由）が使えるようになります。

---

## 1. 前提

- このリポジトリは **GitHub Actions**（`.github/workflows/deploy-pages.yml`）で GitHub Pages にデプロイしていること。
- GCP の保存 API（`gcp-save-api`）をデプロイ済みで、**saveApiUrl** と **saveApiSecret** の値が決まっていること。  
  → 未設定の場合は [gcp-save-api/README.md](gcp-save-api/README.md) を参照してデプロイする。

---

## 2. リポジトリに Secrets を登録する

1. GitHub でリポジトリを開く。
2. **Settings** → **Secrets and variables** → **Actions** を開く。
3. **New repository secret** で次の 2 つを追加する。

| Secret 名 | 値 | 必須 |
|-----------|-----|------|
| `SAVE_API_URL` | GCP Cloud Functions の URL（例: `https://asia-northeast1-xxxxx.cloudfunctions.net/saveContent`） | 保存 API を使う場合のみ |
| `SAVE_API_SECRET` | GCP デプロイ時に設定した `CONTENTS_SAVE_SECRET` と同じ文字列 | 保存 API を使う場合のみ |

- **保存 API を使わない**（管理画面では GitHub トークン入力で保存する）場合  
  → この 2 つは登録しなくてよい。  
  その場合でも、ワークフローでは **owner / repo / branch** だけが入った `repo-config.json` が自動で生成され、管理画面の「リポジトリ情報」は正しく表示されます。
- **保存 API を使う**（トークン入力なしで保存したい）場合  
  → `SAVE_API_URL` と `SAVE_API_SECRET` の**両方**を登録する。片方だけだと保存 API は有効になりません。

---

## 3. ワークフロー側の動き（確認用）

`deploy-pages.yml` の「Generate repo-config.json」ステップで、次のようにしています。

1. **owner / repo / branch**  
   - `GITHUB_REPOSITORY`（例: `owner/repo`）と `GITHUB_REF_NAME`（例: `main`）から自動で設定。
2. **saveApiUrl / saveApiSecret**  
   - リポジトリの Secrets に `SAVE_API_URL` と `SAVE_API_SECRET` が**両方**ある場合だけ `repo-config.json` に追加。  
   - どちらかが無い・空の場合は、owner / repo / branch のみの設定になる。

生成されるファイルは **ビルド時にだけ** `client/public/repo-config.json` として配置され、`vite build` で `dist/public` に含まれます。リポジトリのソースには `repo-config.json` は含めません。

---

## 4. 手順まとめ（保存 API を使う場合）

1. **GCP で保存 API をデプロイ**  
   - [gcp-save-api/README.md](gcp-save-api/README.md) の手順でデプロイし、**URL** と **CONTENTS_SAVE_SECRET** をメモする。
2. **GitHub のリポジトリ Secrets を設定**  
   - `SAVE_API_URL` = 上記 URL  
   - `SAVE_API_SECRET` = 上記 CONTENTS_SAVE_SECRET と同じ値
3. **main に push**（または手動でワークフロー実行）  
   - ビルド時に `repo-config.json` が生成され、GitHub Pages にデプロイされる。
4. **GitHub Pages の管理画面で確認**  
   - 管理画面を開き、「保存してデプロイ」でトークン入力なしで保存できることを確認する。

---

## 5. ローカル開発時

- `repo-config.json` は `.gitignore` されているため、リポジトリを clone しただけでは存在しません。
- ローカルで管理画面の「保存」を試す場合:
  - `client/public/repo-config.json.example` をコピーして `client/public/repo-config.json` を作成し、**owner / repo / branch** を自分のリポジトリに合わせて編集。
  - 保存 API を使う場合は、**saveApiUrl** と **saveApiSecret** も同じ値で埋める（このファイルは Git にコミットしないこと）。

---

## 6. トラブルシューティング

| 現象 | 確認すること |
|------|----------------|
| 管理画面で「repo-config.json が未設定です」 | デプロイ後のサイトで `/repo-config.json` にアクセスして、JSON が返るか確認。返らなければワークフローで生成ステップが動いているか、ビルド成果物に含まれているかを確認。 |
| 保存 API を設定したのにトークン入力が出る | `SAVE_API_URL` と `SAVE_API_SECRET` の**両方**が Secrets に登録されているか、値が GCP の `CONTENTS_SAVE_SECRET` と一致しているかを確認。 |
| Secrets を追加・変更したが反映されない | ワークフローを再実行（main に空コミット push または Actions タブから「Run workflow」）。 |
