import api from './client'
import type { StageKey, StageResponse } from '@/types'

export const getMyStages = () =>
  api.get<StageResponse[]>('/stages/my').then((r) => r.data)

export const saveStageContent = (stage: StageKey, content: Record<string, unknown>) =>
  api.put<StageResponse>(`/stages/${stage}`, { content }).then((r) => r.data)

export const submitStage = (stage: StageKey) =>
  api.post<StageResponse>(`/stages/${stage}/submit`).then((r) => r.data)
