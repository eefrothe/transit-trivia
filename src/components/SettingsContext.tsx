import React, { createContext, useContext, useState } from "react";

interface SettingsContextProps {
  tickingEnabled: boolean;
  confettiEnabled: boolean;
  toggleTicking: () => void;
  toggleConfetti: () => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickingEnabled, setTickingEnabled] = useState(true);
  const [confettiEnabled, setConfettiEnabled] = useState(true);

  const toggleTicking = () => setTickingEnabled((prev) => !prev);
  const toggleConfetti = () => setConfettiEnabled((prev) => !prev);

  return (
    <SettingsContext.Provider value={{ tickingEnabled, confettiEnabled, toggleTicking, toggleConfetti }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
