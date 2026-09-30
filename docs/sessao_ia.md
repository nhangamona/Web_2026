# Registro da Sessão de Inteligência Artificial
**Avaliação Individual P1 - Desenvolvimento Webmobile**  
**Universidade Federal do Tocantins (UFT)**  
**Aluno:** Laurinda Nhaga Mona  
**Matrícula:** 2020111950  
**Docente:** Jackson Gomes de Souza  

---

## Finalidade do Documento
Em estrito cumprimento às instruções da **Seção 5 (Entrega)** do roteiro da prova:
> *"Se você tiver utilizado IA, também deve ser entregue a sessão completa (prompts de entrada e saída)."*

Este documento reúne a relação e transcrição dos comandos de entrada (*prompts*) submetidos pelo estudante e as respectivas respostas/soluções técnicas desenvolvidas (*outputs*), registrando a transparência e rastreabilidade de todas as interações.

---

## 1. Relação Cronológica dos Prompts de Entrada (Inputs do Estudante)

| # | Prompt de Entrada do Aluno | Contexto / Intenção |
|---|---|---|
| **1** | *"Preciso criar este projeto do inicio"* | Início da construção da arquitetura e configuração inicial. |
| **2** | *"quantos porcento ja está concluido?"* | Checagem de progresso frente aos requisitos da rubrica. |
| **3** | *"para que serve essas imagens ?"* | Compreensão dos assets de interface do comerciante. |
| **4** | *(Envio das 4 perguntas conceituais da Seção 9 do roteiro)* | Solicitação de fundamentação teórica sobre Provider, Estado Local/Derivado, Deep Linking e Imutabilidade. |
| **5** | *"`useState<Produto[]>([])`.onde se encontra?"* | Localização e verificação da fonte de verdade central no Provider. |
| **6** | *"Produto Único inativo cadáver não momento. corrigir esse texto?"* | Correção ortográfica das mensagens de estado vazio da lista. |
| **7** | *"volta todos os linkes nas respostas"* | Solicitação de referências cruzadas clicáveis aos arquivos de código fonte. |
| **8** | *"vamos guardar e testar"* | Verificação de tipos TypeScript (`npx tsc --noEmit`) e estabilidade. |
| **9** | *"Validação e conversão do preço conforme RF2 (0,4). Cadastro único, limpeza do formulário e retorno para a tela inicial. como fazer essa opção?"* | Implementação e validação detalhada dos requisitos de cadastro do RF2 e Cenário 4. |
| **10** | *"está tudo guardado no git? tinha que criar uma develop"* | Gestão de ramificação Git e garantia de versionamento na branch `develop`. |
| **11** | *"Fiz alteração no readme, la no git como salvar"* | Procedimentos de commit e sincronização com o repositório remoto. |
| **12** | *"Deve existir uma rota dinâmica identificada pelo id do produto, como /produtos/[id]. em qual parte do código se encontra"* | Verificação e explicação da implementação do Expo Router e Deep Linking no arquivo `app/produtos/[id].tsx`. |
| **13** | *"sessão completa prompts de entrada e saída quais o professor se refere?"* | Esclarecimento sobre os requisitos de entrega ética e documental exigidos pelo professor. |
| **14** | *"me dê a relação das perguntas"* | Extração e consolidação das perguntas avaliativas e dos prompts da sessão. |
| **15** | *"Capturas de tela ou vídeo podem complementar a entrega, mas o código executável é obrigatório.. vamos por essa opção"* | Execução automatizada e documentação visual completa dos 9 cenários de teste da Tabela 2 em alta resolução e animação GIF. |
| **16** | *"o sistema tem a opção editar, excluir e listar? se não tem inclua essas opcões"* | Consulta sobre os recursos de CRUD (Listar, Editar, Excluir) e análise de aderência ao escopo da prova. |
| **17** | *"adicione, deixa a interface como está nessa imagem:"* | Inclusão das funcionalidades de Editar e Excluir com preservação fiel da interface da tela inicial conforme a imagem de referência. |

---

## 2. Síntese das Saídas Técnicas Geradas (Outputs da IA)

1. **Arquitetura de Estado e Provider:**
   - Criação do `ProdutosProvider` montado no topo da pilha no layout raiz (`app/_layout.tsx`), encapsulando todas as rotas com o contexto `src/context/ProdutosContext.tsx`.
   - Garantia de imutabilidade estrita via `.map()` e *spread operator* na função `alternarSituacaoProduto`.
   - Derivação dinâmica das listas `produtosAtivos` e `produtosInativos` via `useMemo`.

2. **Roteamento Dinâmico e Resiliência:**
   - Rota baseada em arquivo `app/produtos/[id].tsx` consumindo o ID por `useLocalSearchParams`.
   - Implementação de fallback com `router.canGoBack()` e `router.replace('/')` para acesso direto via deep linking sem histórico.
   - Tratamento com feedback visual e botão funcional para IDs inexistentes (Cenário 8).

3. **Validação e Acessibilidade:**
   - Funções isoladas em `src/utils/validador.ts` atendendo a todos os casos do Cenário 4 (rejeição de 0, números negativos, letras, casas decimais excedentes e espaços em branco).
   - Preservação dos dados digitados após falha de validação.

4. **Conferência Automatizada e Evidências:**
   - Geração de 11 capturas de tela cobrindo todos os cenários da Tabela 2 na pasta `docs/evidencias/`.
   - Compilação de demonstração contínua em formato `demonstracao_completa.gif`.
