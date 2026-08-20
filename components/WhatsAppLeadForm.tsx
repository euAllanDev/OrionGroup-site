"use client";

import { FormEvent } from "react";

const WHATSAPP_NUMBER = "5583989025512";

export function WhatsAppLeadForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const business = String(data.get("business") ?? "").trim();
    const project = String(data.get("project") ?? "").trim();

    const message = [
      "Olá! Conheci o Orion Group pelo site e quero conversar sobre um projeto.",
      `Meu nome: ${name}`,
      `Meu negócio: ${business}`,
      `O que estou procurando: ${project}`,
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="whatsapp-lead-form" onSubmit={handleSubmit}>
      <label>
        <span>Seu nome</span>
        <input name="name" type="text" autoComplete="name" placeholder="Como podemos chamar você?" required />
      </label>
      <label>
        <span>Seu negócio</span>
        <input name="business" type="text" autoComplete="organization" placeholder="Ex.: barbearia, pizzaria, loja" required />
      </label>
      <label className="whatsapp-project-field">
        <span>O que você procura?</span>
        <select name="project" defaultValue="" required>
          <option value="" disabled>Escolha uma opção</option>
          <option>Um site para apresentar meu negócio</option>
          <option>Um site com uma solução personalizada</option>
          <option>Quero conversar sobre uma ideia</option>
        </select>
      </label>
      <button type="submit">Quero um site para meu negócio <b>↗</b></button>
      <small>O WhatsApp será aberto em uma nova aba com a mensagem pronta.</small>
    </form>
  );
}
