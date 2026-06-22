#!/usr/bin/env node
import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const SOURCE_DIR = path.join(projectRoot, "photos-source");
const LEGACY_SOURCE_DIR = path.join(projectRoot, "src", "assets");
const OUTPUT_DIR = path.join(projectRoot, "src", "assets", "photos");
const LONG_EDGE = 1200;
const QUALITY = 75;
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

function isUpToDate(srcMtime, outMtime) {
  return outMtime.getTime() >= srcMtime.getTime();
}

async function processOne(srcPath) {
  const { ext: rawExt, name: base } = path.parse(srcPath);
  const ext = rawExt.toLowerCase();
  if (!SOURCE_EXTENSIONS.has(ext)) return null;

  const outPath = path.join(OUTPUT_DIR, `${base}.webp`);

  const srcStat = await stat(srcPath);
  if (existsSync(outPath)) {
    const outStat = await stat(outPath);
    if (isUpToDate(srcStat.mtime, outStat.mtime)) {
      return { srcPath, outPath, skipped: true };
    }
  }

  await sharp(srcPath)
    .rotate()
    .resize({
      width: LONG_EDGE,
      height: LONG_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(outPath);

  const outStat = await stat(outPath);
  return {
    srcPath,
    outPath,
    srcSize: srcStat.size,
    outSize: outStat.size,
    skipped: false,
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function listImageFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(dir, entry.name))
    .filter((file) => SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()));
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  if (!existsSync(SOURCE_DIR)) {
    await mkdir(SOURCE_DIR, { recursive: true });
  }

  const primaryFiles = await listImageFiles(SOURCE_DIR);
  const legacyFiles =
    primaryFiles.length === 0 ? await listImageFiles(LEGACY_SOURCE_DIR) : [];
  const files = [...primaryFiles, ...legacyFiles];

  if (legacyFiles.length > 0) {
    console.log(
      `Note: photos-source/ is empty, falling back to src/assets/. Move sources to photos-source/ to suppress this notice.`,
    );
  }

  if (files.length === 0) {
    console.log(
      `No source images found. Drop new JPEG/PNG files into ${path.relative(
        projectRoot,
        SOURCE_DIR,
      )} and rerun.`,
    );
    return;
  }

  let totalSrc = 0;
  let totalOut = 0;
  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const result = await processOne(file);
      if (!result) continue;
      if (result.skipped) {
        skipped += 1;
        console.log(`skip   ${path.relative(projectRoot, result.outPath)}`);
        continue;
      }
      processed += 1;
      totalSrc += result.srcSize;
      totalOut += result.outSize;
      const ratio = ((1 - result.outSize / result.srcSize) * 100).toFixed(0);
      console.log(
        `write  ${path.relative(projectRoot, result.outPath)}  ${formatBytes(
          result.srcSize,
        )} -> ${formatBytes(result.outSize)}  (-${ratio}%)`,
      );
    } catch (error) {
      console.error(`fail   ${path.relative(projectRoot, file)}: ${error.message}`);
    }
  }

  console.log("");
  console.log(
    `Done. converted=${processed}, skipped=${skipped}, total ${formatBytes(
      totalSrc,
    )} -> ${formatBytes(totalOut)}`,
  );
  console.log(`Output: ${path.relative(projectRoot, OUTPUT_DIR)}`);
  console.log("Source files were not modified.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
