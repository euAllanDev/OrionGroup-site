# Retomada da proxima sessao

**Atualizado em:** 2026-08-20

## Objetivo do projeto

O Orion Group atua em duas frentes:

1. Produtos digitais proprios: Orion Vault e Orion Task.
2. Sites comerciais e solucoes tecnologicas sob medida para pequenos estabelecimentos.

O site deve demonstrar a capacidade tecnica do Orion por meio dos produtos proprios e, depois, conectar essa capacidade ao servico oferecido aos pequenos negocios.

## Publicos

- Usuarios dos produtos Orion.
- Donos de pequenos estabelecimentos, inicialmente barbearias, pizzarias, lojas e negocios locais semelhantes.

O contexto completo de posicionamento esta em `.agents/product-marketing.md`.

## Posicionamento aprovado

O Orion nao entrega apenas um site bonito. Cria experiencias digitais sob medida e pode combinar design, site, software e hardware para resolver necessidades reais do estabelecimento.

Pilares:

- Qualidade visual e experiencias mais marcantes que sites genericos.
- Solucoes adaptadas ao funcionamento de cada negocio.
- Capacidade de integrar web, software e hardware.
- Experiencia pratica demonstrada pelos produtos proprios.
- Atendimento proximo para pequenos negocios.

Exemplo principal de solucao personalizada: landing page para barbearia integrada a um hardware que controla a fila e publica a situacao no site em tempo real.

## Produtos

### Orion Vault

- Repositorio: `https://github.com/euAllanDev/Orion-Vault`
- Workspace local-first para notas Markdown.
- Foco em privacidade, controle, conexoes entre notas e automacao segura assistida por IA.
- No site, deve ser apresentado como produto funcional e prova da capacidade do Orion.

### Orion Task

- Repositorio: `https://github.com/euAllanDev/OrionTask`
- SaaS multiempresa para suporte tecnico e gestao de tickets.
- Voltado inicialmente a pequenas empresas que atendem seus proprios clientes.
- Ainda esta em desenvolvimento e deve ser identificado dessa forma. Nao voltar a descreve-lo como um aplicativo generico de produtividade.

## Conversao aprovada

- Acao principal: solicitar orcamento pelo WhatsApp.
- CTA principal: `Quero um site para meu negocio`.
- Numero comercial: `5583989025512`.
- Sem backend e sem API paga.
- O formulario coleta nome, tipo de negocio e projeto desejado.
- O navegador monta a mensagem e abre `wa.me` com o texto pronto.
- Implementacao: `components/WhatsAppLeadForm.tsx`.

## Trabalho realizado

### Performance

- Criado `components/SectionLoadManager.tsx`.
- A secao atual, a primeira acima e a primeira abaixo permanecem animadas.
- Animacoes CSS e Web Animations das secoes distantes sao pausadas.
- Canvases 3D distantes usam `frameloop="never"` sem serem desmontados.
- DPR e geometria das cenas 3D foram reduzidos.
- O loop de ponteiro de `MotionDirector` passou a funcionar somente enquanto ha movimento a interpolar.

### Copy e conversao

- Hero reescrito para explicar as duas frentes da empresa.
- Projetos renomeados e apresentados como produtos proprios.
- Copy do Vault alinhada ao produto real.
- Copy e interface ilustrativa do Task alinhadas a suporte e tickets.
- Secao de servicos reposicionada para sites e solucoes sob medida.
- Narrativa da barbearia passou a mostrar que o Orion pode ir alem do site.
- CTA final substituido por formulario de contato via WhatsApp.
- Titulo e descricao de SEO atualizados em `app/layout.tsx`.

### Skills instaladas

Foram instaladas no projeto, em `.agents/skills/`:

- `product-marketing`
- `copywriting`
- `copy-editing`
- `cro`
- `offers`

O registro da instalacao esta em `skills-lock.json`. E necessario reiniciar o OpenCode para uma nova sessao carregar as skills automaticamente.

## Validacao realizada

- `npm run build`: aprovado.
- TypeScript: aprovado durante o build.
- `git diff --check`: aprovado.
- `http://localhost:3000`: respondeu com HTTP 200.
- A resposta HTML confirmou a nova copy e o formulario.

## Estado do servidor

O servidor de desenvolvimento foi iniciado em `http://localhost:3000`. Confirme se ainda esta ativo no inicio da proxima sessao; se necessario, execute `npm run dev`.

## Estado do Git

O worktree esta sujo e nao houve commit. Existem alteracoes da sessao anterior e desta sessao. Nao reverter arquivos indiscriminadamente.

Arquivos novos relevantes:

- `.agents/product-marketing.md`
- `.agents/skills/`
- `components/SectionLoadManager.tsx`
- `components/WhatsAppLeadForm.tsx`
- `skills-lock.json`
- `NEXT_SESSION.md`

`next-env.d.ts` e um arquivo gerado pelo Next e pode alternar referencias entre `.next/dev/types` e `.next/types` ao executar desenvolvimento ou build.

## Proximos passos recomendados

1. Fazer revisao visual completa em desktop e celular, especialmente o novo formulario da secao final.
2. Testar o envio real para o WhatsApp e conferir a mensagem em Android, iOS e desktop.
3. Revisar quebras de linha dos novos titulos nas resolucoes de notebook.
4. Avaliar se a secao de servicos precisa mostrar o funcionamento da fila da barbearia com mais detalhes.
5. Adicionar provas reais quando existirem: primeiros clientes, depoimentos, resultados e imagens dos projetos.
6. Definir oferta, escopo inicial e processo de orcamento para reduzir objecoes comerciais.
7. Depois da aprovacao visual, revisar o diff e criar um commit somente se solicitado.

## Cuidados

- Nao inventar numeros, clientes, depoimentos ou resultados.
- Preservar o tom criativo nos titulos, mas manter os textos de apoio claros e acessiveis.
- Manter as duas frentes separadas e conectadas: produtos proprios provam capacidade; servicos aplicam essa capacidade ao negocio do cliente.
- Nao transformar o Orion Task novamente em uma ferramenta de produtividade pessoal.
- Nao substituir o fluxo gratuito do WhatsApp por uma integracao paga sem solicitacao explicita.
