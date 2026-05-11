# DevInsight - Plugin de Análise Evolutiva de Código para VS Code

O **DevInsight** é uma extensão para o Visual Studio Code projetada para atuar como um mentor técnico automatizado. Ele não apenas analisa o código atual, mas registra e interpreta a evolução das práticas de programação do desenvolvedor ao longo do tempo.

## Objetivo
Fornecer feedback contínuo e personalizado para estudantes e desenvolvedores júnior, identificando hábitos de escrita, padrões de dificuldade e sugerindo melhorias concretas baseadas no histórico real de desenvolvimento.

## Inteligência e Análise
O plugin utiliza um motor de análise em múltiplas camadas para oferecer um diagnóstico profundo:

* **Análise de Código (AST):** Utiliza o `@babel/parser` para decompor o código JavaScript e extrair métricas precisas como contagem de funções, complexidade de nesting e uso de padrões modernos (ES6+).
* **Perfil Comportamental:** Identifica vícios de programação (como uso excessivo de `var` ou `console.log`) e resistências a modernizações, transformando dados brutos em tendências de comportamento.
* **Motor de Evolução:** Compara snapshots históricos para detectar se a qualidade do código está melhorando, estabilizada ou regredindo em termos de modularização e boas práticas.
* **Mentoria por IA:** Integra-se ao Claude-3 Haiku (via OpenRouter) para gerar insights humanos e diretos, contextualizados pelo perfil consolidado do desenvolvedor.

## Funcionalidades Principais
* **Dashboard em Tempo Real:** Uma sidebar intuitiva que exibe métricas de funções, uso de variáveis e a dica atual do mentor.
* **Histórico Comparativo (Diff):** Funcionalidade "O que mudou:" que permite visualizar lado a lado a versão anterior e a atual do código, destacando a evolução técnica.
* **Persistência Local:** Utiliza NeDB para armazenar o histórico de snapshots de forma leve e segura diretamente na máquina do usuário.
* **Mecanismo de Debounce:** Otimização de performance e economia de cota de API através de atraso inteligente no processamento após o salvamento de arquivos.

## Tecnologias Utilizadas
* **Ambiente:** Node.js
* **Framework:** VS Code Extension API
* **Parser de Código:** Babel (@babel/parser, @babel/traverse)
* **Banco de Dados:** NeDB (@seald-io/nedb)
* **Integração de IA:** OpenRouter API (Anthropic Claude-3 Haiku)

## Instalação e Uso
1. Clone o repositório.
2. Execute `npm install` para instalar as dependências.
3. Configure sua chave de API no arquivo `.env` (exemplo em `.env.example`).
4. Pressione `F5` no VS Code para iniciar a depuração e testar a extensão em uma nova janela.
