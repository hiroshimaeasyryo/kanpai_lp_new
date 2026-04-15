#!/usr/bin/env node
/**
 * client/public 内の PNG/JPEG を圧縮し、WebP を生成する。
 * サブディレクトリも再帰的に処理する。
 * 大きな画像は MAX_WIDTH にリサイズしてから変換する。
 * 実行: pnpm run optimize-images
 * 要: pnpm add -D sharp
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "client", "public");
const EXT = [".png", ".jpg", ".jpeg"];
const MAX_WIDTH = 1920;

function collectFiles(dir) {
  const results = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (ent.isFile() && EXT.includes(path.extname(ent.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("optional: pnpm add -D sharp で sharp を入れると画像最適化・WebP 生成が有効になります");
    return;
  }

  const files = collectFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} image(s) to process`);

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    const baseNameNoExt = path.basename(filePath, ext);
    const dir = path.dirname(filePath);
    const webpPath = path.join(dir, `${baseNameNoExt}.webp`);

    try {
      const buf = fs.readFileSync(filePath);
      let img = sharp(buf);
      const meta = await img.metadata();

      // リサイズ（幅が MAX_WIDTH を超える場合のみ）
      if (meta.width && meta.width > MAX_WIDTH) {
        img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
        // 元画像も圧縮して上書き
        if (ext === ".png") {
          await img.png({ quality: 85, compressionLevel: 9 }).toFile(filePath + ".tmp");
        } else {
          await img.jpeg({ quality: 85 }).toFile(filePath + ".tmp");
        }
        fs.renameSync(filePath + ".tmp", filePath);
        const newSize = fs.statSync(filePath).size;
        console.log(`resize: ${path.relative(PUBLIC_DIR, filePath)} (${meta.width}→${MAX_WIDTH}px, ${(newSize / 1024).toFixed(0)}KB)`);
        // re-read resized image for WebP
        img = sharp(fs.readFileSync(filePath));
      }

      // WebP 生成
      const stat = fs.statSync(filePath);
      let writeWebp = true;
      try {
        const wStat = fs.statSync(webpPath);
        if (wStat.mtimeMs >= stat.mtimeMs) writeWebp = false;
      } catch {
        /* webp が無い */
      }
      if (writeWebp) {
        await img.webp({ quality: 85 }).toFile(webpPath);
        const webpSize = fs.statSync(webpPath).size;
        console.log(`webp:   ${path.relative(PUBLIC_DIR, webpPath)} (${(webpSize / 1024).toFixed(0)}KB)`);
      }
    } catch (e) {
      console.warn("skip", path.relative(PUBLIC_DIR, filePath), e.message);
    }
  }
}

main();
