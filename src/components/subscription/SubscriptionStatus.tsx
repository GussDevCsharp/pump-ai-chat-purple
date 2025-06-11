
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, Settings, RefreshCw } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function SubscriptionStatus() {
  const { subscriptionData, isLoading, checkSubscription, openCustomerPortal } = useSubscription();

  useEffect(() => {
    checkSubscription();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-pump-purple" />
            <span className="ml-2">Verificando assinatura...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-pump-purple" />
          Status da Assinatura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Status:</span>
          <Badge variant={subscriptionData.subscribed ? "default" : "secondary"}>
            {subscriptionData.subscribed ? "Ativa" : "Inativa"}
          </Badge>
        </div>

        {subscriptionData.subscription_tier && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Plano:</span>
            <span className="text-pump-purple font-semibold">
              {subscriptionData.subscription_tier}
            </span>
          </div>
        )}

        {subscriptionData.subscription_end && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Próxima cobrança:</span>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(subscriptionData.subscription_end)}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={checkSubscription}
            disabled={isLoading}
            className="flex-1"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          {subscriptionData.subscribed && (
            <Button
              variant="outline"
              size="sm"
              onClick={openCustomerPortal}
              disabled={isLoading}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-1" />
              Gerenciar
            </Button>
          )}
        </div>

        {!subscriptionData.subscribed && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">
              Você está usando a versão gratuita. Assine um plano premium para ter acesso completo.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
