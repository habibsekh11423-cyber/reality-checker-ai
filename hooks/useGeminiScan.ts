import type { ScanResult, ScanType, Signal, Verdict } from "@/context/ScanContext";
import { useState } from "react";

const API_BASE = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

interface GeminiResponse {
  verdict: Verdict;
  confidence: number;
  summary: string;
  signals: Signal[];
}

export function useGeminiScan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = async (
    type: ScanType,
    input: string
  ): Promise<Omit<ScanResult, "id" | "scannedAt"> | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, input }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Server error ${res.status}`);
      }

      const data = (await res.json()) as GeminiResponse;

      return {
        type,
        input,
        verdict: data.verdict,
        confidence: data.confidence,
        signals: data.signals,
        summary: data.summary,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { scan, loading, error };
}
