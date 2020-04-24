import {useCallback, useEffect, useState} from 'react'

export interface IState {
  types: boolean,
  devDependency: boolean,
  clients: Array<{
    name: string,
    installCommand: string,
    devCommand: string,
  }>,
  client: string,
}

const getInitialState = (): IState => ({
  types: true,
  devDependency: false,
  clients: [
    {
      name: 'npm',
      installCommand: 'i',
      devCommand: '-D',
    },
    {
      name: 'yarn',
      installCommand: 'add',
      devCommand: '-D',
    },
    {
      name: 'pnpm',
      installCommand: 'add',
      devCommand: '-D',
    },
    {
      name: 'cnpm',
      installCommand: 'i',
      devCommand: '-D',
    },
    {
      name: 'tyarn',
      installCommand: 'add',
      devCommand: '-D',
    },
    {
      name: 'cpnpm',
      installCommand: 'add',
      devCommand: '-D',
    },
  ],
  client: 'npm',
})

const STORE_KEY = '__NPM_PLUS_STORE__'

export async function getStore(): Promise<IState> {
  return new Promise(resolve => {
    chrome.storage.sync.get(STORE_KEY, data => {
      resolve(data[STORE_KEY] || getInitialState())
    })
  })
}

export async function setStore(state: IState): Promise<IState> {
  return new Promise(resolve => {
    chrome.storage.sync.set({[STORE_KEY]: state}, () => {
      resolve(state)
    })
  })
}

export function useStore(): [
  IState,
  (partialState: Partial<IState>) => any,
] {
  const [state, updateState] = useState<IState>(getInitialState)
  useEffect(() => {
    getStore().then(state => updateState(oldState => ({
      ...oldState,
      ...state,
    })))
  }, [])
  const setState = useCallback(async (partialState: Partial<IState>) => {
    const newState = {
      ...state,
      ...partialState,
    }
    await setStore(newState)
    updateState(newState)
  }, [state])
  return [state, setState]
}
