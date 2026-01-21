import { supabase } from './supabaseClient';

/**
 * SupabaseService - Camada de Persistência Real
 * Implementa os métodos do BaseService utilizando o SDK do Supabase.
 */
export class SupabaseService<T extends { id?: string }> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  public async getAll(): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*');

    if (error) {
      console.error(`Erro ao buscar dados de ${this.tableName}:`, error);
      throw error;
    }

    return data as T[];
  }

  public async getById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar item ${id} em ${this.tableName}:`, error);
      return null;
    }

    return data as T;
  }

  public async save(item: T): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .upsert(item)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao salvar item em ${this.tableName}:`, error);
      throw error;
    }

    return data as T;
  }

  public async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erro ao deletar item ${id} em ${this.tableName}:`, error);
      return false;
    }

    return true;
  }
}
