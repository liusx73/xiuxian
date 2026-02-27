import { useGameStore } from '../../game/store'
import { REALMS } from '../../game/constants'

export default function StatsPanel() {
  const player = useGameStore((s) => s.player)
  const realm = REALMS[player.realmIndex]

  return (
    <div className="panel stats-panel">
      <h2 className="panel-title" style={{ color: realm.color }}>
        {player.name}
      </h2>

      <div className="realm-badge" style={{ borderColor: realm.color, color: realm.color }}>
        {realm.name} · {realm.subLevels[player.subLevel]}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">气血</span>
          <span className="stat-value">{player.stats.maxHp}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">攻击</span>
          <span className="stat-value">{player.stats.attack}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">防御</span>
          <span className="stat-value">{player.stats.defense}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">灵力</span>
          <span className="stat-value">{player.stats.spiritualPower}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">修炼速度</span>
          <span className="stat-value">{player.stats.cultivationSpeed}/s</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">灵石</span>
          <span className="stat-value gold">{player.spiritStones}</span>
        </div>
      </div>

      <div className="log-section">
        <h3 className="log-title">修仙日志</h3>
        <div className="log-list">
          {useGameStore((s) => s.gameLog).map((msg, i) => (
            <div key={i} className="log-item">{msg}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
