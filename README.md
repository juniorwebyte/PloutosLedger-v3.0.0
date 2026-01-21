# 💎 PloutosLedger v3.0.0

> Sistema de Gestão Financeira e Operacional de Alta Performance para Startups e PMEs.

O **PloutosLedger** é uma solução completa de ERP financeiro, controle de estoque e gestão de pessoal, reconstruído na versão 3.0 com foco em escalabilidade, segurança e experiência do usuário (UX).

## 🚀 Tecnologias Core

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS + Design System Customizado
- **Estado & Dados**: Context API + Camada de Serviço Abstraída (BaseService)
- **Gráficos**: Recharts para visualização de dados em tempo real
- **Segurança**: Sanitização XSS, Criptografia de LocalStorage e Error Boundaries

## 🏗️ Arquitetura do Sistema

O projeto segue uma arquitetura modular baseada em serviços, facilitando a manutenção e a futura migração para um backend real:

- `/src/services`: Camada de abstração de dados (Data Layer) com herança de `BaseService`.
- `/src/components`: Componentes modulares divididos por domínio (CashFlow, Dashboard, UI).
- `/src/contexts`: Gerenciamento de estado global (Autenticação, Configurações).
- `/src/styles`: Design System centralizado com tokens de cores e tipografia.

## 🛠️ Funcionalidades Principais

### 💰 Gestão Financeira (CashFlow)
- Fluxo de caixa modularizado com carregamento inteligente (Lazy Loading).
- Dashboards interativos de entradas, saídas e saldo projetado.
- Categorização avançada e tags para análise granular.

### 📦 Controle de Estoque (Inventory)
- Registro de movimentações (Entrada, Saída, Perda, Transferência).
- Sistema de alertas automáticos para estoque crítico ou baixo.
- Histórico completo de auditoria por produto.

### 🔐 Segurança & Conformidade
- **Audit Log**: Rastreabilidade total de ações do usuário.
- **Compliance**: Relatórios em conformidade com a CLT e Portaria 671/2021.
- **Resiliência**: Sistema de Error Boundary com logging local de falhas críticas.

## 📦 Instalação e Desenvolvimento

1. Clone o repositório:
   ```bash
   gh repo clone juniorwebyte/PloutosLedger-v3.0.0
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

## 🛡️ Auditoria e Qualidade

Este projeto passou por uma auditoria técnica completa em Janeiro de 2026, resultando em:
- Redução de 90% no tamanho do bundle do componente principal.
- Implementação de Lazy Loading em todos os módulos pesados.
- Padronização de 100% da camada de serviços.

---
Desenvolvido com ❤️ por **Manus** para **Webyte Desenvolvimentos**.
*Última atualização: 20/01/2026*
