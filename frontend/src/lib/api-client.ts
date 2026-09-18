const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
/** Origin the backend serves uploaded files from (API_URL minus its trailing /api). */
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json();
        setAccessToken(data.accessToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

interface RequestOptions extends RequestInit {
  skipAuthRetry?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuthRetry, headers, ...rest } = options;

  const doFetch = () =>
    fetch(`${API_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });

  let res = await doFetch();

  if (res.status === 401 && !skipAuthRetry && !path.startsWith("/auth/")) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch();
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? res.statusText, body?.details);
  }

  return body as T;
}

function filenameFromContentDisposition(header: string | null, fallback: string): string {
  const match = header?.match(/filename="?([^"]+)"?/);
  return match?.[1] ?? fallback;
}

/**
 * Fetches a binary response (report exports, etc.) and triggers a browser
 * save-as, reusing the same auth-header/refresh-retry logic as `request`.
 */
async function downloadFile(path: string, fallbackFilename: string): Promise<void> {
  const doFetch = () =>
    fetch(`${API_URL}${path}`, {
      credentials: "include",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

  let res = await doFetch();

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) res = await doFetch();
  }

  if (!res.ok) {
    const body = res.headers.get("content-type")?.includes("application/json")
      ? await res.json().catch(() => null)
      : null;
    throw new ApiError(res.status, body?.error ?? res.statusText, body?.details);
  }

  const blob = await res.blob();
  const filename = filenameFromContentDisposition(res.headers.get("content-disposition"), fallbackFilename);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Uploads a file as multipart/form-data (browser sets the boundary; no Content-Type override). */
async function uploadFile<T>(path: string, file: File): Promise<T> {
  const form = new FormData();
  form.append("file", file);

  const doFetch = () =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: form,
    });

  let res = await doFetch();

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) res = await doFetch();
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? res.statusText, body?.details);
  }

  return body as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, data?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body: data !== undefined ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
  refresh: tryRefresh,
  download: downloadFile,
  upload: uploadFile,
};
