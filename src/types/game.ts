export interface RealmInfo {
  id: number
  name: string
  subLevels: string[]
  requiredQi: number
  statMultiplier: number
  color: string
}

export interface MonsterInfo {
  id: number
  name: string
  hp: number
  attack: number
  defense: number
  rewardStones: number
  rewardExp: number
  minRealm: number
}

export interface PlayerStats {
  hp: number
  maxHp: number
  attack: number
  defense: number
  spiritualPower: number
  cultivationSpeed: number
}

export interface PlayerState {
  name: string
  realmIndex: number
  subLevel: number
  qi: number
  spiritStones: number
  exp: number
  stats: PlayerStats
  battleHp: number
}

export interface BattleState {
  active: boolean
  monsterIndex: number
  monsterHp: number
  monsterMaxHp: number
  playerBattleHp: number
  log: string[]
  autoBattle: boolean
  lastAttackTime: number
}

export type GameTab = 'cultivation' | 'battle' | 'stats'
