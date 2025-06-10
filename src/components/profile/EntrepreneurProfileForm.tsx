
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AIGenerateButton } from "./AIGenerateButton";

interface EntrepreneurProfileFormProps {
  mainGoal: string;
  setMainGoal: (value: string) => void;
  entrepreneurshipReason: string;
  setEntrepreneurshipReason: (value: string) => void;
  managementStyle: string;
  setManagementStyle: (value: string) => void;
  motivation: string;
  setMotivation: (value: string) => void;
  difficulties: string;
  setDifficulties: (value: string) => void;
  goalsReviewFrequency: string;
  setGoalsReviewFrequency: (value: string) => void;
  teamStatus: string;
  setTeamStatus: (value: string) => void;
  planningTimeWeekly: string;
  setPlanningTimeWeekly: (value: string) => void;
  technologyInvestment: boolean;
  setTechnologyInvestment: (value: boolean) => void;
  leadershipStyle: string;
  setLeadershipStyle: (value: string) => void;
  isGenerating: Record<string, boolean>;
  onGenerateField: (fieldId: string) => void;
}

export function EntrepreneurProfileForm({
  mainGoal,
  setMainGoal,
  entrepreneurshipReason,
  setEntrepreneurshipReason,
  managementStyle,
  setManagementStyle,
  motivation,
  setMotivation,
  difficulties,
  setDifficulties,
  goalsReviewFrequency,
  setGoalsReviewFrequency,
  teamStatus,
  setTeamStatus,
  planningTimeWeekly,
  setPlanningTimeWeekly,
  technologyInvestment,
  setTechnologyInvestment,
  leadershipStyle,
  setLeadershipStyle,
  isGenerating,
  onGenerateField
}: EntrepreneurProfileFormProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-pump-purple dark:text-white">🧠 Perfil do Empresário</h2>
      <Separator className="mb-4 dark:bg-gray-700" />
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Qual é o seu maior objetivo como empreendedor nos próximos 12 meses?
        </label>
        <div className="flex items-start gap-2">
          <Textarea 
            value={mainGoal} 
            onChange={(e) => setMainGoal(e.target.value)} 
            className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
          />
          <AIGenerateButton
            fieldId="mainGoal"
            isGenerating={isGenerating.mainGoal}
            onGenerate={onGenerateField}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Em poucas palavras, por que você decidiu empreender?
        </label>
        <div className="flex items-start gap-2">
          <Textarea 
            value={entrepreneurshipReason} 
            onChange={(e) => setEntrepreneurshipReason(e.target.value)} 
            className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
          />
          <AIGenerateButton
            fieldId="entrepreneurshipReason"
            isGenerating={isGenerating.entrepreneurshipReason}
            onGenerate={onGenerateField}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Você se considera mais operacional, estratégico ou comercial no seu negócio?
        </label>
        <Select value={managementStyle} onValueChange={setManagementStyle}>
          <SelectTrigger className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operacional">Operacional</SelectItem>
            <SelectItem value="estratégico">Estratégico</SelectItem>
            <SelectItem value="comercial">Comercial</SelectItem>
            <SelectItem value="misto">Mistura de estilos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          O que mais te motiva no dia a dia da empresa?
        </label>
        <div className="flex items-start gap-2">
          <Textarea 
            value={motivation} 
            onChange={(e) => setMotivation(e.target.value)} 
            className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
          />
          <AIGenerateButton
            fieldId="motivation"
            isGenerating={isGenerating.motivation}
            onGenerate={onGenerateField}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Quais são suas maiores dificuldades como gestor hoje?
        </label>
        <div className="flex items-start gap-2">
          <Textarea 
            value={difficulties} 
            onChange={(e) => setDifficulties(e.target.value)} 
            className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
          />
          <AIGenerateButton
            fieldId="difficulties"
            isGenerating={isGenerating.difficulties}
            onGenerate={onGenerateField}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Com que frequência você revisa ou ajusta suas metas?
        </label>
        <Select value={goalsReviewFrequency} onValueChange={setGoalsReviewFrequency}>
          <SelectTrigger className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diariamente">Diariamente</SelectItem>
            <SelectItem value="semanalmente">Semanalmente</SelectItem>
            <SelectItem value="mensalmente">Mensalmente</SelectItem>
            <SelectItem value="trimestralmente">Trimestralmente</SelectItem>
            <SelectItem value="anualmente">Anualmente</SelectItem>
            <SelectItem value="raramente">Raramente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Você trabalha com uma equipe ou sozinho atualmente?
        </label>
        <Select value={teamStatus} onValueChange={setTeamStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sozinho">Sozinho</SelectItem>
            <SelectItem value="equipe pequena">Equipe pequena (1-5)</SelectItem>
            <SelectItem value="equipe média">Equipe média (6-20)</SelectItem>
            <SelectItem value="equipe grande">Equipe grande (20+)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Quanto tempo por semana você dedica ao planejamento do seu negócio?
        </label>
        <Select value={planningTimeWeekly} onValueChange={setPlanningTimeWeekly}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="menos de 1 hora">Menos de 1 hora</SelectItem>
            <SelectItem value="1-3 horas">1-3 horas</SelectItem>
            <SelectItem value="3-5 horas">3-5 horas</SelectItem>
            <SelectItem value="mais de 5 horas">Mais de 5 horas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="tech-investment" 
          checked={technologyInvestment} 
          onCheckedChange={(checked) => setTechnologyInvestment(checked as boolean)} 
        />
        <label htmlFor="tech-investment" className="text-sm font-medium">
          Você já investiu ou pretende investir em tecnologia para melhorar a gestão?
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-200">
          Em uma palavra, como você definiria seu estilo de liderança?
        </label>
        <Input 
          value={leadershipStyle} 
          onChange={(e) => setLeadershipStyle(e.target.value)} 
          className="w-full dark:bg-[#333333] dark:text-white dark:border-gray-700"
        />
      </div>
    </div>
  );
}
