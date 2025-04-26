
import React from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SignupLayoutProps {
  children: React.ReactNode;
  steps: string[];
  current: number;
}

export function SignupLayout({ children, steps, current }: SignupLayoutProps) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex-1 relative ${
                index !== steps.length - 1 ? "after:content-[''] after:absolute after:top-1/2 after:left-full after:w-full after:h-0.5 after:bg-gray-200" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    index < current
                      ? "bg-green-500 text-white"
                      : index === current
                      ? "bg-pump-purple text-white ring-4 ring-pump-purple/20"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index < current ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`hidden sm:block text-sm font-medium ${
                    index <= current ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {children}
      </div>
      
      <div className="text-center mt-8 space-y-4">
        <p className="text-sm text-gray-600">Já tem uma conta?</p>
        <Link to="/login">
          <Button
            variant="outline"
            className="text-pump-purple border-pump-purple hover:bg-pump-purple/10 transition-colors duration-300"
          >
            Fazer login
          </Button>
        </Link>
      </div>
    </div>
  );
}
