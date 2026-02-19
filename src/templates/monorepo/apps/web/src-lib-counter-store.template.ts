import type { MonorepoTemplateData } from '../../../../types';

export function generateLibCounterStoreTs(_data: MonorepoTemplateData): string {
  return `import { Store } from "@tanstack/react-store";
import { useStore } from "@tanstack/react-store";

export const counterStore = new Store({ count: 0 });

export const increment = () =>
  counterStore.setState((s) => ({ count: s.count + 1 }));

export const decrement = () =>
  counterStore.setState((s) => ({ count: s.count - 1 }));

export const reset = () => counterStore.setState(() => ({ count: 0 }));

export function useCounter() {
  return useStore(counterStore, (s) => s.count);
}
`;
}
