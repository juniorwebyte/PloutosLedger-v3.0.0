-- SEGURANÇA AVANÇADA RLS - PLOUTOSLEDGER V3.0.0
-- Este script reforça o isolamento de dados entre usuários.

-- 1. Garantir que o RLS está ativo em todas as tabelas críticas
ALTER TABLE ploutos_cashflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE ploutos_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ploutos_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Limpar políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Users can view their own transactions" ON ploutos_cashflow;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON ploutos_cashflow;

-- 3. Políticas para CashFlow (Isolamento por User ID)
CREATE POLICY "CashFlow_Select_Policy" ON ploutos_cashflow
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "CashFlow_Insert_Policy" ON ploutos_cashflow
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "CashFlow_Update_Policy" ON ploutos_cashflow
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "CashFlow_Delete_Policy" ON ploutos_cashflow
FOR DELETE USING (auth.uid() = user_id);

-- 4. Políticas para Inventory (Visibilidade Global, Escrita Restrita)
-- Nota: Em um sistema multi-tenant real, o inventory também teria user_id ou company_id.
CREATE POLICY "Inventory_Select_Policy" ON ploutos_inventory
FOR SELECT USING (true); -- Todos autenticados podem ver produtos

CREATE POLICY "Inventory_Admin_Policy" ON ploutos_inventory
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- 5. Políticas para Audit Logs (Apenas leitura do próprio usuário)
CREATE POLICY "Audit_Select_Policy" ON ploutos_audit_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Audit_Insert_System" ON ploutos_audit_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Função para Auto-preenchimento de User ID (Trigger)
-- Isso garante que o usuário não possa "forjar" o user_id de outra pessoa no insert.
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_set_cashflow_user_id
BEFORE INSERT ON ploutos_cashflow
FOR EACH ROW EXECUTE FUNCTION set_user_id();
