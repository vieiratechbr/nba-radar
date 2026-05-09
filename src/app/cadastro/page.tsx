import type { Metadata } from "next";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta no NBA Radar e escolha seu time favorito."
};

export default function RegisterPage() {
  return (
    <LayoutWrapper className="grid min-h-[calc(100vh-10rem)] place-items-center py-12">
      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>
    </LayoutWrapper>
  );
}
