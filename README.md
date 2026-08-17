# Orion Group — Motion V4

Versão de correção baseada nos screenshots do navegador.

## Mudanças principais

- Hero limpo: removidos os cards flutuantes de `ORION VAULT` e `LAUREN`.
- Mascote Orion reposicionado mais acima no hero, mantendo as órbitas e a camada 3D.
- Vault 3D centralizado e estabilizado.
- Removido o zoom agressivo do modelo do cofre que causava clipping/corte na viewport.
- A sensação de entrar no cofre agora usa uma combinação de câmera controlada + portal expansivo em tela cheia.
- A porta continua abrindo mecanicamente, mas o cofre permanece enquadrado até a transição interna.
- Constelação, knowledge graph, Task e seção do telefone foram preservados.

## Stack

- Next.js / React / TypeScript
- GSAP + ScrollTrigger
- Lenis
- Motion
- Three.js
- React Three Fiber
- Drei
- Tailwind/PostCSS

## Rodar no Windows

Abra `start-orion.bat`, ou:

```powershell
npm install
npm run dev
```

Depois acesse `http://localhost:3000`.

## Validação neste pacote

Os arquivos TS/TSX foram verificados com o compilador TypeScript em modo de transpile e retornaram 0 diagnósticos de sintaxe.
O `npm install` deste ambiente expirou por timeout de rede, portanto o build Next completo deve ser executado localmente após a instalação das dependências.
# Orion-Group-site-
# OrionGroup-site
