import { useGameStore } from '../../game/store'
import { MONSTERS, REALMS } from '../../game/constants'

export default function BattlePanel() {
  const player = useGameStore((s) => s.player)
  const battle = useGameStore((s) => s.battle)
  const startBattle = useGameStore((s) => s.startBattle)
  const stopBattle = useGameStore((s) => s.stopBattle)
  const toggleAutoBattle = useGameStore((s) => s.toggleAutoBattle)

  const availableMonsters = MONSTERS.filter((m) => m.minRealm <= player.realmIndex)

  return (
    <div className="panel battle-panel">
      {battle.active ? (
        <div className="battle-active">
          <div className="battle-hud">
            <div className="hud-bar">
              <span className="hud-label">你</span>
              <div className="hp-bar">
                <div
                  className="hp-fill player-hp"
                  style={{ width: `${(battle.playerBattleHp / player.stats.maxHp) * 100}%` }}
                />
              </div>
              <span className="hp-text">{battle.playerBattleHp}/{player.stats.maxHp}</span>
            </div>
            <div className="hud-bar">
              <span className="hud-label">{MONSTERS[battle.monsterIndex].name}</span>
              <div className="hp-bar">
                <div
                  className="hp-fill monster-hp"
                  style={{ width: `${(battle.monsterHp / battle.monsterMaxHp) * 100}%` }}
                />
              </div>
              <span className="hp-text">{battle.monsterHp}/{battle.monsterMaxHp}</span>
            </div>
          </div>

          <div className="battle-controls">
            <button
              className={`auto-btn ${battle.autoBattle ? 'active' : ''}`}
              onClick={toggleAutoBattle}
            >
              {battle.autoBattle ? '🔄 自动中' : '▶ 自动战斗'}
            </button>
            <button className="stop-btn" onClick={stopBattle}>
              ⏹ 撤退
            </button>
          </div>

          <div className="battle-log">
            {battle.log.map((msg, i) => (
              <div key={i} className="battle-log-item">{msg}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="monster-select">
          <h3 className="monster-title">选择对手</h3>
          <div className="monster-list">
            {availableMonsters.map((monster) => {
              const difficult = monster.attack > player.stats.defense * 2
              return (
                <button
                  key={monster.id}
                  className={`monster-card ${difficult ? 'dangerous' : ''}`}
                  onClick={() => startBattle(monster.id)}
                >
                  <div className="monster-name">{monster.name}</div>
                  <div className="monster-stats">
                    <span>❤️ {monster.hp}</span>
                    <span>⚔️ {monster.attack}</span>
                    <span>🛡️ {monster.defense}</span>
                  </div>
                  <div className="monster-reward">
                    奖励: {monster.rewardStones} 灵石 | {monster.rewardExp} 经验
                  </div>
                  <div className="monster-realm">
                    最低: {REALMS[monster.minRealm].name}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
