/**
 * ValidationService - Integridade de Dados
 * Centraliza regras de negócio e validações técnicas para CEP, Telefone, CPF, CNPJ e Transações.
 */
class ValidationService {
  // ============================================
  // VALIDAÇÃO DE CEP
  // ============================================
  public validateCEP(cep: string): boolean {
    const cleanCEP = cep.replace(/\D/g, '');
    return cleanCEP.length === 8;
  }

  public formatCEP(cep: string): string {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      return `${cleanCEP.substring(0, 5)}-${cleanCEP.substring(5)}`;
    }
    return cleanCEP;
  }

  // ============================================
  // VALIDAÇÃO DE TELEFONE
  // ============================================
  public validatePhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  }

  public formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 6)}-${cleanPhone.substring(6)}`;
    } else if (cleanPhone.length === 11) {
      return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 7)}-${cleanPhone.substring(7)}`;
    }
    return phone;
  }

  // ============================================
  // VALIDAÇÃO DE CPF
  // ============================================
  public validateCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    let sum = 0;
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
    
    return true;
  }

  public formatCPF(cpf: string): string {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length === 11) {
      return `${cleanCPF.substring(0, 3)}.${cleanCPF.substring(3, 6)}.${cleanCPF.substring(6, 9)}-${cleanCPF.substring(9)}`;
    }
    return cleanCPF;
  }

  // ============================================
  // VALIDAÇÃO DE CNPJ
  // ============================================
  public validateCNPJ(cnpj: string): boolean {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14 || /^(\d)\1{13}$/.test(cleanCNPJ)) return false;
    
    let length = cleanCNPJ.length - 2;
    let numbers = cleanCNPJ.substring(0, length);
    const digits = cleanCNPJ.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    length = length + 1;
    numbers = cleanCNPJ.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  }

  public formatCNPJ(cnpj: string): string {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length === 14) {
      return `${cleanCNPJ.substring(0, 2)}.${cleanCNPJ.substring(2, 5)}.${cleanCNPJ.substring(5, 8)}/${cleanCNPJ.substring(8, 12)}-${cleanCNPJ.substring(12)}`;
    }
    return cleanCNPJ;
  }

  // ============================================
  // VALIDAÇÕES FINANCEIRAS
  // ============================================
  public validateTransaction(amount: number): { valid: boolean; error?: string } {
    if (amount <= 0) return { valid: false, error: 'O valor deve ser maior que zero.' };
    if (amount > 1000000000) return { valid: false, error: 'Valor excede o limite permitido.' };
    return { valid: true };
  }

  public formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}

export const validationService = new ValidationService();
export default validationService;
