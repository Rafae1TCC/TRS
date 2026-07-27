import Card from '../card/Card';
import './LeaderboardTable.css';

export default function LeaderboardTable({ title, data, sortKey, columns }) {
  const sorted = [...data].sort(
    (a, b) => Number(b[sortKey]) - Number(a[sortKey])
  );

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

        {sorted.map((player, i) => (
          <Card
            key={player.name + i}
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