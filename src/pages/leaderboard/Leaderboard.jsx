// Leaderboard.jsx
import { useState, useEffect, useMemo } from 'react';
import LeaderboardTable from '../../components/leaderboard_table/LeaderboardTable';
import SplitText from '../../components/split_text/SplitText';
import './Leaderboard.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPlayerStats = async () => {
      try {
        console.log('Fetching from API:', API_BASE_URL); // Debug log
        
        // Fetch all players first
        const playersResponse = await fetch(`${API_BASE_URL}/api/players?limit=100`);
        if (!playersResponse.ok) throw new Error('Failed to fetch players');
        const playersData = await playersResponse.json();

        // Fetch stats for each player and combine
        const playersWithStats = await Promise.all(
          playersData.players.map(async (player) => {
            try {
              const statsResponse = await fetch(`${API_BASE_URL}/api/players/${player.uuid}/stats`);
              if (!statsResponse.ok) {
                // Return default stats if player has no stats
                return {
                  name: player.username,
                  uuid: player.uuid,
                  kills: 0,
                  deaths: 0,
                  achievements: 0,
                  kdr: '0.0',
                };
              }
              const statsData = await statsResponse.json();

              // Find specific stats from the stats array
              const kills = statsData.stats.find(s => s.stat_key === 'kills')?.value || 0;
              const deaths = statsData.stats.find(s => s.stat_key === 'deaths')?.value || 0;
              
              // For achievements, you might need to fetch from a different endpoint
              // or calculate from the advancements data
              const kdr = deaths > 0 ? (kills / deaths).toFixed(1) : kills > 0 ? kills.toFixed(1) : '0.0';

              return {
                name: player.username,
                uuid: player.uuid,
                kills: kills,
                deaths: deaths,
                achievements: 0, // You'll need to fetch achievements separately
                kdr: kdr,
              };
            } catch (err) {
              console.error(`Error fetching stats for ${player.username}:`, err);
              return {
                name: player.username,
                uuid: player.uuid,
                kills: 0,
                deaths: 0,
                achievements: 0,
                kdr: '0.0',
              };
            }
          })
        );

        // Sort by kills for the data
        setPlayers(playersWithStats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllPlayerStats();
  }, []);

  // Memoize sorted data for each leaderboard type
  const sortedByKills = useMemo(() => {
    return [...players].sort((a, b) => b.kills - a.kills);
  }, [players]);

  const sortedByAchievements = useMemo(() => {
    return [...players].sort((a, b) => b.achievements - a.achievements);
  }, [players]);

  const sortedByDeaths = useMemo(() => {
    return [...players].sort((a, b) => b.deaths - a.deaths);
  }, [players]);

  const handleAnimationComplete = () => {};

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="loading-container">
          <p>Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-page">
        <div className="error-container">
          <p>Error loading leaderboard data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-title">
        <SplitText
          text="Leaderboard"
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin=""
          textAlign=""
          tag="h1"
          onLetterAnimationComplete={handleAnimationComplete}
          showCallback
        />
        <p className="leaderboard-subtitle">
          Ranked by kills, achievements, and deaths across all tracked matches.
        </p>
      </div>

      <div className="leaderboard-container">
        <LeaderboardTable
          title="Most Kills"
          data={sortedByKills}
          sortKey="kills"
          columns={[
            { key: 'kills', label: 'Kills', highlight: true },
            { key: 'deaths', label: 'Deaths' },
            { key: 'kdr', label: 'KDR' },
          ]}
        />

        <LeaderboardTable
          title="Most Achievements"
          data={sortedByAchievements}
          sortKey="achievements"
          columns={[
            { key: 'achievements', label: 'Achievements', highlight: true },
          ]}
        />

        <LeaderboardTable
          title="Most Deaths"
          data={sortedByDeaths}
          sortKey="deaths"
          columns={[
            { key: 'deaths', label: 'Deaths', highlight: true },
            { key: 'kills', label: 'Kills' },
            { key: 'kdr', label: 'KDR' },
          ]}
        />
      </div>
    </div>
  );
}