// hooks/useLeaderboard.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export function useLeaderboard(statKey, limit = 10) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statInfo, setStatInfo] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    if (!statKey) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/leaderboard/${statKey}?limit=${limit}`,
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
      
      // Transform API data to match your component's expected format
      const transformedData = result.leaderboard.map((player, index) => ({
        rank: player.rank || index + 1,
        uuid: player.uuid,
        name: player.username,
        value: player.value,
        lastUpdated: player.last_updated,
        // Add other fields if needed from your API
      }));

      setData(transformedData);
      setStatInfo({
        statKey: result.stat_key,
        displayName: result.stat_display_name,
        category: result.category,
        totalPlayers: result.total_players,
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [statKey, limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { data, loading, error, statInfo, refetch: fetchLeaderboard };
}