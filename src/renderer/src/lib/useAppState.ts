import { useCallback, useEffect, useState } from 'react'
import type { AppState } from '../../../shared/types'

export function useAppState(): { state: AppState | null; refresh: () => void } {
  const [state, setState] = useState<AppState | null>(null)

  const refresh = useCallback(() => {
    window.api.getState().then(setState)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { state, refresh }
}
