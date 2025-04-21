
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignupCompanyProfileStepProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  mainProducts: string;
  setMainProducts: (val: string) => void;
  employeesCount: string;
  setEmployeesCount: (val: string) => void;
  averageRevenue: string;
  setAverageRevenue: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  isLoading: boolean;
  onPrev: () => void;
  onFinish: () => void;
}

export function SignupCompanyProfileStep(props: SignupCompanyProfileStepProps) {
  return (
    <form
      className="space-y-5 bg-white rounded shadow px-6 py-8"
      onSubmit={e => {
        e.preventDefault();
        props.onFinish();
      }}
    >
      <h3 className="font-semibold text-lg mb-4 text-gray-900 text-center">Perfil da empresa</h3>
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
          Nome da empresa *
        </label>
        <Input
          id="companyName"
          name="companyName"
          required
          value={props.companyName}
          onChange={e => props.setCompanyName(e.target.value)}
          className="mt-1"
          disabled={props.isLoading}
        />
      </div>
      <div>
        <label htmlFor="mainProducts" className="block text-sm font-medium text-gray-700">
          Principais produtos/serviços *
        </label>
        <Input
          id="mainProducts"
          name="mainProducts"
          required
          value={props.mainProducts}
          onChange={e => props.setMainProducts(e.target.value)}
          className="mt-1"
          disabled={props.isLoading}
        />
      </div>
      <div>
        <label htmlFor="employeesCount" className="block text-sm font-medium text-gray-700">
          Quantidade de funcionários *
        </label>
        <Input
          id="employeesCount"
          name="employeesCount"
          required
          value={props.employeesCount}
          onChange={e => props.setEmployeesCount(e.target.value)}
          className="mt-1"
          disabled={props.isLoading}
        />
      </div>
      <div>
        <label htmlFor="averageRevenue" className="block text-sm font-medium text-gray-700">
          Faturamento médio mensal (R$) *
        </label>
        <Input
          id="averageRevenue"
          name="averageRevenue"
          type="number"
          required
          value={props.averageRevenue}
          onChange={e => props.setAverageRevenue(e.target.value)}
          className="mt-1"
          disabled={props.isLoading}
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Endereço da empresa
        </label>
        <Input
          id="address"
          name="address"
          value={props.address}
          onChange={e => props.setAddress(e.target.value)}
          className="mt-1"
          disabled={props.isLoading}
        />
      </div>
      <div className="flex gap-2 mt-6">
        <Button
          variant="outline"
          className="flex-1 text-pump-purple"
          onClick={props.onPrev}
          type="button"
          disabled={props.isLoading}
        >
          Voltar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-pump-purple text-white"
          disabled={
            !props.companyName ||
            !props.mainProducts ||
            !props.employeesCount ||
            !props.averageRevenue ||
            props.isLoading
          }
        >
          Finalizar cadastro
        </Button>
      </div>
    </form>
  );
}
