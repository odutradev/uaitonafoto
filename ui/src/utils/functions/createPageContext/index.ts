import { createContext, createElement, useContext } from 'react'

import type { PageContext, PageProviderProps } from './types'

export const createPageContext = <Value>(usePageState: () => Value, hookName: string): PageContext<Value> => {
  const Context = createContext<Value | null>(null)

  const PageProvider = ({ children }: PageProviderProps) =>
    createElement(Context.Provider, { value: usePageState() }, children)

  const usePage = (): Value => {
    const value = useContext(Context)
    if (value === null) throw new Error(`${hookName} must be used inside its page provider`)
    return value
  }

  return { PageProvider, usePage }
}

export default createPageContext
