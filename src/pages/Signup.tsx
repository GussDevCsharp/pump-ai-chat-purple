
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email || !password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos")
      return
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }
    setIsLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setIsLoading(false)
    if (error) {
      if (error.message && error.message.includes("already registered")) {
        toast.error("Este e-mail já está cadastrado")
      } else {
        toast.error(error.message || "Erro ao criar conta")
      }
      return
    }
    toast.success("Cadastro realizado! Verifique seu email.")
    setTimeout(() => {
      navigate("/login")
    }, 800)
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
              Crie sua conta grátis
            </h2>
            <p className="mt-2 text-sm text-pump-gray">
              Cadastre-se para acessar todas as funcionalidades
            </p>
          </div>
          <form onSubmit={handleSignup} className="mt-8 space-y-6">
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
                  onChange={e => setEmail(e.target.value)}
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
                  Confirmar senha
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
  )
}
