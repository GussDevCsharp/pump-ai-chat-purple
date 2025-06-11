
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkSubscription } = useSubscription();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Check subscription status after successful payment
    const verifyPayment = async () => {
      if (sessionId) {
        console.log("Payment successful, checking subscription status...");
        // Wait a bit for Stripe to process
        setTimeout(async () => {
          await checkSubscription();
          toast.success("Pagamento realizado com sucesso! Sua assinatura está ativa.");
        }, 2000);
      }
    };

    verifyPayment();
  }, [sessionId, checkSubscription]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagamento Realizado!
          </h1>
          <p className="text-gray-600">
            Sua assinatura foi ativada com sucesso. Agora você tem acesso completo à plataforma ChatPump.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-pump-purple hover:bg-pump-purple/90 text-white"
          >
            Ir para a Plataforma
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate("/themes")}
            className="w-full border-pump-purple text-pump-purple hover:bg-pump-purple/10"
          >
            Explorar Temas
          </Button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Próximos passos:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Complete seu perfil empresarial</li>
            <li>• Explore os temas especializados</li>
            <li>• Inicie conversas com nossa IA</li>
            <li>• Gerencie sua assinatura no perfil</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
