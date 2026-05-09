export type HighlightlyFetchOptions = {
  searchParams?: Record<string, string | number | boolean | undefined>;
  revalidate?: number;
};

export type HighlightlyFetchMeta<T = unknown> = {
  data: T;
  status: number;
  url: string;
  rateLimit?: {
    limit?: string;
    remaining?: string;
  };
};

export function getHighlightlyConfigStatus() {
  const baseUrl = process.env.HIGHLIGHTLY_API_BASE_URL?.trim();
  const apiKey = process.env.HIGHLIGHTLY_API_KEY?.trim();
  const apiHost = process.env.HIGHLIGHTLY_API_HOST?.trim();

  return {
    baseUrl,
    apiHost,
    hasBaseUrl: Boolean(baseUrl),
    hasApiKey: Boolean(apiKey)
  };
}

export function buildHighlightlyUrl(
  endpoint: string,
  searchParams?: HighlightlyFetchOptions["searchParams"]
) {
  const baseUrl = process.env.HIGHLIGHTLY_API_BASE_URL?.trim();
  if (!baseUrl) throw new Error("Missing HIGHLIGHTLY_API_BASE_URL environment variable");

  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${normalizedBaseUrl}${normalizedEndpoint}`);

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

export async function highlightlyFetchWithMeta<T = unknown>(
  endpoint: string,
  options?: HighlightlyFetchOptions
): Promise<HighlightlyFetchMeta<T>> {
  const { apiHost, hasApiKey } = getHighlightlyConfigStatus();
  const apiKey = process.env.HIGHLIGHTLY_API_KEY?.trim();

  if (!hasApiKey || !apiKey) throw new Error("Missing HIGHLIGHTLY_API_KEY environment variable");

  const url = buildHighlightlyUrl(endpoint, options?.searchParams);
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
    throw new Error(`Highlightly API error ${response.status}: ${errorText.slice(0, 500)}`);
  }

  return {
    data: await response.json() as T,
    status: response.status,
    url: url.toString(),
    rateLimit: {
      limit: response.headers.get("x-ratelimit-requests-limit") ?? undefined,
      remaining: response.headers.get("x-ratelimit-requests-remaining") ?? undefined
    }
  };
}

export async function highlightlyFetch<T = unknown>(endpoint: string, options?: HighlightlyFetchOptions) {
  const result = await highlightlyFetchWithMeta<T>(endpoint, options);
  return result.data;
}
