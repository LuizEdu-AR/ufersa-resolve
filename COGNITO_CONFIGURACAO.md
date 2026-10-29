# Integração Cognito — UFERSA Resolve

O frontend usa Authorization Code + PKCE, sem client secret. A autenticação é exigida antes de renderizar as páginas.

## Configuração necessária no Cognito
- Região: us-east-1
- User Pool: us-east-1_8TKL4U1LM
- App client (SPA, sem secret): 40hkvlmk5fss41v205uh1ctuqg
- Callback e sign-out: https://ufersa-resolve.luizeduardo.zangado.web.ufersa.dev.br/
- OAuth: Authorization code grant; scopes openid, email, profile.
- Domínio Hosted UI confirmado em Cognito > Branding > Domain: `https://us-east-18tkl4u1lm.auth.us-east-1.amazoncognito.com`. O mesmo valor está configurado em `src/services/cognitoAuth.js`.

## Como aplicar
Copie os arquivos deste pacote para os mesmos caminhos no repositório, preservando os demais arquivos. Faça o deploy pelo fluxo atual do Amplify.

## Testes
1. Abra o site em uma janela anônima: deve redirecionar para o Cognito.
2. Faça login: a URL volta ao site, o `code` é removido e a aplicação exibe o usuário autenticado.
3. Clique no ícone de sair: deve encerrar a sessão e voltar ao site, que exigirá login novamente.
4. Em DevTools > Network, confirme a requisição POST `/oauth2/token` com sucesso; não compartilhe tokens em prints.

## Limites desta entrega
- O estado OAuth e os tokens ficam na sessionStorage da aba (não há backend para sessões nesta etapa).
- A interface de chamados ainda utiliza dados locais e não possui autorização no backend. Cognito não transforma dados locais em persistência segura nem aplica RBAC automaticamente.
- A API WebSocket, Lambda, Gemini e domínio `api.*` serão implementados em etapas posteriores.
- O endpoint de tokens do Cognito precisa permitir chamadas CORS a partir do domínio do frontend; o domínio configurado deve estar correto.
