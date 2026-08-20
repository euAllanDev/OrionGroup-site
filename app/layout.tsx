import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orion Group | Produtos digitais e sites sob medida",
  description:
    "Produtos digitais próprios e sites com soluções sob medida para pequenos negócios.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
