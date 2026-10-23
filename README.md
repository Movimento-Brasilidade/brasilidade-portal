# Landing page Brasilidade

Página única de lançamento, baseada no wireframe desktop e mobile, com identidade oficial e link para **@somosbrasilidade**. Sem formulário, cadastro, rastreamento ou dependências novas.

## Versão atual

- `/`: marca centralizada, “O Brasil que vive / Está chegando.”, mensagem de lançamento e botão “Acompanhe no Instagram”.
- Cabeçalho com slogan, sem menu; rodapé com nome e perfil. No celular, ficam apenas slogan e perfil.
- `heroTitle` e `heroAccent` definem as duas linhas do título; `heroText` em `src/content/site.json` é a fonte única da apresentação visível e dos metadados. `description` permanece como campo legado para compatibilidade.
- `instagramUrl`, `instagramLabel` e `instagramCta` controlam o endereço, o perfil no rodapé e o botão. Todos são editáveis em **Landing page e Instagram** no Pages CMS.
- Sobre, Iniciativas e Publicações não geram conteúdo público. Templates foram preservados em `src/archived-pages`, fora do roteamento Astro; componentes e coleções continuam disponíveis para futura expansão. A Trama permanece apenas no conteúdo preservado.
- URLs antigas redirecionam para `/`: regras 302 em `public/_redirects` cobrem os caminhos exatos, barras finais e subcaminhos no Cloudflare Pages. Astro oferece redirecionamentos locais para as antigas páginas principais e a Trama; no build estático são páginas mínimas de redirecionamento HTML, sem conteúdo editorial. As regras wildcard de hospedagem dependem do Cloudflare e não são interpretadas pelo servidor local do Astro.
- Sitemap contém apenas a página inicial quando existe domínio configurado; 404 e redirecionamentos ficam excluídos.
- Para reativar o portal futuramente, restaurar os templates em `src/pages`, retirar os redirecionamentos correspondentes e revisar navegação, sitemap e testes antes de publicar.

As instruções sobre coleções abaixo descrevem a estrutura **reservada para expansão**. Editar ou publicar uma coleção no CMS não cria páginas na versão atual. A edição da landing page continua acionando o build normalmente após conectar as contas.

## GitHub Pages (hospedagem atual)

Endereço: https://movimento-brasilidade.github.io/brasilidade-portal/

Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions** como Source. O workflow `.github/workflows/check.yml` instala, compila, testa e publica `dist` a cada push em `main`. Pull requests apenas validam o projeto.

`astro.config.mjs` define o domínio e a base `/brasilidade-portal`. Imagens, fontes, links, canonical, robots e sitemap respeitam esse caminho. A prévia local também usa `/brasilidade-portal/`. O GitHub Pages usa os redirecionamentos HTML gerados pelo Astro para as rotas antigas conhecidas; regras `_redirects` e `_headers` são exclusivas do Cloudflare e não têm efeito no GitHub Pages. Subcaminhos desconhecidos mostram o 404.

A configuração de Cloudflare abaixo permanece como referência histórica. Para migrar para domínio próprio, ajustar `site`, `base`, caminhos esperados nos testes e configuração de domínio antes de publicar.

## Desenvolvimento

Requer Node 22.19 ou superior compatível com Astro 5 e npm. A versão fixada para CI e deploy é 22.22.0.

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
```

`dev` abre o servidor em `http://127.0.0.1:4321/brasilidade-portal/`. `build` valida TypeScript e os esquemas antes de gerar `dist/`. `test` verifica a configuração do CMS e as rotas geradas; execute após o build. O lockfile fixa as versões instaladas.

No computador usado na implementação, o Node global era 22.14.0, abaixo do mínimo de uma dependência transitiva. O build final foi executado com Node 22.22.0 temporário, sem mudar a instalação global. Atualize seu runtime para a versão de `.node-version` antes de instalar/desenvolver. Em ambientes restritos, use `ASTRO_TELEMETRY_DISABLED=1` para evitar a gravação da configuração de telemetria fora do projeto.

Validação da landing page: `astro check` sem erros ou avisos; build estático e seis testes automatizados aprovados, cobrindo conteúdo, metadados, CMS, links internos, redirecionamentos e sitemap. Contraste dos textos e botão verificado por cálculo (mínimo 6,37:1). A inspeção visual em desktop/celular, navegação real por teclado e medição de overflow permanecem pendentes: a política de segurança do navegador bloqueou o acesso à prévia local nesta sessão. O ciclo real de edição pelo CMS e deploy depende da conexão às contas.

