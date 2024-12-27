import { supabase } from './supabase';
import type { User } from '../types';

export async function createOrUpdateProfile(userId: string, email: string, fullName: string | null) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) throw signInError;
  if (!user) throw new Error('No user returned after sign in');

  const profile = await getProfile(user.id);
  
  if (!profile) {
    // Create profile if it doesn't exist
    await createOrUpdateProfile(user.id, user.email!, user.user_metadata?.full_name);
  }

  return {
    id: user.id,
    email: user.email!,
    full_name: profile?.full_name || user.user_metadata?.full_name || null
  };
}

export async function signUp(email: string, password: string, fullName: string): Promise<User> {
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });

  if (signUpError) throw signUpError;
  if (!user) throw new Error('No user returned after sign up');

  // Create initial profile
  await createOrUpdateProfile(user.id, email, fullName);

  return {
    id: user.id,
    email: user.email!,
    full_name: fullName
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}