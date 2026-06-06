import React, { createContext, useContext } from 'react';
import { useCursorTrajectory } from '../hooks/useCursorTrajectory';

interface CursorTrajectoryContextType {
  registerTarget: (
    id: string,
    element: HTMLElement,
    callback: (isImpending: boolean, pullX: number, pullY: number) => void
  ) => () => void;
}

const CursorTrajectoryContext = createContext<CursorTrajectoryContextType | null>(null);

export const CursorTrajectoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { registerTarget } = useCursorTrajectory();

  return (
    <CursorTrajectoryContext.Provider value={{ registerTarget }}>
      {children}
    </CursorTrajectoryContext.Provider>
  );
};

export const useCursorTrajectoryContext = () => {
  const context = useContext(CursorTrajectoryContext);
  if (!context) {
    throw new Error('useCursorTrajectoryContext must be used within a CursorTrajectoryProvider');
  }
  return context;
};
