
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import NeuralBackground from "@/components/effects/NeuralBackground"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    setIsLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)

    if (error) {
      if (error.message && error.message.includes("Invalid login credentials")) {
        toast.error('Email ou senha inválidos')
      } else {
        toast.error(error.message || 'Erro ao fazer login')
      }
      return
    }

    toast.success('Login realizado com sucesso!')
    setTimeout(() => {
      navigate('/themes')
    }, 600)
  }

  return (
    <div className="min-h-screen flex">
      {/* Login Column */}
      <div className="w-1/2 bg-offwhite flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white/85 shadow-lg rounded-xl p-8">
          <div className="text-center">
            <Link to="/">
              <img 
                src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
                alt="Pump.ia"
                className="h-12 mx-auto"
              />
            </Link>
            <h2 className="mt-7 text-3xl font-bold text-gray-900">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-base text-pump-gray">
              Entre para acessar sua conta
            </p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-pump-purple hover:bg-pump-purple/90 text-lg rounded-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="text-center pt-4 border-t mt-6">
            <p className="text-sm text-gray-600 mb-2">Empreendedor? Experimente nossa ferramenta:</p>
            <Link to="/business-generator">
              <Button variant="outline" className="text-pump-purple hover:bg-pump-purple/10 rounded-lg">
                Gerar Plano de Negócios
              </Button>
            </Link>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Ainda não tem uma conta?</p>
              <Link to="/signup">
                <Button variant="link" className="text-pump-purple">
                  Cadastrar-se
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Effect Column */}
      <div className="w-1/2 bg-offwhite relative overflow-hidden">
        <NeuralBackground />
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-5xl font-bold text-pump-purple text-center leading-tight max-w-lg">
            A nova inteligência para empresas
          </h1>
        </div>
      </div>
    </div>
  )
}
