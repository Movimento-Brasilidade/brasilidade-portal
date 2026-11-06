# Roadmap evolutivo do Portal Brasilidade

Base inspecionada: commit `3dd705e`. Este documento planeja evolução; não autoriza implementação ou migração. Fases indicam sequência lógica, sem datas ou estimativas. IDs permanecem estáveis quando stories forem revisadas.

## Situação atual e evidências

| Área | Existente e verificado no repositório | Limite da verificação |
| --- | --- | --- |
| Portal público | Landing de lançamento, marca oficial, mensagem “Está chegando” e Instagram; sem menu de múltiplas páginas. [Entrada](../src/pages/index.astro), [layout](../src/layouts/Base.astro), [configuração editorial](../src/content/site.json). | Não é o portal institucional completo. |
| Responsividade | CSS para desktop e celular, foco visível e link para pular ao conteúdo. [Estilos](../src/styles/landing.css). | Inspeção visual, teclado, zoom e ausência de rolagem horizontal ainda precisam de validação no navegador. CSS existente não comprova essa validação. |
| Conteúdo preservado | Coleções `publications`, `initiatives` e `institutional`, Markdown, componentes e [templates arquivados](../src/archived-pages). | Sobre, Iniciativas, Publicações e Trama não geram páginas editoriais públicas; seus caminhos conhecidos redirecionam à landing. |
| Publicações | [Schema](../src/content.config.ts) com título, resumo, data, autoria textual, rascunho, tags, imagem e texto alternativo. Exemplo editorial em rascunho. | Não há campos estruturados de tipo, macroáreas, destaque ou relação com iniciativas; nem filtros públicos. |
| CMS | [.pages.yml](../.pages.yml) configura conteúdo, mídia, landing e coleções reservadas. | Arquivo configurado não comprova conexão, convites, permissões ou ciclo editorial real. |
| Hospedagem | Astro estático, base `/brasilidade-portal`, domínio `movimento-brasilidade.github.io`; [workflow](../.github/workflows/check.yml) compila, testa e publica em `main`. | Deploy do commit-base foi confirmado na sessão anterior. Configurações remotas, disponibilidade atual e proteção de branch não foram consultadas nesta tarefa. |
| Qualidade | [Seis testes](../tests/portal.test.mjs) cobrem HTML, conteúdo, CMS, links, rascunho, redirecionamentos, canonical e sitemap. Build e testes passaram no commit-base. | Não foram reexecutados nesta tarefa documental; não substituem testes de CMS nem de interface. |
| Domínio e provedores | Não há `CNAME` em `public`; configuração aponta para `github.io`. `_headers` e `_redirects` preservam regras de Cloudflare. | Domínio personalizado não está comprovado; regras Cloudflare não operam no GitHub Pages. |

O [README](../README.md) contém comandos e instruções operacionais. Suas seções históricas ainda mencionam ausência de Git/remoto, Cloudflare e configuração antiga de indexação; não devem ser tomadas como prova do estado atual. Corrigir essas divergências faz parte de BR-002, sem duplicar aqui o guia de operação.

## Arquitetura: decisões estabelecidas e propostas

**Estabelecido no código:** Astro 5 com saída estática, conteúdo em Markdown/JSON, validação por schemas, assets e fonte locais, Pages CMS configurado sobre arquivos Git, deploy por GitHub Actions. A landing não coleta dados nem implementa autenticação. Componentes e coleções foram preservados para expansão.

**Diretrizes deste roadmap:** manter o portal público estático enquanto suficiente; evoluir a coleção de publicações existente, sem uma coleção por tipo de texto. Trama Legislativa permanece aplicação pública independente, vinculada à identidade Brasilidade por apresentação, links e referências editoriais. Portal interno é iniciativa independente. Não compartilhar código de aplicação, banco de dados ou autenticação da Trama com o portal.

**Ainda não decidido:** taxonomia editorial, modelo final de autoria, permissões de colaboradores, mecanismo verificável de aprovação, domínio próprio, privacidade do repositório e eventual Vercel. Não são decisões arquiteturais aprovadas por aparecerem neste documento.

## Fase 0 — Consolidar o MVP público

