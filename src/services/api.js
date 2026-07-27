// src/services/api.js
//
// Central place for every call to the Minecraft Stats API.
// Import what you need wherever you need it, e.g.:
//   import { getLeaderboard, getPlayers } from '../../services/api';
//
// Configure the backend URL with a Vite env var so it's easy to point at
// localhost during development and your real server in production.
// Create a `.env` file at your project root with:
//   VITE_API_URL=http://localhost:8000
// (or wherever your FastAPI app is running / deployed).

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Internal helper: does the fetch, checks the response, parses JSON,
 * and throws a readable error if anything goes wrong. Every exported
 * function below is a thin wrapper around this.
 */
async function request(path, { params, ...options } = {}) {
  const url = new URL(`${BASE_URL}${path}`);

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
    // Network error (server down, CORS, no connection, etc.)
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