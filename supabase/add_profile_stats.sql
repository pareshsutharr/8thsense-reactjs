-- Add views column to community_posts to track profile metrics
ALTER TABLE public.community_posts 
ADD COLUMN IF NOT EXISTS views INT DEFAULT 0 NOT NULL;

-- Optional: Create a helper function to increment views
-- You can call this via RPC: await supabase.rpc('increment_post_view', { post_id: '...' })
CREATE OR REPLACE FUNCTION public.increment_post_view(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$;
