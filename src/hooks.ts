import { useEffect, useState } from "react"

/**
 * `useState` that mirrors its value into localStorage under `semmigo:<key>`,
 * so the app's data survives a refresh instead of resetting to demo content.
 *
 * Reads the stored value lazily on first render and falls back to `initial`
 * when nothing is stored or the stored JSON does not parse (e.g. an app update
 * changed the shape). Every storage access is wrapped in try/catch — private
 * browsing quotas or a full storage must never crash the app for a
 * convenience feature; persistence degrades to in-memory state instead.
 */
export function usePersistedState<T>(key: string, initial: T) {
  const storageKey = `semmigo:${key}`
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // Storage unavailable — keep going with in-memory state only.
    }
  }, [storageKey, value])

  return [value, setValue] as const
}
