import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SignupRoadmap } from "@/components/SignupRoadmap";

export default function Signup() {
  // Login info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Company profile info
  const [companyName, setCompanyName] = useState("");
  const [businessSegment, setBusinessSegment] = useState("");
  const [mainProducts, setMainProducts] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [employeesCount, setEmployeesCount] = useState<number | "">("");
  const [averageRevenue, setAverageRevenue] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);

  // Perfil do empresário - campos novos e antigos
  const [nomeEmpresario, setNomeEmpresario] = useState("");
  const [idadeEmpresario, setIdadeEmpresario] = useState<number | "">("");
  const [generoEmpresario, setGeneroEmpresario] = useState("");
  const [perfilPessoalPergunta1, setPerfilPessoalPergunta1] = useState(""); // Ex: O que te inspira no dia a dia?
  const [perfilPessoalPergunta2, setPerfilPessoalPergunta2] = useState(""); // Ex: Como se define pessoalmente?

  const [vision, setVision] = useState("");
  const [mainChallenge, setMainChallenge] = useState("");
  const [decisionProfile, setDecisionProfile] = useState(""); // conservador, equilibrado, agressivo
  const [innovationHabit, setInnovationHabit] = useState(""); // sempre, as vezes, raramente
  const [goalForYear, setGoalForYear] = useState("");

  const navigate = useNavigate();

  const [tab, setTab] = useState("conta");
  const stepIndex = ["conta", "empresario", "empresa"].indexOf(tab);

  // redefine roadmap steps, in order
  const roadmapSteps = [
    { title: "Conta" },
    { title: "Perfil Empresário" },
    { title: "Perfil Empresa" },
  ];

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    // Verificação dos campos obrigatórios de login e empresa
    if (
      !email || !password || !confirmPassword ||
      !companyName
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    setIsLoading(true);

    // Cria o usuário no auth
    const { data: signupData, error: signupError } = await supabase.auth.signUp({ email, password });
    if (signupError) {
      setIsLoading(false);
      if (signupError.message && signupError.message.includes("already registered")) {
        toast.error("Este e-mail já está cadastrado");
      } else {
        toast.error(signupError.message || "Erro ao criar conta");
      }
      return;
    }
    // Pega id do usuário criado (caso já esteja autenticado na resposta)
    const userId = signupData?.user?.id;
    if (!userId) {
      setIsLoading(false);
      toast.success("Cadastro realizado! Verifique seu email.");
      setTimeout(() => { navigate("/login"); }, 800);
      return;
    }

    // Insere o perfil da empresa + perfil do empresário
    const { error: companyError } = await supabase
      .from("company_profiles")
      .insert([{
        user_id: userId,
        company_name: companyName,
        business_segment: businessSegment,
        main_products: mainProducts,
        address,
        phone,
        social_facebook: socialFacebook,
        social_instagram: socialInstagram,
        social_linkedin: socialLinkedin,
        employees_count: employeesCount === "" ? null : Number(employeesCount),
        average_revenue: averageRevenue === "" ? null : Number(averageRevenue),
        // Adiciona todos os campos de perfil do empresário no metadata
        metadata: {
          nomeEmpresario,
          idadeEmpresario: idadeEmpresario === "" ? null : Number(idadeEmpresario),
          generoEmpresario,
          perfilPessoalPergunta1,
          perfilPessoalPergunta2,
          vision,
          main_challenge: mainChallenge,
          decision_profile: decisionProfile,
          innovation_habit: innovationHabit,
          goal_for_year: goalForYear,
        }
      }]);

    setIsLoading(false);
    if (companyError) {
      toast.warning("Cadastro realizado, mas houve um erro ao salvar o perfil da empresa. Complete depois.");
    } else {
      toast.success("Cadastro realizado! Verifique seu email.");
    }

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const renderContaTab = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha *
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmar senha *
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button
          type="button"
          className="bg-pump-purple text-white"
          onClick={() => setTab("empresario")}
          disabled={isLoading}
        >
          Próxima etapa
        </Button>
      </div>
    </div>
  );

  const renderEmpresarioTab = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-2 text-gray-900">Dados do Empresário</h3>
      <div>
        <Label htmlFor="nomeEmpresario">Nome do empresário *</Label>
        <Input
          id="nomeEmpresario"
          type="text"
          required
          value={nomeEmpresario}
          onChange={e => setNomeEmpresario(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="idadeEmpresario">Idade *</Label>
        <Input
          id="idadeEmpresario"
          type="number"
          min={0}
          required
          value={idadeEmpresario}
          onChange={e => setIdadeEmpresario(e.target.value === "" ? "" : Number(e.target.value))}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <Label>Gênero *</Label>
        <RadioGroup
          className="mt-2 flex flex-row gap-5"
          value={generoEmpresario}
          onValueChange={setGeneroEmpresario}
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem id="genero-masculino" value="masculino" />
            <Label htmlFor="genero-masculino">Masculino</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="genero-feminino" value="feminino" />
            <Label htmlFor="genero-feminino">Feminino</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="genero-outro" value="outro" />
            <Label htmlFor="genero-outro">Outro</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="perfilPessoalPergunta1">O que te inspira no dia a dia?</Label>
        <Textarea
          id="perfilPessoalPergunta1"
          value={perfilPessoalPergunta1}
          onChange={e => setPerfilPessoalPergunta1(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="perfilPessoalPergunta2">Como você se define pessoalmente?</Label>
        <Textarea
          id="perfilPessoalPergunta2"
          value={perfilPessoalPergunta2}
          onChange={e => setPerfilPessoalPergunta2(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setTab("conta")}
          disabled={isLoading}
        >
          Voltar
        </Button>
        <Button
          type="button"
          className="bg-pump-purple text-white"
          onClick={() => setTab("empresa")}
          disabled={isLoading}
        >
          Próxima etapa
        </Button>
      </div>
    </div>
  );

  const renderEmpresaTab = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-2 text-gray-900">Dados da Empresa</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome da empresa *</label>
        <Input
          type="text"
          required
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Segmento</label>
        <Input
          type="text"
          placeholder="Ex: Restaurante, Loja de Roupas, etc."
          value={businessSegment}
          onChange={e => setBusinessSegment(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Produtos/Serviços principais</label>
        <Input
          type="text"
          placeholder="Separe por vírgula"
          value={mainProducts}
          onChange={e => setMainProducts(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Endereço</label>
        <Input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Telefone</label>
        <Input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Instagram</label>
        <Input
          type="text"
          placeholder="@empresa"
          value={socialInstagram}
          onChange={e => setSocialInstagram(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Facebook</label>
        <Input
          type="text"
          placeholder="/empresa"
          value={socialFacebook}
          onChange={e => setSocialFacebook(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
        <Input
          type="text"
          placeholder="/empresa"
          value={socialLinkedin}
          onChange={e => setSocialLinkedin(e.target.value)}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantidade de funcionários</label>
        <Input
          type="number"
          min={0}
          value={employeesCount}
          onChange={e => setEmployeesCount(e.target.value === "" ? "" : Number(e.target.value))}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Faturamento médio mensal (R$)</label>
        <Input
          type="number"
          min={0}
          step={0.01}
          value={averageRevenue}
          onChange={e => setAverageRevenue(e.target.value === "" ? "" : Number(e.target.value))}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setTab("empresario")}
          disabled={isLoading}
        >
          Voltar
        </Button>
        <Button
          type="submit"
          className="bg-pump-purple text-white w-full"
          disabled={isLoading}
        >
          {isLoading ? "Criando conta..." : "Cadastrar"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-8 max-w-none w-full">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png"
              alt="Pump.ia"
              className="h-12 mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crie sua conta grátis
          </h2>
          <p className="mt-2 text-sm text-pump-gray">
            Cadastre-se para acessar todas as funcionalidades
          </p>
        </div>
        <SignupRoadmap steps={roadmapSteps} currentStep={stepIndex} />
        <form onSubmit={handleSignup} className="w-full">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-6 grid grid-cols-3 w-full">
              <TabsTrigger value="conta">Conta</TabsTrigger>
              <TabsTrigger value="empresario">Perfil Empresário</TabsTrigger>
              <TabsTrigger value="empresa">Perfil Empresa</TabsTrigger>
            </TabsList>
            <TabsContent value="conta">{renderContaTab()}</TabsContent>
            <TabsContent value="empresario">{renderEmpresarioTab()}</TabsContent>
            <TabsContent value="empresa">{renderEmpresaTab()}</TabsContent>
          </Tabs>
        </form>
        <div className="text-center pt-4 border-t mt-10">
          <p className="text-sm text-gray-600 mb-2">Já tem uma conta?</p>
          <Link to="/login">
            <Button variant="outline" className="text-pump-purple hover:bg-pump-purple/10">
              Fazer login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
