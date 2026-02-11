import React, { createContext, useContext, useEffect, useState } from "react";
import {
  applyPalette,
  getStoredPaletteId,
  setStoredPaletteId,
} from "@/lib/theme-palettes";

interface PaletteContextType {
  paletteId: string;
  setPaletteId: (id: string) => void;
}

const PaletteContext = createContext<PaletteContextType>({
  paletteId: "amber",
  setPaletteId: () => {},
});

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [paletteId, setPaletteIdState] = useState<string>(() =>
    getStoredPaletteId(),
  );

  const setPaletteId = (id: string) => {
    setPaletteIdState(id);
    setStoredPaletteId(id);
    applyPalette(id);
  };

  useEffect(() => {
    applyPalette(paletteId);
  }, []);

  return (
    <PaletteContext.Provider value={{ paletteId, setPaletteId }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  return useContext(PaletteContext);
}
