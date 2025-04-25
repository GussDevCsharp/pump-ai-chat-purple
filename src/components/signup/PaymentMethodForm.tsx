
import React from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface PaymentMethodFormProps {
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCvc: string;
  setCardCvc: (value: string) => void;
  isLoading: boolean;
  selectedPlanId: string | null;
}

export function PaymentMethodForm({
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  isLoading,
  selectedPlanId
}: PaymentMethodFormProps) {
  // Função para formatar o número do cartão ao digitar
  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formattedValue.slice(0, 19)); // Limitar a 16 dígitos + 3 espaços
  };

  // Função para formatar a data de validade do cartão
  const formatCardExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardExpiry(value);
  };

  // Função para formatar o CVC
  const formatCardCvc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardCvc(value.slice(0, 3));
  };

  // Se o plano selecionado for gratuito, mostrar uma mensagem em vez do formulário de pagamento
  if (selectedPlanId === 'free-plan') {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex flex-col items-center justify-center py-6">
          <h3 className="text-lg font-medium text-green-800 mb-2">Você selecionou o Plano Gratuito</h3>
          <p className="text-green-600 text-center">
            Não é necessário incluir informações de pagamento para o plano gratuito.
            Clique em "Finalizar Cadastro" para concluir seu registro.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Dados de Pagamento</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Número do Cartão *
          </label>
          <Input
            id="cardNumber"
            value={cardNumber}
            onChange={formatCardNumber}
            disabled={isLoading}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="font-mono"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
              Data de Validade *
            </label>
            <Input
              id="cardExpiry"
              value={cardExpiry}
              onChange={formatCardExpiry}
              disabled={isLoading}
              placeholder="MM/AA"
              maxLength={5}
              className="font-mono"
            />
          </div>
          <div>
            <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
              Código de Segurança (CVC) *
            </label>
            <Input
              id="cardCvc"
              value={cardCvc}
              onChange={formatCardCvc}
              disabled={isLoading}
              placeholder="000"
              maxLength={3}
              className="font-mono"
            />
          </div>
        </div>
        
        <div className="py-4 mt-4">
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              Seus dados de pagamento estão seguros. Utilizamos criptografia de ponta a ponta para proteger suas informações.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
