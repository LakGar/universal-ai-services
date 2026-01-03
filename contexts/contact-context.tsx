"use client";

import * as React from "react";

interface ContactContextType {
  isOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
}

const ContactContext = React.createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const openContact = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeContact = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = React.useMemo(
    () => ({
      isOpen,
      openContact,
      closeContact,
    }),
    [isOpen, openContact, closeContact]
  );

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
}

export function useContact() {
  const context = React.useContext(ContactContext);
  if (context === undefined) {
    throw new Error("useContact must be used within a ContactProvider");
  }
  return context;
}

