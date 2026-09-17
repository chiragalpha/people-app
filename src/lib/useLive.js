import { useEffect, useState } from 'react'

export function useLive(loader, deps = []) {
  const [state, setState] = useState({ loading: true, data: null, error: '' })

  useEffect(() => {
    let active = true
    setState((current) => ({ ...current, loading: true, error: '' }))
    Promise.resolve()
      .then(loader)
      .then((data) => {
        if (active) setState({ loading: false, data, error: '' })
      })
      .catch((error) => {
        if (active) setState({ loading: false, data: null, error: error.message })
      })
    return () => {
      active = false
    }
  }, deps)

  return state
}
