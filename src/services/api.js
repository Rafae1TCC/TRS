// src/services/api.js
//
// Central place for every call to the Minecraft Stats API.
//
// All requests are relative paths ("/api/players", etc). In production,
// the browser resolves that against whatever domain served the page
// (teamrocketstudios.com), and nginx inside the container proxies it to
// the stats_api container over the internal Docker network. The API is
// never exposed to the public internet.

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 30000;

function isRetryableStatus(status) {
  // 0 = network/connection failure (no response at all).
  return status === 0 || status === 429 || status >= 500;
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

async function request(path, { params, signal, ...options } = {}) {
  const url = new URL(path, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
  }

  let response;
  try {
    response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      signal,
      ...options,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError(`Network error calling ${path}: ${err.message}`, 0);
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // response wasn't JSON, ignore
    }
    throw new ApiError(`API error (${response.status}) on ${path}: ${detail}`, response.status);
  }

  return response.json();
}

// Like `request`, but retries forever (with capped exponential backoff +
// jitter) on network errors, 429s, and 5xx responses. Non-retryable errors
// (4xx other than 429) are thrown immediately. Pass `signal` from an
// AbortController to stop retrying, e.g. on component unmount.
async function requestWithRetry(path, options = {}) {
  const { signal, ...rest } = options;
  let attempt = 0;

  for (;;) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    try {
      return await request(path, { ...rest, signal });
    } catch (err) {
      if (err.name === 'AbortError') throw err;

      const status = err.status ?? 0;
      if (!isRetryableStatus(status)) throw err;

      attempt += 1;
      const delay = Math.min(BASE_RETRY_DELAY_MS * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS);
      const jitter = delay * (0.5 + Math.random() * 0.5);
      await sleep(jitter, signal);
    }
  }
}

// ============================================
// HEALTH
// ============================================

export function getApiInfo() {
  return request('/');
}

export function getHealth() {
  return request('/api/health');
}

// ============================================
// PLAYERS
// ============================================

export function getPlayers({ limit = 50, offset = 0, search } = {}) {
  return request('/api/players', { params: { limit, offset, search } });
}

export function getPlayer(uuid) {
  return request(`/api/players/${uuid}`);
}

export function getPlayerStats(uuid) {
  return request(`/api/players/${uuid}/stats`);
}

export function getPlayerAdvancements(uuid) {
  return request(`/api/players/${uuid}/advancements`);
}

// ============================================
// STAT & ADVANCEMENT DEFINITIONS
// ============================================

export function getStatDefinitions({ category, limit = 100 } = {}) {
  return request('/api/stats/definitions', { params: { category, limit } });
}

export function getAdvancementDefinitions({ category, limit = 100 } = {}) {
  return request('/api/advancements/definitions', { params: { category, limit } });
}

// ============================================
// LEADERBOARD
// ============================================

// Retries indefinitely on transient failures — this is what drives the
// tables on the Leaderboard page, and we'd rather keep trying quietly in
// the background than show an error for a blip.
export function getLeaderboard(statKey, { limit = 10, signal } = {}) {
  return requestWithRetry(`/api/leaderboard/${encodeURIComponent(statKey)}`, {
    params: { limit },
    signal,
  });
}

// ============================================
// DASHBOARD
// ============================================

export function getDashboardSummary() {
  return request('/api/dashboard/summary');
}