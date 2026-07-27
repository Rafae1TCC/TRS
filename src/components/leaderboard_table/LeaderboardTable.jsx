import Card from '../card/Card';
import './LeaderboardTable.css';

const SKELETON_ROWS = 8;

export default function LeaderboardTable({ title, data, sortKey, columns, loading }) {
  const sorted = loading
    ? []
    : [...data].sort((a, b) => Number(b[sortKey]) - Number(a[sortKey]));

  return (
    <div className="leaderboard-table">
      <h2 className="leaderboard-table-title">{title}</h2>

      <div
        className="leaderboard-grid"
        style={{ gridTemplateColumns: `auto 1fr repeat(${columns.length}, auto)` }}
      >
        <div className="leaderboard-head">
          <span>#</span>
          <span>Player</span>
          {columns.map((col) => (
            <span key={col.key}>{col.label}</span>
          ))}
        </div>

        {loading
          ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div className="leaderboard-row-skeleton" key={`skeleton-${i}`}>
                <span className="skeleton-block skeleton-rank" />
                <span className="skeleton-block skeleton-name" />
                {columns.map((col) => (
                  <span className="skeleton-block skeleton-stat" key={col.key} />
                ))}
              </div>
            ))
          : sorted.map((player, i) => (
              <Card
                key={player.uuid ?? player.name + i}
                rank={i + 1}
                name={player.name}
                columns={columns}
                stats={player}
              />
            ))}
      </div>
    </div>
  );
}