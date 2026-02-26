/** WordPress REST API client with pagination */

const BASE_URL = 'https://sitehub.dk/wp-json';

export async function fetchAll<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const searchParams = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      ...params,
    });
    const url = `${BASE_URL}${endpoint}?${searchParams}`;
    console.log(`  GET ${url}`);

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 400 && page > 1) break; // past last page
      throw new Error(`API error ${res.status}: ${url}`);
    }

    const data = (await res.json()) as T[];
    if (!Array.isArray(data) || data.length === 0) break;

    results.push(...data);
    const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? 1);
    if (page >= totalPages) break;
    page++;
  }

  return results;
}

export async function fetchOne<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const searchParams = new URLSearchParams(params);
  const url = `${BASE_URL}${endpoint}?${searchParams}`;
  console.log(`  GET ${url}`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

export async function downloadFile(
  sourceUrl: string,
  destPath: string,
): Promise<void> {
  const { writeFile, mkdir } = await import('node:fs/promises');
  const { dirname } = await import('node:path');

  await mkdir(dirname(destPath), { recursive: true });
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${sourceUrl}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buffer);
}
