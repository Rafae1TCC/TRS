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
              <div className="leaderboard-row leaderboard-row-skeleton" key={`skeleton-${i}`}>
                <div className="col col-rank">
                  <span className="skeleton-block skeleton-rank" />
                </div>
                <div className="col col-player">
                  <span className="skeleton-block skeleton-name" />
                </div>
                {columns.map((col) => (
                  <div className="col col-stat" key={col.key}>
                    <span className="skeleton-block skeleton-stat" />
                  </div>
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