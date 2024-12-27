import { supabase } from '../supabase';
import type { Child } from '../../types';

export async function getChildren() {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Child[];
}

export async function getChild(id: string) {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Child;
}

export async function createChild(data: Partial<Child>) {
  const { data: child, error } = await supabase
    .from('children')
    .insert([data])
    .select()
    .single();
  
  if (error) throw error;
  return child as Child;
}