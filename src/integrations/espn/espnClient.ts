export async function espnFetch(url: string, options?: { revalidate?: number }) {
  const response = await fetch(url, {
    next: { revalidate: options?.revalidate ?? 60 },
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
