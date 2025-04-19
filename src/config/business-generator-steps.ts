import { Step } from "@/types/business-generator";

export const steps: Step[] = [
  {
    id: "business-info",
    title: "Qual é o nome do seu negócio?",
    description: "Digite o nome atual ou planejado do seu negócio",
    fields: [
      {
        id: "businessName",
        label: "Nome do negócio",
        type: "input",
        placeholder: "Ex: Café do João, Tech Solutions...",
      },
    ],
  },
  {
    id: "business-type",
    title: "O que você quer vender?",
    description: "Escolha o tipo principal do seu negócio",
    fields: [
      {
        id: "businessType",
        label: "Selecione uma opção:",
        type: "radio",
        options: [
          { id: "product", label: "Quero vender produtos físicos" },
          { id: "service", label: "Quero oferecer serviços" },
          { id: "hybrid", label: "Quero vender produtos e serviços" },
          { id: "marketplace", label: "Quero criar um site que conecta vendedores e compradores" },
          { id: "saas", label: "Quero criar um software ou aplicativo" },
        ],
      },
    ],
  },
  {
    id: "target-audience",
    title: "Para quem você quer vender?",
    description: "Vamos definir quem são seus clientes ideais",
    fields: [
      {
        id: "targetAudience",
        label: "Quem vai comprar seu produto ou serviço?",
        type: "radio",
        options: [
          { id: "b2c", label: "Vou vender direto para as pessoas (consumidores)" },
          { id: "b2b", label: "Vou vender para outras empresas" },
          { id: "b2b2c", label: "Vou vender tanto para pessoas quanto para empresas" },
        ],
      },
      {
        id: "audienceDescription",
        label: "Descreva um pouco mais sobre seus clientes ideais",
        type: "textarea",
        placeholder: "Exemplo: Jovens de 20 a 35 anos que gostam de tecnologia...",
      },
    ],
  },
  {
    id: "industry",
    title: "Qual é a área do seu negócio?",
    description: "Escolha o setor principal da sua empresa",
    fields: [
      {
        id: "industry",
        label: "Selecione a área que mais combina com seu negócio:",
        type: "radio",
        options: [
          { id: "technology", label: "Tecnologia e Digital" },
          { id: "health", label: "Saúde e Bem-estar" },
          { id: "education", label: "Educação e Ensino" },
          { id: "finance", label: "Finanças e Dinheiro" },
          { id: "food", label: "Comida e Bebida" },
          { id: "retail", label: "Loja e Varejo" },
          { id: "logistics", label: "Entregas e Logística" },
          { id: "other", label: "Outro tipo de negócio" },
        ],
      },
      {
        id: "industryDetail",
        label: "Qual é a área do seu negócio?",
        type: "input",
        placeholder: "Ex: Turismo, Moda, Artesanato...",
        conditional: { field: "industry", value: "other" },
      },
    ],
  },
  {
    id: "unique-value",
    title: "O que torna seu negócio especial?",
    description: "Conte-nos o que vai fazer seu negócio se destacar da concorrência",
    fields: [
      {
        id: "uniqueValue",
        label: "Qual é o diferencial do seu negócio?",
        type: "textarea",
        placeholder: "Ex: Vou oferecer atendimento 24 horas, entregas mais rápidas, produtos exclusivos...",
      },
    ],
  },
  {
    id: "resources",
    title: "Recursos iniciais",
    description: "Vamos planejar com quanto dinheiro e pessoas você vai começar",
    fields: [
      {
        id: "initialBudget",
        label: "Quanto você planeja investir no início?",
        type: "radio",
        options: [
          { id: "low", label: "Até R$ 10.000" },
          { id: "medium", label: "Entre R$ 10.000 e R$ 50.000" },
          { id: "high", label: "Entre R$ 50.000 e R$ 200.000" },
          { id: "vhigh", label: "Mais de R$ 200.000" },
        ],
      },
      {
        id: "team",
        label: "Com quantas pessoas você vai começar?",
        type: "radio",
        options: [
          { id: "solo", label: "Só eu mesmo(a)" },
          { id: "small", label: "Uma equipe pequena (2-5 pessoas)" },
          { id: "medium", label: "Uma equipe média (6-15 pessoas)" },
          { id: "large", label: "Uma equipe grande (mais de 15 pessoas)" },
        ],
      },
    ],
  },
  {
    id: "goals",
    title: "Quais são seus objetivos?",
    description: "Vamos definir o que você quer alcançar com seu negócio",
    fields: [
      {
        id: "shortTermGoals",
        label: "O que você quer conseguir no primeiro ano?",
        type: "textarea",
        placeholder: "Ex: Conseguir os primeiros 50 clientes, abrir minha loja física...",
      },
      {
        id: "longTermGoals",
        label: "O que você quer alcançar em 3-5 anos?",
        type: "textarea",
        placeholder: "Ex: Expandir para outras cidades, criar novos produtos...",
      },
    ],
  },
];
