import type { GameHighlight } from "@/types/highlight";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function readRecord(source: UnknownRecord | undefined, keys: string[]) {
  if (!source) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (isRecord(value)) return value;
  }

  return undefined;
}

function readArray(source: UnknownRecord | undefined, keys: string[]) {
  if (!source) return [];

  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

function readString(source: UnknownRecord | undefined, keys: string[], fallback = "") {
  if (!source) return fallback;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }

  return fallback;
}

function readNestedString(source: UnknownRecord | undefined, path: string[]) {
  let current: unknown = source;

  for (const key of path) {
    if (!isRecord(current)) return "";
    current = current[key];
  }

  return typeof current === "string" && current.trim() ? current : "";
}

function isSafeExternalUrl(value: string) {
  return /^https:\/\//i.test(value);
}

function isImageUrl(value: string) {
  return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(value);
}

function isLikelyVideoUrl(value: string) {
  if (!isSafeExternalUrl(value) || isImageUrl(value)) return false;

  return /video|clip|motion|mp4|m3u8|highlight|recap/i.test(value);
}

function readImageUrl(item: UnknownRecord) {
  const direct = readString(item, ["thumbnail", "thumbnailUrl", "image"], "");
  if (isSafeExternalUrl(direct) && isImageUrl(direct)) return direct;

  const image = readRecord(item, ["image"]);
  const imageUrl = readString(image, ["url", "href"], "");
  if (isSafeExternalUrl(imageUrl) && isImageUrl(imageUrl)) return imageUrl;

  const images = readArray(item, ["images"]).filter(isRecord);
  const firstImageUrl = readString(images[0], ["url", "href"], "");
  return isSafeExternalUrl(firstImageUrl) && isImageUrl(firstImageUrl) ? firstImageUrl : undefined;
}

function readVideoUrl(item: UnknownRecord) {
  const direct = readString(item, ["videoUrl", "url", "href"], "");
  if (isLikelyVideoUrl(direct)) return direct;

  const webHref = readNestedString(item, ["links", "web", "href"]);
  return isLikelyVideoUrl(webHref) ? webHref : "";
}

function readEmbedUrl(item: UnknownRecord) {
  const direct = readString(item, ["embedUrl"], "");
  if (isLikelyVideoUrl(direct)) return direct;

  const sourceHref = readNestedString(item, ["links", "source", "href"]);
  if (isLikelyVideoUrl(sourceHref)) return sourceHref;

  const apiHref = readNestedString(item, ["links", "api", "href"]);
  return isLikelyVideoUrl(apiHref) ? apiHref : "";
}

function collectKnownVideoRows(raw: unknown) {
  const root = isRecord(raw) ? raw : {};
  const rows: { item: UnknownRecord; path: string }[] = [];

  function addRows(value: unknown, path: string) {
    if (Array.isArray(value)) {
      value.filter(isRecord).forEach((item, index) => rows.push({ item, path: `${path}[${index}]` }));
      return;
    }

    if (isRecord(value)) rows.push({ item: value, path });
  }

  addRows(root.videos, "videos");
  addRows(root.highlights, "highlights");
  addRows(root.video, "video");

  const content = readRecord(root, ["content"]);
  addRows(content?.videos, "content.videos");

  const article = readRecord(root, ["article"]);
  addRows(article?.video, "article.video");
  addRows(article?.videos, "article.videos");

  const boxscore = readRecord(root, ["boxscore"]);
  addRows(boxscore?.videos, "boxscore.videos");

  const gameInfo = readRecord(root, ["gameInfo"]);
  addRows(gameInfo?.videos, "gameInfo.videos");

  const news = readRecord(root, ["news"]);
  readArray(news, ["articles"]).filter(isRecord).forEach((newsArticle, articleIndex) => {
    addRows(newsArticle.video, `news.articles[${articleIndex}].video`);
    addRows(newsArticle.videos, `news.articles[${articleIndex}].videos`);
  });

  return rows;
}

export function findEspnVideoFields(raw: unknown) {
  return Array.from(new Set(collectKnownVideoRows(raw).map((row) => row.path.split("[")[0])));
}

export function normalizeEspnHighlights(raw: unknown): GameHighlight[] {
  const seen = new Set<string>();

  return collectKnownVideoRows(raw).flatMap(({ item }, index) => {
    const videoUrl = readVideoUrl(item);
    const embedUrl = readEmbedUrl(item);
    if (!videoUrl && !embedUrl) return [];

    const title = readString(item, ["title", "headline", "name", "text"], "Melhores momentos");
    const dedupeKey = embedUrl || videoUrl;
    if (seen.has(dedupeKey)) return [];
    seen.add(dedupeKey);

    return [{
      id: readString(item, ["id", "videoId", "guid"], `espn-highlight-${index}`),
      title,
      description: readString(item, ["description", "summary"], ""),
      thumbnailUrl: readImageUrl(item),
      videoUrl: videoUrl || undefined,
      embedUrl: embedUrl || undefined,
      source: "espn" as const,
      publishedAt: readString(item, ["published", "publishedAt", "date"], ""),
      isEmbeddable: Boolean(embedUrl && /\.(mp4|m3u8)(\?|$)/i.test(embedUrl))
    }];
  });
}
