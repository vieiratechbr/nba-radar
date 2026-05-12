import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TeamThemeProvider } from "@/components/theme/TeamThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { getCurrentProfile } from "@/services/profileService";

export const metadata: Metadata = {
  title: {
    default: "NBA Radar",
    template: "%s | NBA Radar"
  },
  description:
    "Placares, classificação, prêmios, Draft e detalhes da NBA em tempo real.",
  icons: {
    icon: "/logos/logo.png",
    shortcut: "/logos/logo.png",
    apple: "/logos/logo.png"
  }
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { user, profile } = await getCurrentProfile();

  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider initialUser={user} initialProfile={profile}>
          <TeamThemeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </TeamThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
