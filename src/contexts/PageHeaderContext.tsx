'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PageHeaderAction {
  label: string;
  icon?: React.ElementType;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

interface PageHeaderContextType {
  actions: PageHeaderAction[];
  setActions: (actions: PageHeaderAction[]) => void;
  infoTooltip?: string;
  setInfoTooltip: (tooltip?: string) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<PageHeaderAction[]>([]);
  const [infoTooltip, setInfoTooltip] = useState<string | undefined>();

  return (
    <PageHeaderContext.Provider value={{ actions, setActions, infoTooltip, setInfoTooltip }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used within a PageHeaderProvider');
  }
  return context;
}

// Hook pour définir les actions du header depuis une page
export function useSetPageActions(actions: PageHeaderAction[], infoTooltip?: string) {
  const { setActions, setInfoTooltip } = usePageHeader();

  useEffect(() => {
    setActions(actions);
    if (infoTooltip) {
      setInfoTooltip(infoTooltip);
    }
    // Nettoyage au démontage
    return () => {
      setActions([]);
      setInfoTooltip(undefined);
    };
  }, [actions, infoTooltip, setActions, setInfoTooltip]);
}
