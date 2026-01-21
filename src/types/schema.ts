/**
 * Database Schema Definitions v3.0
 * Define a estrutura de dados para persistência em banco de dados real.
 */

export interface UserSchema {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}

export interface TransactionSchema {
  id: string;
  userId: string;
  amount: number;
  type: 'entry' | 'exit';
  categoryId: string;
  description: string;
  date: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface ProductSchema {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  categoryId: string;
  active: boolean;
}

export interface AuditSchema {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  payload: any;
  timestamp: string;
}
