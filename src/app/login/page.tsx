import type { Metadata } from "next";
import { Suspense } from "react";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre no NBA Radar para acessar sua área personalizada."
};

export default function LoginPage() {
  return (
    <LayoutWrapper className="grid min-h-[calc(100vh-10rem)] place-items-center py-12">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm font-semibold text-zinc-300">
              Carregando login...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </LayoutWrapper>
  );
}