### BR-001 — Landing pública estática
- **ID:** BR-001
- **Título:** Disponibilizar apresentação mínima e Instagram.
- **Objetivo:** Oferecer uma presença pública simples enquanto o portal evolui.
- **Critérios de aceitação:** Landing com identidade e CTA oficial; saída estática; assets e canonical na base do GitHub Pages; rotas antigas conhecidas redirecionadas; build e seis testes aprovados; workflow de deploy concluído no commit-base.
- **Prioridade:** MVP
- **Status:** concluído

### BR-002 — Fechar a validação operacional do MVP
- **ID:** BR-002
- **Título:** Confirmar qualidade pública e instruções de operação atuais.
- **Objetivo:** Encerrar lacunas de validação sem ampliar a landing.
- **Critérios de aceitação:** Registrar conferência desktop/celular, teclado, foco, zoom, contraste da versão atual e ausência de overflow; verificar Instagram, assets, 404 e redirecionamentos publicados; confirmar Source = GitHub Actions sem build concorrente; atualizar trechos históricos conflitantes do README, inclusive indexação e domínio; documentar responsável e procedimento de reversão.
- **Dependências:** BR-001.
- **Prioridade:** MVP
- **Status:** pendente

## Fase 1 — Conteúdo institucional e operação editorial

### BR-003 — Consolidar apresentação e iniciativas públicas
- **ID:** BR-003
- **Título:** Abrir páginas institucionais apenas com conteúdo aprovado.
- **Objetivo:** Explicar o movimento e suas iniciativas sem páginas vazias ou textos provisórios.
- **Critérios de aceitação:** Validar apresentação institucional e selecionar iniciativas publicáveis; definir navegação mínima; revisar templates preservados antes de reativá-los; ajustar links, imagens e URLs à base de hospedagem; retirar apenas os redirecionamentos substituídos por páginas reais; atualizar sitemap e testes; conferir navegação responsiva. Manter linguagem abrangente, sem recolocar os princípios retirados da apresentação.
- **Dependências:** Aprovação institucional dos textos e iniciativas.
- **Prioridade:** próxima evolução
- **Status:** pendente

### BR-004 — Validar edição por colaboradores no Pages CMS
- **ID:** BR-004
- **Título:** Editar landing, artigos e iniciativas sem exigir conhecimento de código.
- **Objetivo:** Dar autonomia editorial com o menor acesso necessário.
- **Critérios de aceitação:** Testar conexão e convite com conta de colaborador; criar e editar conteúdo, mídia e rascunhos; conferir arquivos persistidos e erros de validação; registrar o que essa conta pode ler e alterar, inclusive acesso ao código; validar opções de acesso por convite antes de conceder permissões GitHub amplas; produzir instrução curta de uso.
- **Prioridade:** próxima evolução
- **Status:** pendente

### BR-005 — Tornar revisão anterior à publicação verificável
- **ID:** BR-005
- **Título:** Garantir que alterações editoriais aguardem aprovação.
- **Objetivo:** Evitar publicação acidental por gravações diretas em `main`.
- **Critérios de aceitação:** Definir autores, revisores e publicador; testar se CMS permite trabalhar em branch editorial; validar pull request, revisão obrigatória e checks com proteção de `main`, inclusive comportamento do GitHub App e bypass; comprovar que alteração não aprovada não publica. Se a combinação não funcionar, registrar limitação e adotar publicação centralizada por responsável ou avaliar outra ferramenta antes de abrir edição ampla. Não tratar `draft` como permissão, sigilo ou aprovação.
- **Dependências:** BR-004; definição dos responsáveis e verificação das capacidades do plano/conta.
- **Prioridade:** próxima evolução
- **Status:** pendente

## Fase 2 — Blog e descoberta de conteúdo

### BR-006 — Evoluir o modelo editorial existente
- **ID:** BR-006
- **Título:** Classificar publicações sem multiplicar coleções.
- **Objetivo:** Organizar artigos, análises, notícias, estudos e notas institucionais.
- **Critérios de aceitação:** Aprovar vocabulários de tipo e macroáreas; uma publicação aceita um tipo e várias macroáreas; representar autoria individual ou institucional de forma consistente; preservar corpo Markdown, datas, imagens com descrição, resumo SEO e URLs estáveis; alinhar schema e CMS; definir compatibilidade dos arquivos existentes e testar conteúdo inválido. Não criar cadastro de autores ou coleção por tipo sem necessidade comprovada.
- **Dependências:** Decisão editorial sobre vocabulários e autoria.
- **Prioridade:** próxima evolução
- **Status:** pendente

