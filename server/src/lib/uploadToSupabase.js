import { supabaseAdmin } from './supabaseAdmin.js';
import path from 'path';

export const uploadToSupabase = async (file) => {
  if (!file) return null;

  // Generate a unique file name
  const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = path.extname(file.originalname);
  const fileName = `${uniqueId}${ext}`;

  const { data, error } = await supabaseAdmin
    .storage
    .from('quads-media')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error('Failed to upload image to Supabase');
  }

  // Get public URL
  const { data: publicUrlData } = supabaseAdmin
    .storage
    .from('quads-media')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};
