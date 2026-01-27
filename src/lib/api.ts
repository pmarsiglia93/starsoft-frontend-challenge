const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api-challenge.starsoft.games/api/v1";

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

function buildUrl(path: string, params?: FetchOptions["params"]) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.set(k, String(v)),
    );
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, ...init } = options;

  const res = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error (${res.status}): ${text || res.statusText}`);
  }

  return res.json() as Promise<T>;
}
