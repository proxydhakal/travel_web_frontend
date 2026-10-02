import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useToast } from "./ToastContext";

const KEY = "totw-wishlist";

const WishlistContext = createContext<{
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string, title?: string) => void;
} | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { push } = useToast();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(stored)) setIds(stored.filter((item) => typeof item === "string"));
    } catch {
      setIds([]);
    }
  }, []);

  const toggle = (id: string, title?: string) => {
    setIds((current) => {
      const exists = current.includes(id);
      const next = exists ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      push(exists ? `Removed ${title ?? "trip"} from your list` : `Saved ${title ?? "trip"} to your list`);
      return next;
    });
  };

  const value = useMemo(() => ({ ids, has: (id: string) => ids.includes(id), toggle }), [ids]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
