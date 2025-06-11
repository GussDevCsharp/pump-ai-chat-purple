
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AIGenerateButton } from "./AIGenerateButton";

interface CompanyProfileFormProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  yearsInOperation: string;
  setYearsInOperation: (value: string) => void;
  mainProducts: string;
  setMainProducts: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
  channelType: string;
  setChannelType: (value: string) => void;
  salesModel: string;
  setSalesModel: (value: string) => void;
  averageRevenue: string;
  setAverageRevenue: (value: string) => void;
  employeesCount: string;
  setEmployeesCount: (value: string) => void;
  managementTools: string;
  setManagementTools: (value: string) => void;
  documentedProcesses: boolean;
  setDocumentedProcesses: (value: boolean) => void;
  biggestChallenge: string;
  setBiggestChallenge: (value: string) => void;
  isGenerating: Record<string, boolean>;
  onGenerateField: (fieldId: string) => void;
}

export function CompanyProfileForm({
  companyName,
  setCompanyName,
  yearsInOperation,
  setYearsInOperation,
  mainProducts,
  setMainProducts,
  targetAudience,
  setTargetAudience,
  channelType,
  setChannelType,
  salesModel,
  setSalesModel,
  averageRevenue,
  setAverageRevenue,
  employeesCount,
  setEmployeesCount,
  managementTools,
  setManagementTools,
  documentedProcesses,
  setDocumentedProcesses,
  biggestChallenge,
  setBiggestChallenge,
  isGenerating,
  onGenerateField
}: CompanyProfileFormProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-pump-purple dark:text-white">🏢 Perfil da Empresa</h2>
      <Separator className="mb-4 dark:bg-gray-700" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Nome da empresa
          </label>
          <Input 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)} 
            className="w-full bg-white dark:bg-[#333333] dark:text-white dark:border-gray-700"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Há quanto tempo em operação?
          </label>
          <Select value={yearsInOperation} onValueChange={setYearsInOperation}>
            <SelectTrigger className="w-full bg-white dark:bg-[#333333] dark:text-white dark:border-gray-700">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menos de 1 ano">Menos de 1 ano</SelectItem>
              <SelectItem value="1-3 anos">1-3 anos</SelectItem>
              <SelectItem value="3-5 anos">3-5 anos</SelectItem>
              <SelectItem value="5-10 anos">5-10 anos</SelectItem>
              <SelectItem value="mais de 10 anos">Mais de 10 anos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Qual é o principal produto ou serviço que você oferece hoje?
        </label>
        <div className="flex items-start gap-2">
          <Textarea 
            value={mainProducts} 
            onChange={(e) => setMainProducts(e.target.value)} 
            className="w-full"
          />
          <AIGenerateButton
            fieldId="mainProducts"
            isGenerating={isGenerating.mainProducts}
            onGenerate={onGenerateField}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Qual é o seu público-alvo?
        </label>
        <div className="flex items-start gap-2">
          <Textarea 
            value={targetAudience} 
            onChange={(e) => setTargetAudience(e.target.value)} 
            className="w-full"
          />
          <AIGenerateButton
            fieldId="targetAudience"
            isGenerating={isGenerating.targetAudience}
            onGenerate={onGenerateField}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Sua empresa atua em qual canal?
        </label>
        <Select value={channelType} onValueChange={setChannelType}>
          <SelectTrigger className="bg-white dark:bg-[#333333] dark:text-white dark:border-gray-700">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="físico">Físico</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="ambos">Ambos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Hoje, o seu modelo de vendas é mais:
        </label>
        <Select value={salesModel} onValueChange={setSalesModel}>
          <SelectTrigger className="bg-white dark:bg-[#333333] dark:text-white dark:border-gray-700">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reativo">Reativo (espera o cliente chegar)</SelectItem>
            <SelectItem value="ativo">Ativo (vai atrás do cliente)</SelectItem>
            <SelectItem value="misto">Misto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Qual é o seu faturamento médio mensal?
        </label>
        <Select value={averageRevenue} onValueChange={setAverageRevenue}>
          <SelectTrigger className="bg-white dark:bg-[#333333] dark:text-white dark:border-gray-700">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5000">Até R$ 5.000</SelectItem>
            <SelectItem value="20000">R$ 5.000 a R$ 20.000</SelectItem>
            <SelectItem value="50000">R$ 20.000 a R$ 50.000</SelectItem>
            <SelectItem value="100000">R$ 50.000 a R$ 100.000</SelectItem>
            <SelectItem value="200000">R$ 100.000 a R$ 200.000</SelectItem>
            <SelectItem value="500000">R$ 200.000 a R$ 500.000</SelectItem>
            <SelectItem value="1000000">Acima de R$ 500.000</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Quantos funcionários fixos você tem hoje?
        </label>
        <Input 
          type="number"
          value={employeesCount} 
          onChange={(e) => setEmployeesCount(e.target.value)} 
          className="w-full bg-white dark:bg-[#333333] dark:text-white dark:border-gray-700"
          min="0"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Quais ferramentas você usa para gerenciar sua empresa?
        </label>
        <Select value={managementTools} onValueChange={setManagementTools}>
          <SelectTrigger className="bg-white dark:bg-[#333333] dark:text-white dark:border-gray-700">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nenhum">Nenhum</SelectItem>
            <SelectItem value="planilha">Planilha</SelectItem>
            <SelectItem value="sistema">Sistema de gestão</SelectItem>
            <SelectItem value="app">Aplicativo</SelectItem>
            <SelectItem value="múltiplos">Múltiplas ferramentas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="documented-processes" 
          checked={documentedProcesses} 
          onCheckedChange={(checked) => setDocumentedProcesses(checked as boolean)} 
        />
        <label htmlFor="documented-processes" className="text-sm font-medium">
          Você possui processos documentados?
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Qual é o maior desafio da sua empresa neste momento?
        </label>
        <div className="flex items-start gap-2">
          <Textarea 
            value={biggestChallenge} 
            onChange={(e) => setBiggestChallenge(e.target.value)} 
            className="w-full"
          />
          <AIGenerateButton
            fieldId="biggestChallenge"
            isGenerating={isGenerating.biggestChallenge}
            onGenerate={onGenerateField}
          />
        </div>
      </div>
    </div>
  );
}
