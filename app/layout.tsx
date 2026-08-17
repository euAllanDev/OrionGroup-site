import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orion Group — We build what should exist",
  description:
    "Orion Group cria produtos, sistemas e experiências digitais com personalidade.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
