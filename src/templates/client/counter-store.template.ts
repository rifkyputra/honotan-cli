export function generateCounterStore(): string {
  return `import { Store } from '@tanstack/react-store'

export const counterStore = new Store(0)

export function increment() {
  counterStore.setState((state) => state + 1)
}

export function decrement() {
  counterStore.setState((state) => state - 1)
}

export function reset() {
  counterStore.setState(0)
}
`
}
