type HighlightlyFetchOptions = {
  searchParams?: Record<string, string | number | boolean | undefined>;
  revalidate?: number;
};

function buildUrl(baseUrl: string, endpoint: string, searchParams?: HighlightlyFetchOptions["searchParams"]) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${normalizedBaseUrl}${normalizedEndpoint}`);

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  return url;
}

export async function highlightlyFetch(endpoint: string, options?: HighlightlyFetchOptions) {
  const baseUrl = process.env.HIGHLIGHTLY_API_BASE_URL?.trim();
  const apiKey = process.env.HIGHLIGHTLY_API_KEY?.trim();
  const apiHost = process.env.HIGHLIGHTLY_API_HOST?.trim();

  if (!baseUrl) throw new Error("Missing HIGHLIGHTLY_API_BASE_URL environment variable");
  if (!apiKey) throw new Error("Missing HIGHLIGHTLY_API_KEY environment variable");

  const url = buildUrl(baseUrl, endpoint, options?.searchParams);
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-rapidapi-key": apiKey
  };

  if (apiHost) {
    headers["x-rapidapi-host"] = apiHost;
  }

  const response = await fetch(url.toString(), {
    headers,
    next: { revalidate: options?.revalidate ?? 60 }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Highlightly API error ${response.status}: ${errorText.slice(0, 300)}`);
  }

  return response.json();
}
