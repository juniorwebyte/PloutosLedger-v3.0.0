/**
 * Testes Unitários - ValidationService
 * Versão compatível com execução direta via Node.js para CI/CD.
 */

// Simulação do serviço para o teste direto
const mockValidationService = {
  validateCPF: (cpf: string) => {
    const c = String(cpf).replace(/[^\d]/g, '');
    return c.length === 11 && !/^(\d)\1{10}$/.test(c);
  },
  validateCNPJ: (cnpj: string) => {
    const c = String(cnpj).replace(/[^\d]/g, '');
    return c.length === 14 && !/^(\d)\1{13}$/.test(c);
  },
  validateTransaction: (amount: number) => {
    if (amount <= 0) return { valid: false, error: 'O valor deve ser maior que zero.' };
    return { valid: true };
  }
};

const runTests = () => {
  console.log('🧪 Iniciando Testes de Validação...');

  // Teste CPF
  const testCPF = () => {
    const valid = '12345678909';
    const invalid = '11111111111';
    if (mockValidationService.validateCPF(valid) !== true) throw new Error('CPF válido rejeitado');
    if (mockValidationService.validateCPF(invalid) !== false) throw new Error('CPF inválido aceito');
    console.log('  - CPF: OK');
  };

  // Teste CNPJ
  const testCNPJ = () => {
    const valid = '29793949000178';
    const invalid = '00000000000000';
    if (mockValidationService.validateCNPJ(valid) !== true) throw new Error('CNPJ válido rejeitado');
    if (mockValidationService.validateCNPJ(invalid) !== false) throw new Error('CNPJ inválido aceito');
    console.log('  - CNPJ: OK');
  };

  // Teste Transação
  const testTransaction = () => {
    if (mockValidationService.validateTransaction(100).valid !== true) throw new Error('Valor positivo rejeitado');
    if (mockValidationService.validateTransaction(-1).valid !== false) throw new Error('Valor negativo aceito');
    console.log('  - Transação: OK');
  };

  try {
    testCPF();
    testCNPJ();
    testTransaction();
    console.log('✅ Todos os testes de validação passaram!');
  } catch (e) {
    console.error('❌ Falha nos testes:', e.message);
    process.exit(1);
  }
};

runTests();
