import React from "react";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/contexts/SignupContext";

export function ClientDataForm() {
  const {
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
    isLoading
  } = useSignup();

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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-8">Dados Pessoais</h3>
        <div className="space-y-6 max-w-[400px]">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              placeholder="Digite seu nome"
              className="max-w-[350px]"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Sobrenome *
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              placeholder="Digite seu sobrenome"
              className="max-w-[350px]"
              required
            />
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
              CPF *
            </label>
            <Input
              id="cpf"
              value={cpf}
              onChange={handleCpfChange}
              disabled={isLoading}
              placeholder="000.000.000-00"
              maxLength={14}
              className="max-w-[200px] font-mono"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail *
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="seu@email.com"
              className="max-w-[400px]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha *
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Digite sua senha"
              className="max-w-[350px]"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirme a Senha *
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Confirme sua senha"
              className="max-w-[350px]"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
