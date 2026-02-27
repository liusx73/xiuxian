import { create } from 'zustand'
import type { PlayerState, BattleState, GameTab } from '../types/game'
import { REALMS, MONSTERS, BASE_STATS } from './constants'

function calcStats(realmIndex: number, subLevel: number) {
  const realm = REALMS[realmIndex]
  const subMult = 1 + subLevel * 0.3
  const mult = realm.statMultiplier * subMult
  return {
    hp: Math.floor(BASE_STATS.hp * mult),
    maxHp: Math.floor(BASE_STATS.hp * mult),
    attack: Math.floor(BASE_STATS.attack * mult),
    defense: Math.floor(BASE_STATS.defense * mult),
    spiritualPower: Math.floor(BASE_STATS.spiritualPower * mult),
    cultivationSpeed: Math.floor(BASE_STATS.cultivationSpeed * mult * 10) / 10,
  }
}

interface GameStore {
  player: PlayerState
  battle: BattleState
  activeTab: GameTab
  gameLog: string[]

  setTab: (tab: GameTab) => void
  cultivateTick: () => void
  tryBreakthrough: () => boolean
  startBattle: (monsterIndex: number) => void
  battleTick: () => void
  stopBattle: () => void
  toggleAutoBattle: () => void
  addLog: (msg: string) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  player: {
    name: '无名修士',
    realmIndex: 0,
    subLevel: 0,
    qi: 0,
    spiritStones: 0,
    exp: 0,
    stats: calcStats(0, 0),
    battleHp: calcStats(0, 0).hp,
  },
  battle: {
    active: false,
    monsterIndex: 0,
    monsterHp: 0,
    monsterMaxHp: 0,
    playerBattleHp: 0,
    log: [],
    autoBattle: false,
    lastAttackTime: 0,
  },
  activeTab: 'cultivation',
  gameLog: ['欢迎来到修仙世界，开始你的仙途之旅吧！'],

  setTab: (tab) => set({ activeTab: tab }),

  cultivateTick: () => set((state) => {
    const gain = state.player.stats.cultivationSpeed
    return {
      player: {
        ...state.player,
        qi: state.player.qi + gain,
      },
    }
  }),

  tryBreakthrough: () => {
    const state = get()
    const { player } = state
    const realm = REALMS[player.realmIndex]
    const subLevels = realm.subLevels

    if (player.subLevel < subLevels.length - 1) {
      const cost = Math.floor(realm.requiredQi * (0.3 + player.subLevel * 0.3))
      if (player.qi >= cost) {
        const newSubLevel = player.subLevel + 1
        const newStats = calcStats(player.realmIndex, newSubLevel)
        set({
          player: {
            ...player,
            qi: player.qi - cost,
            subLevel: newSubLevel,
            stats: newStats,
            battleHp: newStats.hp,
          },
          gameLog: [
            `突破成功！${realm.name} ${subLevels[newSubLevel]}`,
            ...state.gameLog.slice(0, 49),
          ],
        })
        return true
      }
    } else if (player.realmIndex < REALMS.length - 1) {
      const cost = realm.requiredQi
      if (player.qi >= cost) {
        const newRealmIndex = player.realmIndex + 1
        const newStats = calcStats(newRealmIndex, 0)
        const newRealm = REALMS[newRealmIndex]
        set({
          player: {
            ...player,
            qi: player.qi - cost,
            realmIndex: newRealmIndex,
            subLevel: 0,
            stats: newStats,
            battleHp: newStats.hp,
          },
          gameLog: [
            `大突破！进入${newRealm.name} ${newRealm.subLevels[0]}！`,
            ...state.gameLog.slice(0, 49),
          ],
        })
        return true
      }
    }
    return false
  },

  startBattle: (monsterIndex) => set((state) => {
    const monster = MONSTERS[monsterIndex]
    return {
      battle: {
        active: true,
        monsterIndex,
        monsterHp: monster.hp,
        monsterMaxHp: monster.hp,
        playerBattleHp: state.player.stats.maxHp,
        log: [`遭遇 ${monster.name}！`],
        autoBattle: state.battle.autoBattle,
        lastAttackTime: Date.now(),
      },
    }
  }),

  battleTick: () => set((state) => {
    if (!state.battle.active) return state

    const monster = MONSTERS[state.battle.monsterIndex]
    const { stats } = state.player
    const log = [...state.battle.log]

    const playerDmg = Math.max(1, stats.attack - monster.defense)
    const monsterDmg = Math.max(1, monster.attack - stats.defense)

    const newMonsterHp = state.battle.monsterHp - playerDmg
    let newPlayerHp = state.battle.playerBattleHp - monsterDmg

    log.unshift(`你对 ${monster.name} 造成 ${playerDmg} 点伤害`)
    log.unshift(`${monster.name} 对你造成 ${monsterDmg} 点伤害`)

    if (newMonsterHp <= 0) {
      log.unshift(`击败 ${monster.name}！获得 ${monster.rewardStones} 灵石，${monster.rewardExp} 经验`)
      const shouldAutoBattle = state.battle.autoBattle

      if (shouldAutoBattle) {
        return {
          player: {
            ...state.player,
            spiritStones: state.player.spiritStones + monster.rewardStones,
            exp: state.player.exp + monster.rewardExp,
          },
          battle: {
            ...state.battle,
            monsterHp: monster.hp,
            monsterMaxHp: monster.hp,
            playerBattleHp: stats.maxHp,
            log: [`再次遭遇 ${monster.name}！`, ...log.slice(0, 20)],
            lastAttackTime: Date.now(),
          },
          gameLog: [
            `击败 ${monster.name}！+${monster.rewardStones}灵石`,
            ...state.gameLog.slice(0, 49),
          ],
        }
      }

      return {
        player: {
          ...state.player,
          spiritStones: state.player.spiritStones + monster.rewardStones,
          exp: state.player.exp + monster.rewardExp,
        },
        battle: {
          ...state.battle,
          active: false,
          monsterHp: 0,
          log: log.slice(0, 20),
        },
        gameLog: [
          `击败 ${monster.name}！+${monster.rewardStones}灵石`,
          ...state.gameLog.slice(0, 49),
        ],
      }
    }

    if (newPlayerHp <= 0) {
      newPlayerHp = 0
      log.unshift(`你被 ${monster.name} 击败了...`)
      return {
        battle: {
          ...state.battle,
          active: false,
          monsterHp: newMonsterHp,
          playerBattleHp: 0,
          log: log.slice(0, 20),
          autoBattle: false,
        },
        gameLog: [
          `被 ${monster.name} 击败，需要恢复...`,
          ...state.gameLog.slice(0, 49),
        ],
      }
    }

    return {
      battle: {
        ...state.battle,
        monsterHp: newMonsterHp,
        playerBattleHp: newPlayerHp,
        log: log.slice(0, 20),
        lastAttackTime: Date.now(),
      },
    }
  }),

  stopBattle: () => set((state) => ({
    battle: {
      ...state.battle,
      active: false,
      autoBattle: false,
    },
  })),

  toggleAutoBattle: () => set((state) => ({
    battle: {
      ...state.battle,
      autoBattle: !state.battle.autoBattle,
    },
  })),

  addLog: (msg) => set((state) => ({
    gameLog: [msg, ...state.gameLog.slice(0, 49)],
  })),
}))