### BR-007 — Publicar listagem e páginas individuais
- **ID:** BR-007
- **Título:** Ler e localizar publicações aprovadas.
- **Objetivo:** Transformar a estrutura preservada em um blog público utilizável.
- **Critérios de aceitação:** Listagem e páginas individuais funcionam na base publicada; ordenação por data determinística; filtros por tipo e macroárea com opção de limpar e resultado vazio compreensível; URLs amigáveis preservadas após edição; capa, autoria, data, canonical e metadados corretos; rascunhos ausentes da listagem, rotas, destaques e sitemap. Política de datas futuras explícita: atualmente não existe agendamento. Testar publicação e retirada de conteúdo, links e uso por teclado/celular.
- **Dependências:** BR-006; BR-005 antes de liberar publicação colaborativa; conteúdo inicial aprovado.
- **Prioridade:** próxima evolução
- **Status:** pendente

### BR-008 — Destacar conteúdo e relacionar iniciativas
- **ID:** BR-008
- **Título:** Conectar a página inicial ao acervo e às iniciativas públicas.
- **Objetivo:** Dar caminhos de leitura sem duplicar conteúdo editorial.
- **Critérios de aceitação:** Definir seleção simples de destaques; não exibir rascunhos nem blocos vazios na home; relacionar publicações a iniciativas por identificadores estáveis quando necessário; validar referências inexistentes; oferecer links para iniciativas publicadas sem expor as ainda reservadas. Uma relação opcional resolve o vínculo, sem novo sistema de conteúdo.
- **Dependências:** BR-003 e BR-007.
- **Prioridade:** próxima evolução
- **Status:** pendente

## Fase 3 — Integração institucional com a Trama

### BR-009 — Apresentar a Trama como aplicação independente
- **ID:** BR-009
- **Título:** Oferecer acesso público e contexto editorial da Trama Legislativa.
- **Objetivo:** Conectar as iniciativas sob a identidade Brasilidade sem fundir aplicações.
- **Critérios de aceitação:** Confirmar URL pública e apresentação oficial; substituir o conteúdo provisório preservado; publicar link identificável e referências em textos pertinentes; verificar destino e identidade. Nenhuma incorporação de código, banco, API privada ou autenticação da Trama ao portal.
- **Dependências:** BR-003; validação da URL e do texto por responsável pela Trama. Relações editoriais estruturadas dependem de BR-008.
- **Prioridade:** próxima evolução
- **Status:** pendente

## Fase 4 — Avaliar infraestrutura, sem migração aprovada

### BR-010 — Decidir se há motivo para mudar hospedagem ou visibilidade
- **ID:** BR-010
- **Título:** Comparar GitHub Pages e Vercel com requisitos reais.
- **Objetivo:** Evitar migração por antecipação e esclarecer acesso ao conteúdo-fonte.
- **Critérios de aceitação:** Registrar necessidade concreta, responsáveis e decisão de permanecer ou migrar; consultar condições oficiais vigentes dos planos, custos, limites de build/tráfego, repositórios de organização e privados, colaboração e compatibilidade com uso institucional; validar integração Git/CMS e permissões; confirmar existência, titularidade e acesso DNS de eventual domínio personalizado. Não presumir gratuidade ou elegibilidade a plano pessoal. Definir se há necessidade real de repositório privado e quais arquivos precisam de confidencialidade.
- **Prioridade:** futuro
- **Status:** pendente

### BR-011 — Migrar somente mediante aprovação
- **ID:** BR-011
- **Título:** Preservar publicação e URLs em eventual mudança para Vercel.
- **Objetivo:** Trocar o provedor sem interromper o acesso ou a rotina editorial.
- **Critérios de aceitação:** Aprovação registrada; build estático portátil sem adaptador ou backend desnecessário; validar `site`, `base`, assets, canonical, sitemap, 404 e redirecionamentos no destino; testar CMS → revisão → publicação e reversão; se aprovado tornar o repo privado, validar acesso do CMS, CI e hospedagem antes da troca; preservar domínio personalizado e HTTPS caso sua existência seja confirmada, ou decidir domínio sem presumir que já existe; planejar continuidade dos links antigos e retorno ao provedor anterior antes de mudar DNS.
- **Dependências:** BR-010 e aprovação explícita da migração; BR-005 para preservar o fluxo editorial aprovado.
- **Prioridade:** futuro
- **Status:** bloqueado

