// src/services/api.js
//
// Central place for every call to the Minecraft Stats API.
//
// All requests are relative paths ("/api/players", etc). In production,
// the browser resolves that against whatever domain served the page
// (teamrocketstudios.com), and nginx inside the container proxies it to
// the stats_api container over the internal Docker network. The API is
// never exposed to the public internet.

async function request(path, { params, ...options } = {}) {
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
      ...options,
    });
  } catch (err) {
    throw new Error(`Network error calling ${path}: ${err.message}`);
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // response wasn't JSON, ignore
    }
    throw new Error(`API error (${response.status}) on ${path}: ${detail}`);
  }

  return response.json();
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

export function getLeaderboard(statKey, { limit = 10 } = {}) {
  return request(`/api/leaderboard/${encodeURIComponent(statKey)}`, {
    params: { limit },
  });
}

// ============================================
// DASHBOARD
// ============================================

export function getDashboardSummary() {
  return request('/api/dashboard/summary');
}