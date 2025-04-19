
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()
    
    // Simple validation
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    // Default login credentials and simulated login
    const defaultEmail = 'italogustavocm@gmail.com'
    const defaultPassword = '123456'

    if (
      (email === 'demo@pump.ia' && password === 'demo123') || 
      (email === defaultEmail && password === defaultPassword)
    ) {
      toast.success('Login realizado com sucesso!')
      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } else {
      toast.error('Credenciais inválidas')
    }
  }

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
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-pump-gray">
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
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-pump-purple hover:bg-pump-purple/90">
              Entrar
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden lg:block relative flex-1 bg-pump-gray-light">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-xl space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Transforme sua empresa com IA
            </h3>
            <p className="text-pump-gray">
              Acesse ferramentas poderosas de IA desenvolvidas especialmente para empresas como a sua.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
