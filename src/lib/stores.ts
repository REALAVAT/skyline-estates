"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Currency } from "./format";

type Listener = () => void;

function createPersistentStore<T>(key: string, fallback: T, validate: (value: unknown) => value is T) {
  let state: T = fallback;
  let hydrated = false;
  const listeners = new Set<Listener>();

  const hydrate = () => {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validate(parsed)) state = parsed;
      }
    } catch {
      state = fallback;
    }
  };

  const emit = () => listeners.forEach((l) => l());

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key !== key) return;
        hydrated = false;
        hydrate();
        emit();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot() {
      hydrate();
      return state;
    },
    getServerSnapshot() {
      return fallback;
    },
    set(next: T | ((prev: T) => T)) {
      hydrate();
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Storage can be unavailable (private mode); keep in-memory state.
      }
      emit();
    },
  };
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string");

const EMPTY: string[] = [];

const favoritesStore = createPersistentStore<string[]>("skyline:favorites", EMPTY, isStringArray);
const compareStore = createPersistentStore<string[]>("skyline:compare", EMPTY, isStringArray);
const currencyStore = createPersistentStore<Currency>(
  "skyline:currency",
  "AED",
  (v): v is Currency => v === "AED" || v === "USD",
);

export const COMPARE_LIMIT = 3;

export function useFavorites() {
  const ids = useSyncExternalStore(favoritesStore.subscribe, favoritesStore.getSnapshot, favoritesStore.getServerSnapshot);
  const toggle = useCallback((id: string) => {
    let added = false;
    favoritesStore.set((prev) => {
      added = !prev.includes(id);
      return added ? [...prev, id] : prev.filter((x) => x !== id);
    });
    return added;
  }, []);
  const clear = useCallback(() => favoritesStore.set([]), []);
  return { ids, has: (id: string) => ids.includes(id), toggle, clear };
}

export function useCompare() {
  const ids = useSyncExternalStore(compareStore.subscribe, compareStore.getSnapshot, compareStore.getServerSnapshot);
  const toggle = useCallback((id: string): "added" | "removed" | "limit" => {
    let result: "added" | "removed" | "limit" = "added";
    compareStore.set((prev) => {
      if (prev.includes(id)) {
        result = "removed";
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= COMPARE_LIMIT) {
        result = "limit";
        return prev;
      }
      return [...prev, id];
    });
    return result;
  }, []);
  const remove = useCallback((id: string) => compareStore.set((prev) => prev.filter((x) => x !== id)), []);
  const clear = useCallback(() => compareStore.set([]), []);
  return { ids, has: (id: string) => ids.includes(id), toggle, remove, clear };
}

export function useCurrency() {
  const currency = useSyncExternalStore(currencyStore.subscribe, currencyStore.getSnapshot, currencyStore.getServerSnapshot);
  const setCurrency = useCallback((c: Currency) => currencyStore.set(c), []);
  return { currency, setCurrency };
}
