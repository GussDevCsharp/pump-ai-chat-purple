
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ClientDataFormProps {
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
  companyName: string;
  setCompanyName: (value: string) => void;
  mainProducts: string;
  setMainProducts: (value: string) => void;
  employeesCount: string;
  setEmployeesCount: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  isLoading: boolean;
}

export function ClientDataForm({
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
  companyName,
  setCompanyName,
  mainProducts,
  setMainProducts,
  employeesCount,
  setEmployeesCount,
  address,
  setAddress,
  isLoading
}: ClientDataFormProps) {
  // Função para formatar CPF ao digitar
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
        <h3 className="text-lg font-medium mb-4">Dados Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
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
              disabled={isLoading}
              placeholder="Digite seu sobrenome"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="seu@email.com"
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
              disabled={isLoading}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha *
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Digite sua senha"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirme a Senha *
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Confirme sua senha"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Dados da Empresa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa *
            </label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isLoading}
              placeholder="Nome da sua empresa"
              required
            />
          </div>
          <div>
            <label htmlFor="employeesCount" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Funcionários
            </label>
            <Input
              id="employeesCount"
              type="number"
              value={employeesCount}
              onChange={(e) => setEmployeesCount(e.target.value)}
              disabled={isLoading}
              placeholder="Ex: 10"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="mainProducts" className="block text-sm font-medium text-gray-700 mb-1">
              Principais Produtos/Serviços
            </label>
            <Textarea
              id="mainProducts"
              value={mainProducts}
              onChange={(e) => setMainProducts(e.target.value)}
              disabled={isLoading}
              placeholder="Descreva os principais produtos ou serviços da sua empresa"
              className="min-h-[80px]"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
              placeholder="Endereço da empresa"
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
