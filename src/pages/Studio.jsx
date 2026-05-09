import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, LogOut, Grid, Save, Sparkles, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { ProfileCard } from "@/components/ui/profile-card";

const AVATAR_SUGGESTIONS = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Paresh",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=8thSense",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Studio",
  "https://api.dicebear.com/9.x/personas/svg?seed=Creator",
  "https://api.dicebear.com/9.x/personas/svg?seed=Director",
  "https://api.dicebear.com/9.x/personas/svg?seed=Client",
];

export function Studio({ user }) {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ display_name: "", username: "", avatar_url: "" });
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileStatus, setProfileStatus] = useState({ type: "", text: "" });
  
  // Profile Stats
  const [stats, setStats] = useState({ posts: 0, likes: 0, views: 0 });
  const [userPosts, setUserPosts] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [user.id]);

  async function fetchUserData() {
    setLoadingStats(true);
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url, email")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        setProfileForm({
          display_name: profileData.display_name || "",
          username: profileData.username || "",
          avatar_url: profileData.avatar_url || "",
        });
      }

      // Fetch posts for this user, including their views
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch likes for these posts
      const postIds = postsData?.map(p => p.id) || [];
      let totalLikes = 0;
      
      if (postIds.length > 0) {
        const { data: likesData } = await supabase
          .from('community_likes')
          .select('post_id')
          .in('post_id', postIds);
          
        totalLikes = likesData?.length || 0;
      }

      const totalViews = postsData?.reduce((acc, post) => acc + (post.views || 0), 0) || 0;

      setStats({
        posts: postsData?.length || 0,
        likes: totalLikes,
        views: totalViews
      });
      setUserPosts(postsData || []);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoadingStats(false);
    }
  }

  async function updateProfile(event) {
    event.preventDefault();
    setProfileBusy(true);
    setProfileStatus({ type: "", text: "" });

    try {
      const cleanUsername = profileForm.username.trim().replace(/\s+/g, "-").toLowerCase();
      const payload = {
        display_name: profileForm.display_name.trim() || user.email?.split("@")[0] || "Client",
        username: cleanUsername || `${user.email?.split("@")[0] || "user"}-${user.id.slice(0, 8)}`,
        avatar_url: profileForm.avatar_url.trim() || null,
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id)
        .select("display_name, username, avatar_url, email")
        .single();

      if (error) throw error;

      setProfile(data);
      setProfileForm({
        display_name: data.display_name || "",
        username: data.username || "",
        avatar_url: data.avatar_url || "",
      });
      setProfileStatus({ type: "success", text: "Profile updated." });
    } catch (error) {
      setProfileStatus({ type: "error", text: error.message });
    } finally {
      setProfileBusy(false);
    }
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
    }
  };

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "", text: "" });
    setBusy(true);
    
    try {
      if (!file) throw new Error("Please choose an image to upload.");
      
      const imageUrl = await uploadImage("community-posts", file, user.id);
      
      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        image_url: imageUrl,
        caption,
        author_name: profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous",
      });
      
      if (error) throw error;
      
      setCaption("");
      setFile(null);
      setPreview(null);
      setStatus({ type: "success", text: "Photo uploaded successfully! Check the Gallery." });
      
      // Refresh stats and posts
      fetchUserData();
      
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div className="page-container section-padding max-w-5xl">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="heading-lg">Client Studio</h1>
        <button onClick={logout} className="btn-secondary w-full text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="mb-16">
        <ProfileCard 
          name={profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Client"}
          title="Community Member"
          avatarUrl={profile?.avatar_url}
          posts={stats.posts}
          likes={stats.likes}
          views={stats.views}
        />
      </div>

      <div className="glass-card mb-10 border-slate-200 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
            <UserRound size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit profile</h2>
            <p className="text-sm text-slate-500">Update your public name and gallery avatar.</p>
          </div>
        </div>

        <form onSubmit={updateProfile} className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <div>
              <label className="label-text">Display name</label>
              <input
                className="input-field"
                value={profileForm.display_name}
                onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                placeholder="Your public name"
              />
            </div>
            <div>
              <label className="label-text">Username</label>
              <input
                className="input-field"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                placeholder="your-name"
              />
            </div>
            <div>
              <label className="label-text">Avatar URL</label>
              <input
                className="input-field"
                value={profileForm.avatar_url}
                onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles size={16} />
              Suggested avatars
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3">
              {AVATAR_SUGGESTIONS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setProfileForm({ ...profileForm, avatar_url: avatar })}
                  className={`aspect-square overflow-hidden rounded-2xl border-2 bg-slate-50 transition-all hover:scale-105 ${
                    profileForm.avatar_url === avatar ? "border-slate-900 shadow-md" : "border-slate-200"
                  }`}
                  aria-label="Use suggested avatar"
                >
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {profileStatus.text && (
              <div className={`rounded-xl p-3 text-sm font-medium ${profileStatus.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                {profileStatus.text}
              </div>
            )}

            <button type="submit" className="btn-primary mt-auto w-full" disabled={profileBusy}>
              {profileBusy ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Profile
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="lg:col-span-1">
          <div className="glass-card border-slate-200 shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Upload a memory</h2>
            <p className="text-body text-sm mb-6">Share your photoshoot pictures with the community.</p>

            <form onSubmit={submit} className="flex flex-col gap-6">
              <div>
                <label className="label-text">Select Image</label>
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100 overflow-hidden relative">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="rounded-full bg-white p-4 shadow-sm">
                        <Upload className="text-slate-600" size={24} />
                      </div>
                      <span className="font-semibold text-slate-600 text-center text-sm px-4">Click or drag</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div>
                <label className="label-text">Caption</label>
                <textarea
                  className="input-field min-h-24 resize-none"
                  placeholder="Tell us about this..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              {status.text && (
                <div className={`rounded-xl p-3 text-sm font-medium ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {status.text}
                </div>
              )}

              <button type="submit" className="btn-primary w-full" disabled={busy || !file}>
                {busy && <Loader2 className="animate-spin" size={18} />}
                Post to Gallery
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Grid className="text-slate-900" size={20} />
            <h3 className="text-2xl font-bold text-slate-900">Your Posts</h3>
          </div>
          
          {loadingStats ? (
            <div className="flex justify-center p-8 sm:p-12">
              <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
          ) : userPosts.length === 0 ? (
            <div className="glass-card border-2 border-dashed py-14 text-center sm:py-20">
              <p className="text-slate-500 text-lg">You haven't uploaded any posts yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {userPosts.map(post => (
                <div key={post.id} className="aspect-square relative group rounded-xl overflow-hidden bg-slate-100 cursor-pointer">
                  <img src={post.image_url} alt={post.caption || "User post"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <p className="text-white text-sm font-medium text-center line-clamp-3">
                      {post.caption || "No caption"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
