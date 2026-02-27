import type { RealmInfo, MonsterInfo } from '../types/game'

export const REALMS: RealmInfo[] = [
  { id: 0, name: '练气期', subLevels: ['初期', '中期', '后期'], requiredQi: 100, statMultiplier: 1, color: '#8B8B8B' },
  { id: 1, name: '筑基期', subLevels: ['初期', '中期', '后期'], requiredQi: 500, statMultiplier: 2, color: '#4CAF50' },
  { id: 2, name: '金丹期', subLevels: ['初期', '中期', '后期'], requiredQi: 2000, statMultiplier: 5, color: '#2196F3' },
  { id: 3, name: '元婴期', subLevels: ['初期', '中期', '后期'], requiredQi: 8000, statMultiplier: 12, color: '#9C27B0' },
  { id: 4, name: '化神期', subLevels: ['初期', '中期', '后期'], requiredQi: 30000, statMultiplier: 30, color: '#FF9800' },
  { id: 5, name: '渡劫期', subLevels: ['初期', '中期', '后期'], requiredQi: 100000, statMultiplier: 80, color: '#F44336' },
  { id: 6, name: '大乘期', subLevels: ['初期', '中期', '后期'], requiredQi: 500000, statMultiplier: 200, color: '#E91E63' },
  { id: 7, name: '仙人', subLevels: ['散仙', '地仙', '天仙'], requiredQi: 999999999, statMultiplier: 1000, color: '#FFD700' },
]

export const MONSTERS: MonsterInfo[] = [
  { id: 0, name: '灵兔', hp: 30, attack: 5, defense: 2, rewardStones: 5, rewardExp: 10, minRealm: 0 },
  { id: 1, name: '毒蛇', hp: 60, attack: 10, defense: 5, rewardStones: 12, rewardExp: 25, minRealm: 0 },
  { id: 2, name: '妖狼', hp: 120, attack: 20, defense: 10, rewardStones: 30, rewardExp: 60, minRealm: 1 },
  { id: 3, name: '石魔', hp: 250, attack: 40, defense: 25, rewardStones: 70, rewardExp: 150, minRealm: 1 },
  { id: 4, name: '火鸦', hp: 500, attack: 80, defense: 40, rewardStones: 150, rewardExp: 350, minRealm: 2 },
  { id: 5, name: '冰蟒', hp: 1000, attack: 150, defense: 80, rewardStones: 350, rewardExp: 800, minRealm: 2 },
  { id: 6, name: '雷兽', hp: 2500, attack: 300, defense: 160, rewardStones: 800, rewardExp: 2000, minRealm: 3 },
  { id: 7, name: '幽灵', hp: 5000, attack: 600, defense: 300, rewardStones: 1800, rewardExp: 5000, minRealm: 3 },
  { id: 8, name: '玄龟', hp: 12000, attack: 1000, defense: 800, rewardStones: 4000, rewardExp: 12000, minRealm: 4 },
  { id: 9, name: '天魔', hp: 30000, attack: 2500, defense: 1500, rewardStones: 10000, rewardExp: 30000, minRealm: 5 },
]

export const BASE_STATS = {
  hp: 100,
  attack: 10,
  defense: 5,
  spiritualPower: 10,
  cultivationSpeed: 1,
}

export const CULTIVATION_TICK_MS = 1000
export const BATTLE_TICK_MS = 1500
