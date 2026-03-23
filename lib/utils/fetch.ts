export async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit & {timeoutMs?: number}) {
  const timeoutMs = init?.timeoutMs ?? 10000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}
