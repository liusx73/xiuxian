import { useGameStore } from '../../game/store'
import { REALMS } from '../../game/constants'

export default function CultivationPanel() {
  const player = useGameStore((s) => s.player)
  const tryBreakthrough = useGameStore((s) => s.tryBreakthrough)
  const realm = REALMS[player.realmIndex]
  const subLevels = realm.subLevels

  const isMaxSubLevel = player.subLevel >= subLevels.length - 1
  const isMaxRealm = player.realmIndex >= REALMS.length - 1

  let breakthroughCost: number
  let breakthroughLabel: string

  if (!isMaxSubLevel) {
    breakthroughCost = Math.floor(realm.requiredQi * (0.3 + player.subLevel * 0.3))
    breakthroughLabel = `突破至 ${realm.name} ${subLevels[player.subLevel + 1]}`
  } else if (!isMaxRealm) {
    breakthroughCost = realm.requiredQi
    const nextRealm = REALMS[player.realmIndex + 1]
    breakthroughLabel = `突破至 ${nextRealm.name}`
  } else {
    breakthroughCost = Infinity
    breakthroughLabel = '已达最高境界'
  }

  const canBreakthrough = player.qi >= breakthroughCost
  const progress = Math.min(100, (player.qi / breakthroughCost) * 100)

  return (
    <div className="panel cultivation-panel">
      <div className="cultivation-info">
        <div className="qi-display">
          <span className="qi-label">灵气</span>
          <span className="qi-value" style={{ color: realm.color }}>
            {Math.floor(player.qi)}
          </span>
        </div>
        <div className="qi-speed">
          +{player.stats.cultivationSpeed}/秒
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>{breakthroughLabel}</span>
          <span>{Math.floor(player.qi)} / {breakthroughCost === Infinity ? '∞' : breakthroughCost}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, backgroundColor: realm.color }}
          />
        </div>
      </div>

      <button
        className={`breakthrough-btn ${canBreakthrough ? 'ready' : ''}`}
        onClick={() => canBreakthrough && tryBreakthrough()}
        disabled={!canBreakthrough}
        style={canBreakthrough ? { backgroundColor: realm.color } : undefined}
      >
        {canBreakthrough ? '⚡ 突破！' : `灵气不足 (需要 ${breakthroughCost === Infinity ? '∞' : breakthroughCost})`}
      </button>

      <div className="realm-progress">
        <h3>境界之路</h3>
        <div className="realm-list">
          {REALMS.map((r, idx) => (
            <div
              key={r.id}
              className={`realm-item ${idx === player.realmIndex ? 'current' : ''} ${idx < player.realmIndex ? 'completed' : ''}`}
              style={idx === player.realmIndex ? { borderColor: r.color, color: r.color } : undefined}
            >
              <span className="realm-name">{r.name}</span>
              {idx === player.realmIndex && (
                <span className="realm-sub">{subLevels[player.subLevel]}</span>
              )}
              {idx < player.realmIndex && <span className="realm-check">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
