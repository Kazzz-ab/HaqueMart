"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import type { Cart, CartItem } from "@/types";

// ── Reducer ───────────────────────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "UPDATE_QTY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR" };

function computeTotals(cart: Cart): Cart {
  const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);
  const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  return { ...cart, itemCount, total };
}

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      const items = existing
        ? state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i,
          )
        : [...state.items, action.payload];
      return computeTotals({ ...state, items });
    }
    case "REMOVE_ITEM":
      return computeTotals({
        ...state,
        items: state.items.filter((i) => i.productId !== action.payload.productId),
      });
    case "UPDATE_QTY": {
      const items =
        action.payload.quantity <= 0
          ? state.items.filter((i) => i.productId !== action.payload.productId)
          : state.items.map((i) =>
              i.productId === action.payload.productId
                ? { ...i, quantity: action.payload.quantity }
                : i,
            );
      return computeTotals({ ...state, items });
    }
    case "CLEAR":
      return { items: [], total: 0, itemCount: 0 };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = "haquemart_cart";
const EMPTY_CART: Cart = { items: [], total: 0, itemCount: 0 };

interface CartContextValue {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, EMPTY_CART, () => {
    if (typeof window === "undefined") return EMPTY_CART;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Cart) : EMPTY_CART;
    } catch {
      return EMPTY_CART;
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
        removeItem: (productId) =>
          dispatch({ type: "REMOVE_ITEM", payload: { productId } }),
        updateQuantity: (productId, quantity) =>
          dispatch({ type: "UPDATE_QTY", payload: { productId, quantity } }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
