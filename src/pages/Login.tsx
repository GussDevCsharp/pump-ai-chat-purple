import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import NeuralBackground from "@/components/effects/NeuralBackground"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { Mail } from "lucide-react"

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

    if (error) {
      setIsLoading(false)
      if (error.message && error.message.includes("Invalid login credentials")) {
        toast.error('Email ou senha inválidos')
      } else {
        toast.error(error.message || 'Erro ao fazer login')
      }
      return
    }

    try {
      const { data: companyProfile } = await supabase
        .from('company_profiles')
        .select('profile_completed')
        .eq('user_id', data.user.id)
        .maybeSingle()
      
      setIsLoading(false)
      toast.success('Login realizado com sucesso!')
      
      setTimeout(() => {
        navigate('/themes')
      }, 600)
    } catch (profileError) {
      setIsLoading(false)
      console.error('Error checking profile completion:', profileError)
      toast.success('Login realizado com sucesso!')
      setTimeout(() => {
        navigate('/themes')
      }, 600)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-offwhite flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full bg-white/85 shadow-lg rounded-xl p-8">
          <div className="text-center">
            <Link to="/">
              <img 
                src="/uploads/chatpump-logo-transparent.png" 
                alt="ChatPump"
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

          <div className="mt-8">
            <div className="flex space-x-4 mb-6">
              <GoogleButton />
              <Link to="/signup" className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent p-2 border-none hover:bg-transparent flex items-center justify-center gap-2"
                >
                  <Mail className="h-5 w-5 text-pump-purple" />
                  <span className="text-gray-700 font-medium">Entrar com email</span>
                </Button>
              </Link>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/85 text-gray-500">
                  ou continue com email
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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
          </div>
          
          <div className="text-center pt-4 border-t mt-6">
            <p className="text-sm text-gray-600 mb-2">Empreendedor? Experimente nossa ferramenta:</p>
            <Link to="/business-generator">
              <Button variant="outline" className="text-pump-purple hover:bg-pump-purple/10 rounded-lg">
                Gerar Plano de Negócios
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-offwhite relative overflow-hidden">
        <NeuralBackground />
        <div className="relative z-[5] flex items-center justify-center h-full pointer-events-none">
          <h1 className="text-5xl font-bold text-pump-purple text-center leading-tight max-w-lg">
            A Nova inteligência da sua empresa
          </h1>
        </div>
      </div>
    </div>
  )
}
