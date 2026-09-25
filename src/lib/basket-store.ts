"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProductItem } from "./catalogue-data";

export interface BasketItem {
  id: string;
  name: string;
  modelNumber: string;
  quantity: number;
}

const STORAGE_KEY = "mifaretech_enquiry_basket";

export function useEnquiryBasket() {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Fallback gracefully on storage error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveItems = useCallback((newItems: BasketItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  }, []);

  const addItem = useCallback(
    (product: Pick<ProductItem, "id" | "name" | "modelNumber">, quantity = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === product.id);
        let updated: BasketItem[];
        if (existingIndex > -1) {
          updated = [...prev];
          const curr = updated[existingIndex];
          if (curr) {
            updated[existingIndex] = {
              ...curr,
              quantity: Math.min(1000, curr.quantity + quantity),
            };
          }
        } else {
          updated = [
            ...prev,
            {
              id: product.id,
              name: product.name,
              modelNumber: product.modelNumber,
              quantity,
            },
          ];
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, quantity: Math.min(1000, quantity) } : item,
        );
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [removeItem],
  );

  const clearBasket = useCallback(() => {
    saveItems([]);
  }, [saveItems]);

  return {
    items,
    isLoaded,
    itemCount: items.reduce((acc, curr) => acc + curr.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    clearBasket,
  };
}
