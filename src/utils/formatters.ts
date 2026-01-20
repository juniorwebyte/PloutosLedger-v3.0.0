/**
 * Utilitários de formatação para campos de entrada
 * Fornece formatação automática para telefone, CPF, CNPJ, CEP, valores monetários, etc.
 * Inclui também funções de busca de dados via APIs (ViaCEP, ReceitaWS)
 */

// ============================================================
// INTERFACES PARA RETORNO DAS APIs
// ============================================================

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface CNPJResponse {
  cnpj: string;
  tipo: string;
  abertura: string;
  nome: string;
  fantasia: string;
  // Melhor esforço: nem toda fonte pública retorna
  inscricao_estadual?: string;
  atividade_principal: Array<{ code: string; text: string }>;
  atividades_secundarias: Array<{ code: string; text: string }>;
  natureza_juridica: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
  bairro: string;
  municipio: string;
  uf: string;
  email: string;
  telefone: string;
  efr: string;
  situacao: string;
  data_situacao: string;
  motivo_situacao: string;
  situacao_especial: string;
  data_situacao_especial: string;
  capital_social: string;
  qsa: Array<{ nome: string; qual: string }>;
  status: string;
  message?: string;
}

// ============================================================
// FUNÇÕES DE BUSCA VIA API
// ============================================================

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 * @param cep - CEP a ser pesquisado (apenas números ou formatado)
 * @returns Dados do endereço ou null se não encontrado
 */
export const buscarCEP = async (cep: string): Promise<ViaCEPResponse | null> => {
  try {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      return null;
    }
    
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    
    if (!response.ok) {
      return null;
    }
    
    const data: ViaCEPResponse = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
};

/**
 * Busca dados da empresa pelo CNPJ usando a API ReceitaWS
 * @param cnpj - CNPJ a ser pesquisado (apenas números ou formatado)
 * @returns Dados da empresa ou null se não encontrado
 */
export const buscarCNPJ = async (cnpj: string): Promise<CNPJResponse | null> => {
  try {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
      return null;
    }

    // Preferir nosso backend como proxy (evita CORS/limites no browser)
    const response = await fetch(`/api/cnpj/${cnpjLimpo}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    const data: CNPJResponse = await response.json();
    if (data.status === 'ERROR' || data.message) return null;
    return data;
  } catch (error) {
    console.error('Erro ao buscar CNPJ:', error);
    return null;
  }
};

// ============================================================
// FUNÇÕES DE FORMATAÇÃO
// ============================================================

/**
 * Formata telefone brasileiro
 * Aceita 10 ou 11 dígitos (com ou sem DDD)
 * @param value - Valor a ser formatado
 * @returns Telefone formatado: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  // 11 dígitos (celular com DDD)
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * Remove formatação do telefone, retornando apenas números
 * @param value - Telefone formatado
 * @returns Apenas números
 */
export const unformatPhone = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Formata CPF
 * @param value - Valor a ser formatado
 * @returns CPF formatado: XXX.XXX.XXX-XX
 */
export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
};

/**
 * Remove formatação do CPF
 * @param value - CPF formatado
 * @returns Apenas números
 */
export const unformatCPF = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 11);
};

/**
 * Formata CNPJ
 * @param value - Valor a ser formatado
 * @returns CNPJ formatado: XX.XXX.XXX/XXXX-XX
 */
export const formatCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 14);
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`;
};

/**
 * Remove formatação do CNPJ
 * @param value - CNPJ formatado
 * @returns Apenas números
 */
export const unformatCNPJ = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 14);
};

/**
 * Formata CPF ou CNPJ automaticamente baseado no tamanho
 * @param value - Valor a ser formatado
 * @returns CPF ou CNPJ formatado
 */
export const formatCPFCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    return formatCPF(value);
  }
  return formatCNPJ(value);
};

/**
 * Formata CEP
 * @param value - Valor a ser formatado
 * @returns CEP formatado: XXXXX-XXX
 */
export const formatCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 8);
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
};

/**
 * Remove formatação do CEP
 * @param value - CEP formatado
 * @returns Apenas números
 */
export const unformatCEP = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 8);
};

/**
 * Formata valor monetário para entrada (input)
 * Aceita apenas números e formata como moeda brasileira
 * @param value - Valor a ser formatado
 * @returns Valor formatado: R$ X.XXX,XX
 */
export const formatCurrencyInput = (value: string): string => {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  
  if (numbers === '') return '';
  
  // Converte para centavos
  const cents = parseInt(numbers, 10);
  
  // Converte para reais
  const reais = cents / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(reais);
};

