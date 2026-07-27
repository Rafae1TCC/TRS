import { useEffect, useState } from 'react';
import LeaderboardTable from '../../components/leaderboard_table/LeaderboardTable';
import SplitText from '../../components/split_text/SplitText';
import { getLeaderboard, getPlayerAdvancements } from '../../services/api';
import './Leaderboard.css';

const KILLS_STAT_KEY = 'custom/minecraft:deaths';
const DEATHS_STAT_KEY = 'killed/entity.minecraft.player';

const handleAnimationComplete = () => {};

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboardData() {
      try {
        setLoading(true);
        setError(null);

        // Pull kills + deaths leaderboards in parallel.
        const [killsRes, deathsRes] = await Promise.all([
          getLeaderboard(KILLS_STAT_KEY, { limit: 100 }),
          getLeaderboard(DEATHS_STAT_KEY, { limit: 100 }),
        ]);

        // Merge the two leaderboards into one row per player, keyed by uuid.
        const merged = new Map();

        killsRes.leaderboard.forEach((row) => {
          merged.set(row.uuid, {
            uuid: row.uuid,
            name: row.username,
            kills: row.value,
            deaths: 0,
          });
        });

        deathsRes.leaderboard.forEach((row) => {
          const existing = merged.get(row.uuid) || {
            uuid: row.uuid,
            name: row.username,
            kills: 0,
          };
          existing.deaths = row.value;
          merged.set(row.uuid, existing);
        });

        const withAchievements = await Promise.all(
          Array.from(merged.values()).map(async (player) => {
            try {
              const advRes = await getPlayerAdvancements(player.uuid);
              return {
                ...player,
                achievements: advRes.summary.completed,
              };
            } catch {
              return { ...player, achievements: 0 };
            }
          })
        );

        const withKdr = withAchievements.map((p) => ({
          ...p,
          kdr: p.deaths > 0 ? (p.kills / p.deaths).toFixed(1) : p.kills.toFixed(1),
        }));

        if (!cancelled) {
          setPlayers(withKdr);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeaderboardData();

    return () => {
      cancelled = true;
    };
  }, []);

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

      {loading && <p className="leaderboard-status">Loading leaderboard…</p>}
      {error && <p className="leaderboard-status leaderboard-error">Error: {error}</p>}

      {!loading && !error && (
        <div className="leaderboard-container">
          <LeaderboardTable
            title="Most Kills"
            data={players}
            sortKey="kills"
            columns={[
              { key: 'kills', label: 'Kills', highlight: true },
              { key: 'deaths', label: 'Deaths' },
              { key: 'kdr', label: 'KDR' },
            ]}
          />
          <LeaderboardTable
            title="Most Achievements"
            data={players}
            sortKey="achievements"
            columns={[
              { key: 'achievements', label: 'Achievements', highlight: true },
            ]}
          />
          <LeaderboardTable
            title="Most Deaths"
            data={players}
            sortKey="deaths"
            columns={[
              { key: 'deaths', label: 'Deaths', highlight: true },
              { key: 'kills', label: 'Kills' },
              { key: 'kdr', label: 'KDR' },
            ]}
          />
        </div>
      )}
    </div>
  );
}