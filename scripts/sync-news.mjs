import { writeFile } from 'node:fs/promises';

// The blog feed contains only published posts. Keep the last checked-in snapshot if it is offline.
try {
  const response = await fetch('https://blog.openagentix.si/news.json', { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`News feed returned HTTP ${response.status}`);
  const data = await response.json();
  for (const locale of ['en', 'de']) {
    if (!Array.isArray(data[locale]) || data[locale].length > 4 || data[locale].some((item) => {
      try { return typeof item.title !== 'string' || typeof item.description !== 'string' || !Number.isFinite(Date.parse(item.date)) || new URL(item.url).origin !== 'https://blog.openagentix.si'; }
      catch { return true; }
    })) throw new Error(`Invalid ${locale} news feed`);
  }
  await writeFile('src/data/news-fallback.json', `${JSON.stringify({ en: data.en, de: data.de }, null, 2)}\n`);
  console.log('Updated the published news snapshot.');
} catch (error) {
  console.warn(`News snapshot retained: ${error.message}`);
}