/**
 * Remove formatação do valor monetário e retorna número
 * @param value - Valor formatado
 * @returns Número (em reais)
 */
export const unformatCurrency = (value: string): number => {
  // Remove tudo exceto números, vírgulas e pontos
  const cleanValue = value.replace(/[^\d,.-]/g, '');
  
  // Substitui vírgula por ponto para parseFloat
  const normalizedValue = cleanValue.replace(',', '.');
  
  return parseFloat(normalizedValue) || 0;
};

/**
 * Formata número para entrada (apenas números, sem formatação especial)
 * Útil para campos numéricos simples
 * @param value - Valor a ser formatado
 * @returns Apenas números
 */
export const formatNumber = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Formata porcentagem
 * @param value - Valor a ser formatado
 * @returns Porcentagem formatada: XX,XX%
 */
export const formatPercentage = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers === '') return '';
  
  // Se tiver mais de 2 dígitos, considera os 2 últimos como decimais
  if (numbers.length > 2) {
    const integer = numbers.slice(0, -2);
    const decimal = numbers.slice(-2);
    return `${integer},${decimal}%`;
  }
  
  // Se tiver 2 dígitos ou menos, considera como decimais
  return `0,${numbers.padStart(2, '0')}%`;
};

/**
 * Remove formatação da porcentagem
 * @param value - Porcentagem formatada
 * @returns Número (0-100)
 */
export const unformatPercentage = (value: string): number => {
  const cleanValue = value.replace(/[^\d,.-]/g, '');
  const normalizedValue = cleanValue.replace(',', '.');
  return parseFloat(normalizedValue) || 0;
};

/**
 * Formata cartão de crédito
 * @param value - Valor a ser formatado
 * @returns Cartão formatado: XXXX XXXX XXXX XXXX
 */
export const formatCreditCard = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 16);
  
  if (numbers.length === 0) return '';
  
  // Formata em grupos de 4 dígitos
  const groups = numbers.match(/.{1,4}/g) || [];
  return groups.join(' ');
};

/**
 * Remove formatação do cartão de crédito
 * @param value - Cartão formatado
 * @returns Apenas números
 */
export const unformatCreditCard = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 16);
};

/**
 * Formata data (DD/MM/YYYY)
 * @param value - Valor a ser formatado
 * @returns Data formatada: DD/MM/YYYY
 */
export const formatDate = (value: string): string => {
  const numbers = value.replace(/\D/g, '').slice(0, 8);
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
};

/**
 * Remove formatação da data
 * @param value - Data formatada
 * @returns Apenas números
 */
export const unformatDate = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 8);
};

/**
 * Tipos de formatação disponíveis
 */
export type FormatterType = 
  | 'phone'
  | 'cpf'
  | 'cnpj'
  | 'cpfcnpj'
  | 'cep'
  | 'currency'
  | 'number'
  | 'percentage'
  | 'creditcard'
  | 'date';

/**
 * Aplica formatação baseada no tipo
 * @param value - Valor a ser formatado
 * @param type - Tipo de formatação
 * @returns Valor formatado
 */
export const applyFormat = (value: string, type: FormatterType): string => {
  switch (type) {
    case 'phone':
      return formatPhone(value);
    case 'cpf':
      return formatCPF(value);
    case 'cnpj':
      return formatCNPJ(value);
    case 'cpfcnpj':
      return formatCPFCNPJ(value);
    case 'cep':
      return formatCEP(value);
    case 'currency':
      return formatCurrencyInput(value);
    case 'number':
      return formatNumber(value);
    case 'percentage':
      return formatPercentage(value);
    case 'creditcard':
      return formatCreditCard(value);
    case 'date':
      return formatDate(value);
    default:
      return value;
  }
};

/**
 * Remove formatação baseada no tipo
 * @param value - Valor formatado
 * @param type - Tipo de formatação
 * @returns Valor sem formatação
 */
export const removeFormat = (value: string, type: FormatterType): string => {
  switch (type) {
    case 'phone':
      return unformatPhone(value);
    case 'cpf':
      return unformatCPF(value);
    case 'cnpj':
      return unformatCNPJ(value);
    case 'cpfcnpj':
      return value.replace(/\D/g, '');
    case 'cep':
      return unformatCEP(value);
    case 'currency':
      return unformatCurrency(value).toString();
    case 'number':
      return formatNumber(value);
    case 'percentage':
      return unformatPercentage(value).toString();
    case 'creditcard':
      return unformatCreditCard(value);
    case 'date':
      return unformatDate(value);
    default:
      return value;
  }
};

