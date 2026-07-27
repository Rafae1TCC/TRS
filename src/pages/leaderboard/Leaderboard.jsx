import LeaderboardTable from '../../components/leaderboard_table/LeaderboardTable';
import SplitText from '../../components/split_text/SplitText';
import './Leaderboard.css';

const players = [
  { name: 'RafaZackyZ',    kills: 320, deaths: 110, achievements: 42, kdr: '2.9' },
  { name: 'Ryanlightning', kills: 298, deaths: 95,  achievements: 51, kdr: '3.1' },
  { name: 'GhostRider99',  kills: 275, deaths: 140, achievements: 30, kdr: '1.9' },
  { name: 'NovaStrike',    kills: 410, deaths: 200, achievements: 60, kdr: '2.0' },
  { name: 'ShadowFang',    kills: 180, deaths: 60,  achievements: 25, kdr: '3.0' },
  { name: 'VenomX',        kills: 260, deaths: 175, achievements: 38, kdr: '1.5' },
  { name: 'BlitzKrieg',    kills: 340, deaths: 90,  achievements: 47, kdr: '3.8' },
  { name: 'IronWolf',      kills: 150, deaths: 220, achievements: 20, kdr: '0.7' },
];

const handleAnimationComplete = () => {};

export default function Leaderboard() {
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
    </div>
  )
}