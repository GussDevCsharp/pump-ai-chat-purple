
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
  return (
    <div className="pt-2">
      <h3 className="font-semibold text-lg mb-2 text-gray-900">Dados de pagamento</h3>
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
          Número do cartão *
        </label>
        <Input
          id="cardNumber"
          type="text"
          required
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value)}
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
            onChange={e => setCardExpiry(e.target.value)}
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
            onChange={e => setCardCvc(e.target.value)}
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