## Fase 5 — Portal interno independente

### BR-012 — Definir necessidade do ambiente interno
- **ID:** BR-012
- **Título:** Delimitar uma iniciativa separada para trabalho interno.
- **Objetivo:** Tratar necessidades de integrantes sem ampliar o risco do portal público.
- **Critérios de aceitação:** Registrar usuários, problemas, responsáveis, dados envolvidos e justificativa; decidir escopo e local de documentação próprios antes de implementação. Não adicionar autenticação, gestão de membros ou dados internos ao portal público como parte deste roadmap.
- **Prioridade:** futuro
- **Status:** pendente

## Decisões pendentes e o que realmente bloqueiam

| Decisão/validação | Etapa afetada | Efeito |
| --- | --- | --- |
| Conteúdo institucional e iniciativas aprovados | BR-003 | Bloqueia sua publicação, não a landing existente. |
| Papéis editoriais, permissões reais do CMS e proteção de branch | BR-005 e abertura colaborativa de BR-007 | Sem validação não há garantia de revisão obrigatória ou acesso mínimo. |
| Tipos, macroáreas e autoria | BR-006 | Necessário antes de estabilizar schema e filtros; não exige migrar hospedagem. |
| URL e apresentação oficial da Trama | BR-009 | Bloqueia o link institucional; não bloqueia o blog. |
| Justificativa, custos/planos, domínio, privacidade e aprovação da migração | BR-011 | Migração bloqueada; evolução editorial pode continuar no GitHub Pages. |

Não há story “em andamento”: esta tarefa apenas documenta. “Pendente” indica trabalho ainda não iniciado, mesmo quando precisa de uma decisão editorial. “Bloqueado” em BR-011 explicita que não existe autorização para executá-la.

## Revisão crítica — Ponytail full

- **Reutilizar:** coleções, schema, CMS e templates já existem. Estender campos e revisar componentes antes de cogitar reescrita, banco ou CMS próprio.
- **Não reativar às cegas:** `entryUrl` em `src/lib/content.ts`, links dos templates arquivados e caminhos de mídia ainda usam raiz (`/publicacoes/`, `/uploads/`). O ajuste da landing ao GitHub Pages não torna esses caminhos compatíveis automaticamente. BR-003 e BR-007 incluem essa verificação e a revisão dos redirecionamentos.
- **Segurança editorial:** `draft` oculta conteúdo no build, não no Git. Repositório privado não elimina exposição em arquivos gerados, mídia pública ou histórico anterior. Evitar material sigiloso no portal; confirmar permissões com conta real.
- **Estado preservado não é aprovação:** a Trama está com `draft: false`, links vazios e texto provisório. Restaurar rotas sem revisar conteúdo pode publicá-la indevidamente. BR-003/009 exigem validação anterior.
- **Aprovação não é um campo:** YAML do CMS não comprova permissões granulares nem revisão nativa. Validar branch/App/plano; se não atender, começar com publicador responsável, sem construir um sistema de aprovação próprio.
- **Manter pequeno:** uma coleção de publicações; tipos e macroáreas como campos; filtros simples; vínculo opcional a iniciativas. Sem cadastro de autores, busca externa, agendamento ou serviços novos sem demanda demonstrada.
- **Portabilidade antes de migração:** site estático já atende o uso público. Vercel, domínio e repo privado são decisões separadas, não pré-requisitos para o blog. Revisar caminhos e contratos de hospedagem somente quando necessário.
- **Dívida delimitada:** instruções históricas conflitantes, campos legados e estilos de seções arquivadas merecem revisão ao retomar essas áreas. Não realizar limpeza ampla agora; preservar componentes foi decisão explícita.

**Resultado:** plano incremental, sem novas dependências ou arquitetura especulativa. Primeiro fechar a validação pública e a governança editorial; depois abrir conteúdo. Não foram consultados planos comerciais atuais, permissões remotas, DNS ou sessões do CMS; sua validação está registrada nas stories correspondentes.

## Como manter

Atualizar status somente com evidência vinculada (commit, teste, validação editorial ou registro de decisão). Ao concluir, acrescentar a evidência na story; não renumerar IDs. Manter comandos e operação no README, decisões aprovadas nesta seção de arquitetura e entregas nas fases. Mudanças de prioridade não implicam aprovação de execução.
