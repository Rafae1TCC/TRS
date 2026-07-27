import { useEffect, useState } from 'react';
import LeaderboardTable from '../../components/leaderboard_table/LeaderboardTable';
import SplitText from '../../components/split_text/SplitText';
import { getLeaderboard, getPlayerAdvancements } from '../../services/api';
import './Leaderboard.css';

const KILLS_STAT_KEY = 'killed/entity.minecraft.player';
const DEATHS_STAT_KEY = 'custom/minecraft:deaths';

const handleAnimationComplete = () => {};

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeaderboardData() {
      try {
        setLoading(true);
        setError(null);

        // getLeaderboard retries forever on network errors / 5xx / 429,
        // so this only rejects on a non-retryable error (e.g. bad stat key).
        const [killsRes, deathsRes] = await Promise.all([
          getLeaderboard(KILLS_STAT_KEY, { limit: 100, signal: controller.signal }),
          getLeaderboard(DEATHS_STAT_KEY, { limit: 100, signal: controller.signal }),
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
              // A single player's advancement lookup failing shouldn't
              // take down the whole table.
              return { ...player, achievements: 0 };
            }
          })
        );

        const withKdr = withAchievements.map((p) => ({
          ...p,
          kdr: p.deaths > 0 ? (p.kills / p.deaths).toFixed(1) : p.kills.toFixed(1),
        }));

        if (!controller.signal.aborted) {
          setPlayers(withKdr);
          setLoading(false);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadLeaderboardData();

    return () => {
      controller.abort();
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
      </div>

      {error && <p className="leaderboard-status leaderboard-error">Error: {error}</p>}

      {!error && (
        <div className="leaderboard-container">
          <LeaderboardTable
            title="Most Kills"
            data={players}
            sortKey="kills"
            loading={loading}
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
            loading={loading}
            columns={[
              { key: 'achievements', label: 'Achievements', highlight: true },
            ]}
          />
          <LeaderboardTable
            title="Most Deaths"
            data={players}
            sortKey="deaths"
            loading={loading}
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