
import React from "react";
import { Input } from "@/components/ui/input";

interface SignupPaymentFieldsProps {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  disabled: boolean;
  setCardNumber: (val: string) => void;
  setCardExpiry: (val: string) => void;
  setCardCvc: (val: string) => void;
}

export function SignupPaymentFields({
  cardNumber,
  cardExpiry,
  cardCvc,
  disabled,
  setCardNumber,
  setCardExpiry,
  setCardCvc,
}: SignupPaymentFieldsProps) {
  
  const formatCardNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    // Adiciona espaços a cada 4 dígitos
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    // Remove tudo que não é número
    const v = value.replace(/\D/g, '');
    
    // Adiciona a barra após os dois primeiros dígitos
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setCardExpiry(formatted);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardCvc(value);
  };

  return (
    <div className="pt-2">
      <h3 className="font-semibold text-lg mb-2 text-gray-900">Dados de pagamento</h3>
      <p className="text-sm text-gray-600 mb-4">
        Necessário para validar o trial. Você só será cobrado após 14 dias.
      </p>
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
          Número do cartão *
        </label>
        <Input
          id="cardNumber"
          type="text"
          required
          value={cardNumber}
          onChange={handleCardNumberChange}
          className="mt-1"
          disabled={disabled}
          maxLength={19}
          placeholder="0000 0000 0000 0000"
          inputMode="numeric"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
            Validade *
          </label>
          <Input
            id="cardExpiry"
            type="text"
            required
            value={cardExpiry}
            onChange={handleExpiryChange}
            disabled={disabled}
            maxLength={5}
            placeholder="MM/AA"
            inputMode="numeric"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700">
            CVC *
          </label>
          <Input
            id="cardCvc"
            type="text"
            required
            value={cardCvc}
            onChange={handleCvcChange}
            disabled={disabled}
            maxLength={4}
            placeholder="000"
            inputMode="numeric"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
