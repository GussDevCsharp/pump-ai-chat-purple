
import React from "react";
import { FormField } from "./FormField";

interface AuthFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  isLoading: boolean;
}

export function AuthFields({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading
}: AuthFieldsProps) {
  return (
    <>
      <FormField
        id="email"
        type="email"
        label="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        placeholder="seu@email.com"
        className="max-w-[400px]"
        required
      />
      <FormField
        id="password"
        type="password"
        label="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        placeholder="Digite sua senha"
        className="max-w-[350px]"
        required
      />
      <FormField
        id="confirmPassword"
        type="password"
        label="Confirme a Senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isLoading}
        placeholder="Confirme sua senha"
        className="max-w-[350px]"
        required
      />
    </>
  );
}
