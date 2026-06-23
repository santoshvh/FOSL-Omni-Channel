"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@fosl/contracts";
import { products, getMarketplaceCartProducts } from "@fosl/mocks";

export type CartMode = "storefront" | "marketplace";

export type CartEntry = { productId: string; quantity: number };

export type CartLine = CartEntry & { product: Product };

type StoredCart = { entries: CartEntry[]; saved: CartEntry[] };

type CartContextValue = {
  mode: CartMode;
  lines: CartLine[];
  savedLines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  isOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSaved: (productId: string) => void;
  setSavedQuantity: (productId: string, quantity: number) => void;
  maxQuantity: (product: Product) => number;
  cartHref: string;
  checkoutHref: string;
};

const CartContext = createContext<CartContextValue | null>(null);

function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

function defaultEntries(mode: CartMode): CartEntry[] {
  if (mode === "marketplace") {
    return getMarketplaceCartProducts().map((p) => ({ productId: p.id, quantity: 1 }));
  }
  return [products[0], products[3]]
    .filter(Boolean)
    .map((p) => ({ productId: p!.id, quantity: 1 }));
}

function storageKey(mode: CartMode) {
  return `fosl-cart-v1-${mode}`;
}

function resolveLines(entries: CartEntry[]): CartLine[] {
  return entries
    .map((entry) => {
      const product = getProductById(entry.productId);
      if (!product) return null;
      return { ...entry, product };
    })
    .filter((l): l is CartLine => l !== null);
}

export function maxQuantityForProduct(product: Product): number {
  if (product.type === "lead_gen") return 1;
  return Math.max(1, product.inventory);
}

function clampQuantity(product: Product, qty: number): number {
  if (qty <= 0) return 0;
  return Math.min(qty, maxQuantityForProduct(product));
}

function mergeEntry(
  entries: CartEntry[],
  productId: string,
  addQty: number,
  product: Product
): CartEntry[] {
  const idx = entries.findIndex((e) => e.productId === productId);
  if (idx >= 0) {
    const next = [...entries];
    next[idx] = {
      productId,
      quantity: clampQuantity(product, next[idx].quantity + addQty),
    };
    return next;
  }
  return [...entries, { productId, quantity: clampQuantity(product, addQty) }];
}

function pullEntry(entries: CartEntry[], productId: string): {
  remaining: CartEntry[];
  pulled?: CartEntry;
} {
  const idx = entries.findIndex((e) => e.productId === productId);
  if (idx < 0) return { remaining: entries };
  const pulled = entries[idx];
  return { remaining: entries.filter((_, i) => i !== idx), pulled };
}

export function CartProvider({
  mode,
  children,
}: {
  mode: CartMode;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<CartEntry[]>(() => defaultEntries(mode));
  const [saved, setSaved] = useState<CartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(mode));
      if (raw) {
        const parsed = JSON.parse(raw) as StoredCart;
        if (Array.isArray(parsed.entries)) setEntries(parsed.entries);
        if (Array.isArray(parsed.saved)) setSaved(parsed.saved);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, [mode]);

  useEffect(() => {
    if (!hydrated) return;
    const payload: StoredCart = { entries, saved };
    localStorage.setItem(storageKey(mode), JSON.stringify(payload));
  }, [entries, saved, hydrated, mode]);

  const maxQuantity = useCallback((product: Product) => maxQuantityForProduct(product), []);

  const addItem = useCallback((productId: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    setEntries((prev) => mergeEntry(prev, productId, quantity, product));
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const product = getProductById(productId);
    if (!product) return;
    const qty = clampQuantity(product, quantity);
    setEntries((prev) => {
      if (qty <= 0) return prev.filter((e) => e.productId !== productId);
      const idx = prev.findIndex((e) => e.productId === productId);
      if (idx < 0) return prev;
      const next = [...prev];
      next[idx] = { productId, quantity: qty };
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setEntries((prev) => prev.filter((e) => e.productId !== productId));
  }, []);

  const saveForLater = useCallback((productId: string) => {
    const product = getProductById(productId);
    if (!product) return;
    setEntries((prev) => {
      const { remaining, pulled } = pullEntry(prev, productId);
      if (!pulled) return prev;
      setSaved((savedPrev) => mergeEntry(savedPrev, productId, pulled.quantity, product));
      return remaining;
    });
  }, []);

  const moveToCart = useCallback((productId: string) => {
    const product = getProductById(productId);
    if (!product) return;
    setSaved((prev) => {
      const { remaining, pulled } = pullEntry(prev, productId);
      if (!pulled) return prev;
      setEntries((cartPrev) => mergeEntry(cartPrev, productId, pulled.quantity, product));
      return remaining;
    });
  }, []);

  const removeSaved = useCallback((productId: string) => {
    setSaved((prev) => prev.filter((e) => e.productId !== productId));
  }, []);

  const setSavedQuantity = useCallback((productId: string, quantity: number) => {
    const product = getProductById(productId);
    if (!product) return;
    const qty = clampQuantity(product, quantity);
    setSaved((prev) => {
      if (qty <= 0) return prev.filter((e) => e.productId !== productId);
      const idx = prev.findIndex((e) => e.productId === productId);
      if (idx < 0) return prev;
      const next = [...prev];
      next[idx] = { productId, quantity: qty };
      return next;
    });
  }, []);

  const lines = useMemo(() => resolveLines(entries), [entries]);
  const savedLines = useMemo(() => resolveLines(saved), [saved]);
  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );
  const subtotalCents = useMemo(
    () => lines.reduce((sum, line) => sum + line.product.priceCents * line.quantity, 0),
    [lines]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const value: CartContextValue = {
    mode,
    lines,
    savedLines,
    itemCount,
    subtotalCents,
    isOpen,
    isHydrated: hydrated,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    setQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeSaved,
    setSavedQuantity,
    maxQuantity,
    cartHref: mode === "marketplace" ? "/marketplace/cart" : "/cart",
    checkoutHref: mode === "marketplace" ? "/marketplace/checkout" : "/checkout",
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
