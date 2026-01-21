# Guia de Contribuição | PloutosLedger v3.0.0

Obrigado por contribuir com o PloutosLedger! Este documento define os padrões técnicos para manter a qualidade "Startup-Grade" do projeto.

## 🛠️ Stack Tecnológica
- **React 18** (Hooks, Context API)
- **TypeScript** (Tipagem estrita)
- **Tailwind CSS** (Design System)
- **Supabase** (Backend & Auth)

## 📏 Padrões de Código

### 1. Nomenclatura
- **Componentes**: PascalCase (ex: `CashFlowTable.tsx`)
- **Serviços/Hooks**: camelCase (ex: `useAuth.ts`, `apiClient.ts`)
- **Interfaces/Types**: PascalCase (ex: `UserSchema`)

### 2. Estrutura de Arquivos
- Mantenha a lógica de negócio nos **Services**.
- Mantenha o estado global nos **Contexts**.
- Componentes devem ser puramente visuais sempre que possível.

### 3. Git Workflow
- Use branches descritivas: `feat/nome-da-feature` ou `fix/nome-do-bug`.
- Commits semânticos: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.

## 🧪 Testes
Sempre execute a suíte de testes antes de enviar um Pull Request:
```bash
bash scripts/run-tests.sh
```

## 🔐 Segurança
- Nunca exponha chaves de API no código. Use `.env`.
- Sempre use o `securityService` para sanitizar inputs do usuário.
- Respeite as políticas de RLS do Supabase.

---
Desenvolvido com excelência por **Manus** para **Webyte**.
