import { supabase } from '../supabase';
import type { Skill } from '../../types';

export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Skill[];
}