#!/usr/bin/env node
/**
 * client/public 内の PNG/JPEG を圧縮し、WebP を生成する。
 * 実行: pnpm run optimize-images
 * 要: pnpm add -D sharp
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "client", "public");
const EXT = [".png", ".jpg", ".jpeg"];

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("optional: pnpm add -D sharp で sharp を入れると画像最適化・WebP 生成が有効になります");
    return;
  }

  const files = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true });
  for (const ent of files) {
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (!EXT.includes(ext)) continue;

    const base = path.join(PUBLIC_DIR, ent.name);
    const baseNameNoExt = path.basename(ent.name, ext);
    const webpPath = path.join(PUBLIC_DIR, `${baseNameNoExt}.webp`);

    try {
      const buf = fs.readFileSync(base);
      const img = sharp(buf);

      // WebP 生成（品質 85、ファイルが無い場合またはソースより新しい場合のみ）
      const stat = fs.statSync(base);
      let writeWebp = true;
      try {
        const wStat = fs.statSync(webpPath);
        if (wStat.mtimeMs >= stat.mtimeMs) writeWebp = false;
      } catch {
        /* webp が無い */
      }
      if (writeWebp) {
        await img
          .webp({ quality: 85 })
          .toFile(webpPath);
        console.log("webp:", path.relative(PUBLIC_DIR, webpPath));
      }
    } catch (e) {
      console.warn("skip", ent.name, e.message);
    }
  }
}

main();
