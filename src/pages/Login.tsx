
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import NeuralBackground from "@/components/effects/NeuralBackground"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { Mail } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const isMobile = useIsMobile()

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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Coluna de formulário (sempre visível) */}
      <div className="w-full md:w-1/2 bg-offwhite dark:bg-black/40 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <div className={`max-w-md w-full ${isDark ? 'bg-black/70 backdrop-blur-lg' : 'bg-white/85'} shadow-lg rounded-xl p-6 sm:p-8`}>
          <div className="text-center">
            <Link to="/">
              <img 
                src="\img\CHATPUMP.png" 
                alt="ChatPump"
                className="h-12 mx-auto"
              />
            </Link>
            <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-base text-pump-gray dark:text-white/70">
              Entre para acessar sua conta
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
              <GoogleButton />
              <Link to="/signup" className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent p-2 border-none hover:bg-transparent flex items-center justify-center gap-2"
                >
                  <Mail className="h-5 w-5 text-pump-purple" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Entrar com email</span>
                </Button>
              </Link>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDark ? 'bg-black/70' : 'bg-white/85'} text-gray-500 dark:text-gray-400`}>
                  ou continue com email
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className={`w-full ${isDark ? 'bg-pump-purple hover:bg-pump-purple/90 text-white' : 'bg-white text-pump-gray border border-gray-300 hover:bg-gray-100'} text-lg rounded-lg py-3 transition-all duration-200`}
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>
          
          <div className="text-center pt-4 border-t mt-6 border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Empreendedor? Experimente nossa ferramenta:</p>
            <Link to="/business-generator">
              <Button variant="outline" className="text-pump-purple hover:bg-pump-purple/10 rounded-lg dark:text-white dark:border-white/20 dark:hover:bg-white/10">
                Gerar Plano de Negócios
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Coluna de imagem (visível apenas em desktop) */}
      <div className="hidden md:block md:w-1/2 bg-offwhite dark:bg-black relative overflow-hidden">
        <NeuralBackground />
        <div className="relative z-[5] flex items-center justify-center h-full pointer-events-none">
          <h1 className="text-4xl lg:text-5xl font-bold text-pump-purple dark:text-white text-center leading-tight max-w-lg">
            A Nova inteligência da sua empresa
          </h1>
        </div>
      </div>
    </div>
  )
}
