import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  hasIosInstallSeen,
  IOS_INSTALL_DELAY_MS,
  markIosInstallSeen,
  readIosInstallEligible,
} from '@/lib/pwa/iosInstall';
import { IosInstallSheet } from '@/components/pwa/IosInstallSheet';

type IosInstallContextValue = {
  eligible: boolean;
  open: () => void;
};

const IosInstallContext = createContext<IosInstallContextValue>({
  eligible: false,
  open: () => {},
});

export function useIosInstall() {
  return useContext(IosInstallContext);
}

export function IosInstallProvider({ children }: { children: React.ReactNode }) {
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setEligible(readIosInstallEligible());
  }, []);

  const open = useCallback(() => {
    markIosInstallSeen();
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!eligible) return;
    if (hasIosInstallSeen()) return;
    const timer = setTimeout(() => {
      if (hasIosInstallSeen()) return;
      markIosInstallSeen();
      setVisible(true);
    }, IOS_INSTALL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [eligible]);

  const value = useMemo(() => ({ eligible, open }), [eligible, open]);

  return (
    <IosInstallContext.Provider value={value}>
      {children}
      <IosInstallSheet visible={visible} onClose={close} />
    </IosInstallContext.Provider>
  );
}
