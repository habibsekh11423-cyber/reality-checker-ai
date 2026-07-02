import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ScanType = "text" | "image" | "url";
export type Verdict = "authentic" | "suspicious" | "likely-fake";

export interface Signal {
  label: string;
  score: number;
  description: string;
  flagged: boolean;
}

export interface ScanResult {
  id: string;
  type: ScanType;
  input: string;
  verdict: Verdict;
  confidence: number;
  signals: Signal[];
  summary: string;
  scannedAt: number;
  thumbnail?: string;
}

interface ScanContextValue {
  history: ScanResult[];
  currentResult: ScanResult | null;
  setCurrentResult: (r: ScanResult | null) => void;
  addScan: (r: ScanResult) => void;
  clearHistory: () => void;
}

const ScanContext = createContext<ScanContextValue | null>(null);
const STORAGE_KEY = "rc_history";

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setHistory(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  const addScan = useCallback((r: ScanResult) => {
    setHistory((prev) => {
      const next = [r, ...prev].slice(0, 50);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ScanContext.Provider
      value={{ history, currentResult, setCurrentResult, addScan, clearHistory }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScan must be inside ScanProvider");
  return ctx;
}