## Estrutura

- `src/pages`: início, 404, robots e sitemap.
- `src/archived-pages`: templates de Sobre, Iniciativas e Publicações, sem geração pública.
- `src/components`: seções reutilizáveis da página inicial e listagens.
- `src/layouts`: documento HTML e metadados compartilhados.
- `src/content`: textos, configurações públicas e coleções editoriais.
- `src/content.config.ts`: esquemas de validação das coleções Astro.
- `src/config/site.ts`: validação das configurações públicas.
- `src/styles/global.css`: estrutura e regras responsivas; `brand.css`: identidade oficial; `landing.css`: composição da versão atual.
- `public/uploads`: imagens editoriais.
- `.pages.yml`: interface editorial do Pages CMS.

## Editar conteúdo

### Publicações (expansão futura)

Crie `src/content/publicacoes/titulo-do-artigo.md` (nome sem espaços ou acentos). O nome define `/publicacoes/titulo-do-artigo/`; evite renomear após publicar, pois isso muda o endereço. Campos:

```yaml
---
title: Título do artigo
description: Resumo para listagens e compartilhamento.
date: 2026-10-15
author: Nome da autoria
draft: true
tags: [Análise]
image: /uploads/capa.webp
imageAlt: Descrição acessível do conteúdo da imagem.
---
Texto em Markdown.
```

`image` e `imageAlt` podem ser omitidos quando não há capa. Uma imagem exige texto alternativo. `draft: true` exclui a publicação das listagens, páginas individuais e sitemap. Campo ausente também equivale a rascunho. Rascunhos **não são sigilosos**: continuam visíveis no repositório público. Não há agendamento: a data organiza a listagem, mas `draft: false` publica no próximo deploy, mesmo com data futura. Datas são exibidas em UTC para evitar mudança de dia no Brasil.

O exemplo editorial fornecido permanece em rascunho. A listagem inicial vazia é intencional, sem artigos oficiais inventados.

### Iniciativas e textos institucionais (expansão futura)

Crie Markdown em `src/content/iniciativas/` com `title`, `description`, `status`, `draft` e corpo. Situações aceitas: `Em apresentação`, `Em desenvolvimento`, `Em atividade`, `Concluída`. Imagem opcional e lista `links: [{ label: Texto, url: https://... }]`. Cada iniciativa publicada ganha página própria automaticamente.

Mantenha o arquivo `trama-legislativa.md`: seu identificador conecta o botão à URL centralizada. Seu status inicial descreve a apresentação no portal, não afirma o estágio de desenvolvimento da aplicação. A descrição completa ainda precisa de validação institucional.

Edite a página Sobre em `src/content/institucional/sobre.md`. Edite abertura, resumo, participação e canais em `src/content/site.json`. Os campos provisórios foram mantidos para compatibilidade com os templates arquivados; nenhum aviso aparece na landing page. Campos de URL opcionais vazios ocultam os respectivos links; o portal não inventa perfis ou endereços.

### Identidade visual

Identidade aplicada conforme o manual `BRASILIDADE IDV.pdf` fornecido pelo usuário. Paleta: verde `#2EA452`, amarelo `#FFE92D`, creme `#F1EDE9`. Logo e símbolo extraídos da arte oficial; slogan “O Brasil que vive”. A tipografia Pathway Extreme é servida localmente com licença OFL. A Extenda é preservada na imagem do logotipo; a versão trial local não permite redistribuição como webfont, então textos dinâmicos usam Pathway Extreme.

As regras da marca ficam em `src/styles/brand.css`, separadas da estrutura responsiva. Tons escuros de apoio mantêm contraste de texto. Consulte `public/brand/README.md` para origem dos assets e decisões de aplicação. A landing page não exibe avisos provisórios.

## Pages CMS

