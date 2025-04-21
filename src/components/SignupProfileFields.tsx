
import React from "react";
import { Input } from "@/components/ui/input";

interface SignupProfileFieldsProps {
  firstName: string;
  lastName: string;
  cpf: string;
  disabled: boolean;
  setFirstName: (val: string) => void;
  setLastName: (val: string) => void;
  setCpf: (val: string) => void;
}

export function SignupProfileFields({
  firstName,
  lastName,
  cpf,
  disabled,
  setFirstName,
  setLastName,
  setCpf,
}: SignupProfileFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          Nome *
        </label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="mt-1"
          disabled={disabled}
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Sobrenome *
        </label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="mt-1"
          disabled={disabled}
        />
      </div>
      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
          CPF *
        </label>
        <Input
          id="cpf"
          name="cpf"
          type="text"
          required
          value={cpf}
          onChange={e => setCpf(e.target.value)}
          className="mt-1"
          disabled={disabled}
          maxLength={14}
          placeholder="000.000.000-00"
        />
      </div>
    </>
  );
}
