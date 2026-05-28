export type Role = 'ADMIN' | 'PARTICIPANT'
export type StageKey = 'D' | 'M_A' | 'I' | 'C'
export type StageStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
export type RewardKey = 'JAPAN_TRIP' | 'LEADERSHIP_AWARD' | 'BRANDED_MERCH' | 'PROJECT_BADGE'

export interface UserProfile {
  id: number
  username: string
  fullName: string
  position: string | null
  avatarUrl: string | null
  role: Role
}

export interface StageResponse {
  id: number
  stage: StageKey
  content: Record<string, unknown>
  status: StageStatus
  adminScore: number | null
  adminComment: string | null
  deadline: string | null
  submittedAt: string | null
  reviewedAt: string | null
  barrels: number
}

export interface LeaderboardEntry {
  userId: number
  fullName: string
  avatarUrl: string | null
  position: string | null
  totalBarrels: number
  reward: RewardKey
}
