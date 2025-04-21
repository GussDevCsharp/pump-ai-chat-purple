
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
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
          <form onSubmit={handleSignup} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Campos de login */}
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

              {/* Campos extras do Empresário */}
              <div className="pt-4 border-t mt-4 space-y-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Dados do Empresário</h3>
                <div>
                  <Label htmlFor="nomeEmpresario">Nome do empresário</Label>
                  <Input
                    id="nomeEmpresario"
                    type="text"
                    value={nomeEmpresario}
                    onChange={e => setNomeEmpresario(e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="idadeEmpresario">Idade</Label>
                  <Input
                    id="idadeEmpresario"
                    type="number"
                    min={0}
                    value={idadeEmpresario}
                    onChange={e => setIdadeEmpresario(e.target.value === "" ? "" : Number(e.target.value))}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>Gênero</Label>
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
              </div>

              {/* Perfil da Empresa */}
              <div className="pt-4 border-t mt-4">
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
              </div>

              {/* Perfil do Empresário */}
              <div className="pt-4 border-t mt-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Perfil do Empresário</h3>
                <div>
                  <Label htmlFor="vision">Qual é a sua maior visão para a empresa?</Label>
                  <Textarea
                    id="vision"
                    value={vision}
                    onChange={e => setVision(e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="mainChallenge">Que desafio é mais recorrente no seu dia a dia como empresário?</Label>
                  <Textarea
                    id="mainChallenge"
                    value={mainChallenge}
                    onChange={e => setMainChallenge(e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>Como você se descreveria em relação à tomada de decisões?</Label>
                  <RadioGroup
                    className="mt-2 flex flex-col gap-2"
                    value={decisionProfile}
                    onValueChange={setDecisionProfile}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="decision-conservador" value="conservador" />
                      <Label htmlFor="decision-conservador">Conservador</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="decision-equilibrado" value="equilibrado" />
                      <Label htmlFor="decision-equilibrado">Equilibrado</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="decision-agressivo" value="agressivo" />
                      <Label htmlFor="decision-agressivo">Agressivo</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Você costuma buscar inovação para o seu negócio?</Label>
                  <RadioGroup
                    className="mt-2 flex flex-col gap-2"
                    value={innovationHabit}
                    onValueChange={setInnovationHabit}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="innovacao-sempre" value="sempre" />
                      <Label htmlFor="innovacao-sempre">Sempre</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="innovacao-asvezes" value="asvezes" />
                      <Label htmlFor="innovacao-asvezes">Às vezes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="innovacao-raramente" value="raramente" />
                      <Label htmlFor="innovacao-raramente">Raramente</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="goalForYear">Qual seria o maior objetivo que deseja alcançar no próximo ano?</Label>
                  <Textarea
                    id="goalForYear"
                    value={goalForYear}
                    onChange={e => setGoalForYear(e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-pump-purple hover:bg-pump-purple/90"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Cadastrar"}
            </Button>
          </form>
          <div className="text-center pt-4 border-t mt-6">
            <p className="text-sm text-gray-600 mb-2">Já tem uma conta?</p>
            <Link to="/login">
              <Button variant="outline" className="text-pump-purple hover:bg-pump-purple/10">
                Fazer login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative flex-1 bg-pump-gray-light">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-xl space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Transforme sua empresa com IA
            </h3>
            <p className="text-pump-gray">
              Use inteligência artificial de ponta para turbinar o seu negócio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
