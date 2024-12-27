import { supabase } from './supabase';
import type { Achievement, Attachment, Child, Category, Skill } from '../types';
import type { SearchFilters } from '../components/AdvancedSearch';

// Achievement functions
export async function getAchievements(childId: string) {
  const { data, error } = await supabase
    .from('achievements')
    .select(`
      *,
      category:categories(name),
      skills:achievement_skills(skill:skills(name)),
      attachments(*)
    `)
    .eq('child_id', childId)
    .order('event_date', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getAchievement(id: string) {
  const { data, error } = await supabase
    .from('achievements')
    .select(`
      *,
      category:categories(name),
      skills:achievement_skills(skill:skills(name)),
      attachments(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createAchievement(
  data: Partial<Achievement>,
  skills: string[],
  attachments: Attachment[]
) {
  const { data: achievement, error: achievementError } = await supabase
    .from('achievements')
    .insert([data])
    .select()
    .single();

  if (achievementError) throw achievementError;

  if (skills.length > 0) {
    const skillMappings = skills.map(skillId => ({
      achievement_id: achievement.id,
      skill_id: skillId
    }));

    const { error: skillsError } = await supabase
      .from('achievement_skills')
      .insert(skillMappings);

    if (skillsError) throw skillsError;
  }

  if (attachments.length > 0) {
    const attachmentData = attachments.map(attachment => ({
      ...attachment,
      achievement_id: achievement.id
    }));

    const { error: attachmentsError } = await supabase
      .from('attachments')
      .insert(attachmentData);

    if (attachmentsError) throw attachmentsError;
  }

  return achievement as Achievement;
}

export async function searchAchievements(childId: string, query?: string, filters?: SearchFilters) {
  let queryBuilder = supabase
    .from('achievements')
    .select(`
      *,
      category:categories(name),
      skills:achievement_skills(skill:skills(name)),
      attachments(*)
    `)
    .eq('child_id', childId);

  if (query) {
    queryBuilder = queryBuilder.or(
      `title.ilike.%${query}%,description.ilike.%${query}%,categories.name.ilike.%${query}%,skills.name.ilike.%${query}%`
    );
  }

  if (filters) {
    if (filters.startDate) {
      queryBuilder = queryBuilder.gte('event_date', filters.startDate);
    }
    if (filters.endDate) {
      queryBuilder = queryBuilder.lte('event_date', filters.endDate);
    }
    if (filters.location) {
      queryBuilder = queryBuilder.ilike('location', `%${filters.location}%`);
    }
    if (filters.categoryId) {
      queryBuilder = queryBuilder.eq('category_id', filters.categoryId);
    }
    if (filters.skillIds.length > 0) {
      queryBuilder = queryBuilder.contains('skills.skill_id', filters.skillIds);
    }
  }

  const { data, error } = await queryBuilder.order('event_date', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Child functions
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

// Category functions
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Category[];
}

// Skill functions
export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Skill[];
}