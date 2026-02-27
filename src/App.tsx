import { useEffect, useRef } from 'react'
import { useGameStore } from './game/store'
import { CULTIVATION_TICK_MS, BATTLE_TICK_MS } from './game/constants'
import CultivationScene from './components/scene/CultivationScene'
import BattleScene from './components/scene/BattleScene'
import CultivationPanel from './components/ui/CultivationPanel'
import BattlePanel from './components/ui/BattlePanel'
import StatsPanel from './components/ui/StatsPanel'
import BottomNav from './components/ui/BottomNav'
import './App.css'

function useGameLoop() {
  const cultivateTick = useGameStore((s) => s.cultivateTick)
  const battleTick = useGameStore((s) => s.battleTick)
  const cultivationRef = useRef<ReturnType<typeof setInterval>>()
  const battleRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    cultivationRef.current = setInterval(cultivateTick, CULTIVATION_TICK_MS)
    return () => clearInterval(cultivationRef.current)
  }, [cultivateTick])

  useEffect(() => {
    battleRef.current = setInterval(() => {
      const battle = useGameStore.getState().battle
      if (battle.active) {
        battleTick()
      }
    }, BATTLE_TICK_MS)
    return () => clearInterval(battleRef.current)
  }, [battleTick])
}

export default function App() {
  useGameLoop()
  const activeTab = useGameStore((s) => s.activeTab)

  return (
    <div className="app">
      <div className="scene-container">
        {activeTab === 'cultivation' && <CultivationScene />}
        {activeTab === 'battle' && <BattleScene />}
        {activeTab === 'stats' && <CultivationScene />}
      </div>

      <div className="ui-overlay">
        <div className="panel-container">
          {activeTab === 'cultivation' && <CultivationPanel />}
          {activeTab === 'battle' && <BattlePanel />}
          {activeTab === 'stats' && <StatsPanel />}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