1. Publique este projeto em um repositório da organização `Movimento-Brasilidade` (o nome e o remoto ainda precisam ser definidos).
2. Acesse [Pages CMS](https://app.pagescms.org), autentique-se pelo GitHub e autorize/instale a integração somente no repositório necessário. A organização pode exigir aprovação de um administrador.
3. Abra o repositório e a branch escolhida. O CMS lê `.pages.yml` na raiz e apresenta Landing page e Instagram, coleções reservadas para expansão e mídia.
4. Configure os integrantes autorizados. A documentação atual descreve usuários GitHub com acesso ao repositório e colaboradores convidados por e-mail, que podem editar conteúdo/mídia; estes não gerenciam configuração ou colaboradores. As gravações destes últimos usam o token da instalação do GitHub App.
5. Faça um teste com rascunho, upload e revisão do commit; confirme que os campos persistem corretamente. Só depois habilite o fluxo de produção.

Os controles de operações no YAML não substituem as permissões GitHub. A configuração local está preparada, mas autorização, convites e edição real dependem de acesso externo e não foram efetuados.

### Revisão editorial

Não se presume um fluxo nativo obrigatório de aprovação editorial. O CMS grava arquivos no GitHub; uma gravação em `main` pode acionar publicação imediata pelo Cloudflare. `draft` é uma convenção deste portal, não uma permissão nem uma barreira de aprovação.

Para revisão simples, selecione uma branch `editorial` no CMS, grave nela, abra um pull request para `main` no GitHub e revise a prévia do Cloudflare. Configure proteção de `main` exigindo revisão e o check `build`, restringindo bypass inclusive da integração. Confirme numa edição de teste que os colaboradores conseguem selecionar a branch prevista e que não conseguem contornar a proteção. Não há painel de aprovação próprio. Se a interface/permissão da instância não permitir esse fluxo, concentre a publicação em um editor responsável com revisão combinada antes de salvar em `main`.

Referências verificadas em 15/10/2026: [conteúdo e campos](https://pagescms.org/docs/configuration/content/), [mídia](https://pagescms.org/docs/configuration/media/), [colaboradores](https://pagescms.org/docs/configuration/collaborators/), [autenticação](https://pagescms.org/docs/development/authentication/).

## GitHub e Cloudflare Pages

A pasta recebida não tinha `.git`. Não foi criado remoto, repositório ou deploy externo. Após escolher/criar o repositório na organização, inicialize Git, faça o primeiro commit e envie para `main`. Não inclua documentos internos ou credenciais. O `.gitignore` exclui ambiente local, dependências e saída do build.

No Cloudflare, use Workers & Pages → Pages → importar repositório Git:

| Configuração | Valor |
| --- | --- |
| Branch de produção | `main` |
| Comando de build | `npm run build` |
| Diretório de saída | `dist` |
| Raiz do projeto | raiz do repositório |
| `NODE_VERSION` | `22.22.0` |
| `SITE_URL` em produção | URL HTTPS pública final, sem caminho |

Não é necessário adaptador Cloudflare: a saída é totalmente estática. Cada push na branch de produção gera novo deploy; branches/PRs podem gerar previews. O workflow GitHub incluído valida build e testes em pushes e PRs.

`SITE_URL` tem prioridade sobre `publicUrl` em `site.json`. Configure um domínio próprio na área de domínios do Pages e atualize essa URL. Sem URL configurada, o portal emite `noindex`, bloqueia rastreamento e omite canonical para não inventar domínio. Para previews, deixe `SITE_URL` vazio e `publicUrl` vazio; configure `SITE_URL` apenas no ambiente de produção. Se preencher `publicUrl`, as prévias também poderão ser indexadas: prefira manter esse campo vazio e usar a variável por ambiente. Não use segredos nessa configuração pública.

Procedimento final: validar apresentação, Instagram e identidade; executar build/testes; conectar CMS e Cloudflare; verificar navegação móvel, metadados no domínio real e um ciclo completo de edição → commit → deploy.

[Guia oficial Cloudflare para Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

## Operação e limites

- Sem dados pessoais coletados, cookies de rastreamento ou recursos externos carregados pela interface.
- Conteúdo é público, inclusive arquivos em rascunho e imagens enviadas. Nunca armazene listas de integrantes, atas privadas ou credenciais.
- Markdown destina-se a editores confiáveis; código/HTML não deve ser colado de fontes desconhecidas. Revise alterações no GitHub.
- Para corrigir uma publicação, edite e salve; para retirá-la, ative o rascunho. O próximo deploy aplica a mudança. Mídia publicada e histórico Git não são apagados por isso.
- Se o build falhar, consulte o log; a versão anterior permanece no ar. Reverta o commit problemático e publique novamente. Guarde o histórico Git e revise atualizações de dependências periodicamente.
- Sem CMS próprio, aprovação automática, agendamento, comentários, busca avançada, newsletter ou integração com APIs da Trama.
