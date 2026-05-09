import { supabase } from "./supabase";

export async function uploadImage(bucket, file, userId) {
  if (!file) return null;

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
