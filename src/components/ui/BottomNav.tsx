import { useGameStore } from '../../game/store'
import type { GameTab } from '../../types/game'

const tabs: { key: GameTab; label: string; icon: string }[] = [
  { key: 'cultivation', label: '修炼', icon: '🧘' },
  { key: 'battle', label: '战斗', icon: '⚔️' },
  { key: 'stats', label: '属性', icon: '📊' },
]

export default function BottomNav() {
  const activeTab = useGameStore((s) => s.activeTab)
  const setTab = useGameStore((s) => s.setTab)

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => setTab(tab.key)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
