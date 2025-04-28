
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { PageFooter } from '@/components/common/PageFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Clipboard, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptLog {
  id: string;
  user_email: string;
  system_prompt: string;
  user_message: string;
  full_payload: any;
  created_at: string;
}

export default function PromptLogs() {
  const [email, setEmail] = useState('');
  const [logs, setLogs] = useState<PromptLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchLogs = async () => {
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um email para buscar os logs.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://spyfzrgwbavmntiginap.supabase.co/functions/v1/chat/getLogs", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweWZ6cmd3YmF2bW50aWdpbmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzcwNjEsImV4cCI6MjA2MDQxMzA2MX0.nBc8x2mLTm4j9KpxSzsgCp0xHgaJnWvN2t7I3H37n70`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar logs');
      }

      const data = await response.json();
      setLogs(data.logs || []);
      
      if (data.logs?.length === 0) {
        toast({
          title: "Nenhum log encontrado",
          description: `Não foram encontrados logs para o email ${email}`,
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "Erro ao buscar logs",
        description: "Ocorreu um erro ao buscar os logs. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Texto copiado para a área de transferência",
    });
  };

  const downloadLog = (log: PromptLog) => {
    const filename = `prompt-log-${log.user_email}-${new Date(log.created_at).toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    const logContent = 
`Email: ${log.user_email}
Data: ${new Date(log.created_at).toLocaleString()}

SISTEMA:
${log.system_prompt}

MENSAGEM DO USUÁRIO:
${log.user_message}

PAYLOAD COMPLETO:
${JSON.stringify(log.full_payload, null, 2)}`;

    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Logs de Prompts</h1>
        
        <div className="flex gap-2 mb-8">
          <Input
            placeholder="Email do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-md"
          />
          <Button 
            onClick={fetchLogs} 
            disabled={isLoading}
            className="bg-pump-purple hover:bg-pump-purple/90 text-white"
          >
            {isLoading ? 'Buscando...' : 'Buscar Logs'}
          </Button>
        </div>
        
        {logs.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Logs encontrados: {logs.length}</h2>
            
            {logs.map((log, index) => (
              <Card key={log.id || index} className="p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => copyToClipboard(
                        `SISTEMA:\n${log.system_prompt}\n\nMENSAGEM DO USUÁRIO:\n${log.user_message}`
                      )}
                      title="Copiar"
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => downloadLog(log)}
                      title="Baixar como TXT"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-medium mb-2">Prompt do Sistema:</h3>
                <ScrollArea className="h-48 rounded border p-4 bg-gray-50 mb-4">
                  <pre className="whitespace-pre-wrap text-sm">{log.system_prompt}</pre>
                </ScrollArea>
                
                <Separator className="my-4" />
                
                <h3 className="font-medium mb-2">Mensagem do Usuário:</h3>
                <div className="rounded border p-4 bg-gray-50 mb-2">
                  <p className="whitespace-pre-wrap text-sm">{log.user_message}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {logs.length === 0 && !isLoading && email && (
          <p className="text-center text-gray-500 mt-8">
            Nenhum log encontrado para este email.
          </p>
        )}
      </main>
      <PageFooter />
    </div>
  );
}
