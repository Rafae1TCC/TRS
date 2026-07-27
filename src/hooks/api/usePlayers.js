// hooks/usePlayers.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export function usePlayers(search = '', limit = 50, offset = 0) {
  const [players, setPlayers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/players?${params.toString()}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPlayers(result.players);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  }, [search, limit, offset]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { players, total, loading, error, refetch: fetchPlayers };
}