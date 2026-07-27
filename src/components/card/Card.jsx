import './Card.css';

export default function Card({ rank, name, columns, stats }) {
  return (
    <div className="leaderboard-row">
      <div className="col col-rank">
        <span className="rank-number">{rank}</span>
      </div>
      <div className="col col-player">
        <span className="player-name">{name}</span>
      </div>
      {columns.map((col) => (
        <div
          key={col.key}
          className={`col col-stat${col.highlight ? ' col-stat-highlight' : ''}`}
        >
          <span>{stats[col.key]}</span>
        </div>
      ))}
    </div>
  );
}