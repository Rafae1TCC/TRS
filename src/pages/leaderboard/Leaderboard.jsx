import { useEffect, useState } from 'react';
import LeaderboardTable from '../../components/leaderboard_table/LeaderboardTable';
import SplitText from '../../components/split_text/SplitText';
import { getLeaderboard, getPlayerAdvancements } from '../../services/api';
import './Leaderboard.css';

const KILLS_STAT_KEY = 'killed/entity.minecraft.player';
const DEATHS_STAT_KEY = 'custom/minecraft:deaths';
const TIME_ALIVE_KEY = 'custom/minecraft:time_since_death';

const RETRY_BASE_DELAY_MS = 1000;
const RETRY_MAX_DELAY_MS = 30000;

const handleAnimationComplete = () => {};

function emptyPlayer(uuid, name) {
  return { uuid, name, kills: 0, deaths: 0, timeAlive: 0 };
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

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAndMerge(signal) {
      const [killsRes, deathsRes, timeRes] = await Promise.all([
        getLeaderboard(KILLS_STAT_KEY, { limit: 100, signal }),
        getLeaderboard(DEATHS_STAT_KEY, { limit: 100, signal }),
        getLeaderboard(TIME_ALIVE_KEY, { limit: 100, signal }),
      ]);

      // Merge the three leaderboards into one row per player, keyed by
      // uuid. Every fallback seeds ALL stat fields (not just the one
      // currently being merged) so a player who only appears on one
      // leaderboard doesn't end up with missing fields downstream.
      const merged = new Map();

      killsRes.leaderboard.forEach((row) => {
        const existing = merged.get(row.uuid) || emptyPlayer(row.uuid, row.username);
        existing.name = row.username;
        existing.kills = row.value;
        merged.set(row.uuid, existing);
      });

      deathsRes.leaderboard.forEach((row) => {
        const existing = merged.get(row.uuid) || emptyPlayer(row.uuid, row.username);
        existing.name = row.username;
        existing.deaths = row.value;
        merged.set(row.uuid, existing);
      });

      timeRes.leaderboard.forEach((row) => {
        const existing = merged.get(row.uuid) || emptyPlayer(row.uuid, row.username);
        existing.name = row.username;
        existing.timeAlive = row.value;
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

      return withAchievements.map((p) => ({
        ...p,
        kdr: p.deaths > 0 ? (p.kills / p.deaths).toFixed(1) : p.kills.toFixed(1),
      }));
    }

    // Loads data and retries forever (silently, no console output) on
    // ANY failure — network errors, bad responses, or unexpected shape
    // mismatches. The page must never show an error state, only
    // skeletons, so a failure here just means "stay on skeletons and
    // try again shortly" rather than surfacing anything to the user.
    async function loadWithRetry() {
      let attempt = 0;

      for (;;) {
        if (controller.signal.aborted) return;

        try {
          const result = await fetchAndMerge(controller.signal);
          if (!controller.signal.aborted) {
            setPlayers(result);
            setLoading(false);
          }
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;

          attempt += 1;
          const delay = Math.min(
            RETRY_BASE_DELAY_MS * 2 ** (attempt - 1),
            RETRY_MAX_DELAY_MS
          );
          const jitter = delay * (0.5 + Math.random() * 0.5);

          try {
            await sleep(jitter, controller.signal);
          } catch {
            return; // aborted while waiting
          }
          // loading stays true the whole time -> skeletons persist
        }
      }
    }

    loadWithRetry();

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
          title="Longest time alive"
          data={players}
          sortKey="timeAlive"
          loading={loading}
          columns={[
            { key: 'timeAlive', label: 'Time', highlight: true },
          ]}
        />
      </div>
    </div>
  );
}