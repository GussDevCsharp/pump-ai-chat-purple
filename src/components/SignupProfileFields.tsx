
import React from 'react';
import { Input } from './ui/input';

interface SignupProfileFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  cpf: string;
  setCpf: (value: string) => void;
  disabled?: boolean;
}

export function SignupProfileFields({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  cpf,
  setCpf,
  disabled = false
}: SignupProfileFieldsProps) {
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    setCpf(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          Nome *
        </label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={disabled}
          placeholder="Digite seu nome"
          required
        />
      </div>
      
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
          Sobrenome *
        </label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={disabled}
          placeholder="Digite seu sobrenome"
          required
        />
      </div>
      
      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
          CPF *
        </label>
        <Input
          id="cpf"
          value={cpf}
          onChange={handleCpfChange}
          disabled={disabled}
          placeholder="000.000.000-00"
          maxLength={14}
          required
        />
      </div>
    </div>
  );
}
