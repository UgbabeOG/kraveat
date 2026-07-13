import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function uploadMenuImage(file: File) {
  if (!supabase) {
    return null;
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const { error } = await supabase.storage.from('food-images').upload(fileName, file, {
    upsert: true,
    contentType: file.type
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from('food-images').getPublicUrl(fileName);
  return data.publicUrl;
}
