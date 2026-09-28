"use client";

import { useEffect, useState } from "react";

export interface ComparableProduct {
  id: string;
  name: string;
  slug: string;
  modelNumber?: string | null;
  shortDescription?: string | null;
  category?: { name: string; slug: string } | null;
  cover?: { secureUrl: string } | null;
  highlights?: string[];
  specs?: Array<{ groupName?: string | null; label: string; value: string }>;
}

const STORAGE_KEY = "mifaretech_compare_items";
const MAX_COMPARE_ITEMS = 4;

// Simple event-driven global state for instant reactivity across components
let globalItems: ComparableProduct[] = [];
let globalModalOpen = false;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function useCompareStore() {
  const [items, setItems] = useState<ComparableProduct[]>(globalItems);
  const [isModalOpen, setIsModalOpen] = useState(globalModalOpen);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Initial load from localStorage on client
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        globalItems = JSON.parse(stored);
        setItems(globalItems);
      }
    } catch {
      // Ignore storage errors
    }
    setIsHydrated(true);

    const update = () => {
      setItems([...globalItems]);
      setIsModalOpen(globalModalOpen);
    };

    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  const saveToStorage = (newItems: ComparableProduct[]) => {
    globalItems = newItems;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // Ignore
    }
    notify();
  };

  const addToCompare = (product: ComparableProduct): boolean => {
    if (globalItems.some((item) => item.id === product.id)) {
      return true;
    }
    if (globalItems.length >= MAX_COMPARE_ITEMS) {
      return false;
    }
    saveToStorage([...globalItems, product]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    saveToStorage(globalItems.filter((item) => item.id !== productId));
  };

  const toggleCompare = (product: ComparableProduct): boolean => {
    if (globalItems.some((item) => item.id === product.id)) {
      removeFromCompare(product.id);
      return false;
    } else {
      return addToCompare(product);
    }
  };

  const clearCompare = () => {
    saveToStorage([]);
    globalModalOpen = false;
    notify();
  };

  const openCompareModal = () => {
    globalModalOpen = true;
    notify();
  };

  const closeCompareModal = () => {
    globalModalOpen = false;
    notify();
  };

  const isInCompare = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  return {
    items,
    itemCount: items.length,
    isModalOpen,
    isHydrated,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    openCompareModal,
    closeCompareModal,
    isInCompare,
    maxItems: MAX_COMPARE_ITEMS,
  };
}
