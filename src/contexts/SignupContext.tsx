
import React, { createContext, useContext, useState } from 'react';

interface SignupContextType {
  // Client data
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  cpf: string;
  setCpf: (value: string) => void;

  // Plan data
  selectedPlanId: string | null;
  setSelectedPlanId: (id: string | null) => void;

  // Payment data
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCvc: string;
  setCardCvc: (value: string) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  // Client data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cpf, setCpf] = useState('');

  // Plan data
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Payment data
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    cpf,
    setCpf,
    selectedPlanId,
    setSelectedPlanId,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvc,
    setCardCvc,
    isLoading,
    setIsLoading,
  };

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
}
