import { supabase } from '../supabase';
import type { Achievement, Attachment } from '../../types';

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