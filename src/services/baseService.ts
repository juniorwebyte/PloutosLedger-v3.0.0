import { apiClient } from './apiClient';
import { SupabaseService } from './supabaseService';

/**
 * BaseService - Camada de Abstração de Dados v3.1
 * Agora suporta LocalStorage, API Customizada e Supabase.
 */
export class BaseService<T extends { id?: string }> {
  protected storageKey: string;
  protected supabaseService: SupabaseService<T>;
  protected useSupabase: boolean;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.supabaseService = new SupabaseService<T>(storageKey);
    // Ativa Supabase se as chaves estiverem presentes no ambiente
    this.useSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  }

  protected getAllRaw(): T[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(`Erro ao ler ${this.storageKey} do localStorage:`, error);
      return [];
    }
  }

  protected saveAll(items: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Erro ao salvar ${this.storageKey} no localStorage:`, error);
    }
  }

  public async getAll(): Promise<T[]> {
    // 1. Tenta Supabase se ativo
    if (this.useSupabase) {
      try {
        return await this.supabaseService.getAll();
      } catch (e) {
        console.warn(`Supabase falhou para ${this.storageKey}, tentando fallback.`);
      }
    }

    // 2. Tenta API Customizada
    try {
      const response = await apiClient.get<T[]>(`/${this.storageKey}`);
      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        return response.data;
      }
    } catch (e) {}
    
    // 3. Fallback LocalStorage
    return this.getAllRaw();
  }

  public async getById(id: string): Promise<T | null> {
    if (this.useSupabase) {
      try {
        return await this.supabaseService.getById(id);
      } catch (e) {}
    }

    try {
      const response = await apiClient.get<T>(`/${this.storageKey}/${id}`);
      if (response.status === 200 && response.data) return response.data;
    } catch (e) {}
    
    const items = await this.getAll();
    return items.find(item => item.id === id) || null;
  }

  public async save(item: T): Promise<T> {
    // 1. Salva no Supabase se ativo
    if (this.useSupabase) {
      try {
        return await this.supabaseService.save(item);
      } catch (e) {
        console.error(`Falha ao salvar no Supabase:`, e);
      }
    }

    // 2. Sincroniza com API Customizada
    try {
      const response = item.id 
        ? await apiClient.put<T>(`/${this.storageKey}/${item.id}`, item)
        : await apiClient.post<T>(`/${this.storageKey}`, item);
      
      if (response.status === 200 || response.status === 201) {
        item = response.data;
      }
    } catch (e) {}

    // 3. Persistência Local (Sempre mantém uma cópia local para offline)
    const items = this.getAllRaw();
    if (!item.id) {
      item.id = `${this.storageKey.split('_')[1] || 'item'}_${Date.now()}`;
      items.push(item);
    } else {
      const index = items.findIndex(i => i.id === item.id);
      if (index >= 0) {
        items[index] = item;
      } else {
        items.push(item);
      }
    }
    this.saveAll(items);
    return item;
  }

  public async delete(id: string): Promise<boolean> {
    if (this.useSupabase) {
      try {
        await this.supabaseService.delete(id);
      } catch (e) {}
    }

    try {
      await apiClient.delete(`/${this.storageKey}/${id}`);
    } catch (e) {}

    const items = this.getAllRaw();
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length < items.length) {
      this.saveAll(filtered);
      return true;
    }
    return false;
  }
}
