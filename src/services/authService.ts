import { supabase } from '@/lib/supabaseClient';

export async function signUpWithEmail(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  // If signup succeeded and user exists, update username in users table
  if (data.user) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ username })
      .eq('id', data.user.id);

    if (updateError) throw new Error(updateError.message);
  }

  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) throw new Error(error.message);
}


