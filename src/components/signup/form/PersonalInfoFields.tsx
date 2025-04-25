
import React from "react";
import { FormField } from "./FormField";

interface PersonalInfoFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  cpf: string;
  handleCpfChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function PersonalInfoFields({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  cpf,
  handleCpfChange,
  isLoading
}: PersonalInfoFieldsProps) {
  return (
    <>
      <FormField
        id="firstName"
        label="Nome"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        disabled={isLoading}
        placeholder="Digite seu nome"
        className="max-w-[350px]"
        required
      />
      <FormField
        id="lastName"
        label="Sobrenome"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        disabled={isLoading}
        placeholder="Digite seu sobrenome"
        className="max-w-[350px]"
        required
      />
      <FormField
        id="cpf"
        label="CPF"
        value={cpf}
        onChange={handleCpfChange}
        disabled={isLoading}
        placeholder="000.000.000-00"
        maxLength={14}
        className="max-w-[200px] font-mono"
        required
      />
    </>
  );
}
