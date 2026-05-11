export async function espnFetch(url: string, options?: { revalidate?: number; noStore?: boolean }) {
  const cacheOptions = options?.noStore
    ? { cache: "no-store" as const }
    : { next: { revalidate: options?.revalidate ?? 60 } };

  const response = await fetch(url, {
    ...cacheOptions,
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ESPN API error ${response.status}: ${errorText}`);
  }

  return response.json();
}
