import { useEffect, useMemo, useState } from "react";
import { Download, Heart, Loader2, MessageCircle, Send, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const demoPosts = [
  {
    id: "demo-urban-frame",
    is_demo: true,
    author_name: "Aarav Mehta",
    avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Aarav",
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85",
    caption: "Late-night camera tests before a brand film shoot.",
    created_at: "2026-05-08T18:20:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }, { user_id: "demo-c" }],
    comments: [
      { id: "demo-urban-frame-c1", profiles: { display_name: "Riya Shah" }, content: "This lighting feels premium." },
      { id: "demo-urban-frame-c2", profiles: { display_name: "Neel Patel" }, content: "The orange tone is perfect for a campaign teaser." },
    ],
  },
  {
    id: "demo-wedding-glow",
    is_demo: true,
    author_name: "Riya Shah",
    avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Riya",
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    caption: "Soft wedding details from an evening celebration.",
    created_at: "2026-05-07T20:12:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }, { user_id: "demo-c" }, { user_id: "demo-d" }],
    comments: [
      { id: "demo-wedding-glow-c1", profiles: { display_name: "Aarav Mehta" }, content: "Beautiful tones and composition." },
    ],
  },
  {
    id: "demo-fashion-editorial",
    is_demo: true,
    author_name: "Kabir Joshi",
    avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Kabir",
    image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",
    caption: "Editorial frame for a creator profile launch.",
    created_at: "2026-05-07T12:40:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }, { user_id: "demo-c" }, { user_id: "demo-d" }, { user_id: "demo-e" }],
    comments: [
      { id: "demo-fashion-editorial-c1", profiles: { display_name: "Meera Iyer" }, content: "Looks like a magazine cover." },
      { id: "demo-fashion-editorial-c2", profiles: { display_name: "Dev Rana" }, content: "Clean direction." },
    ],
  },
  {
    id: "demo-product-story",
    is_demo: true,
    author_name: "Meera Iyer",
    avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Meera",
    image_url: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=1200&q=85",
    caption: "Minimal product story with a bright lifestyle setup.",
    created_at: "2026-05-06T16:05:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }],
    comments: [
      { id: "demo-product-story-c1", profiles: { display_name: "Nisha Rao" }, content: "Love the clean backdrop." },
    ],
  },
  {
    id: "demo-live-music",
    is_demo: true,
    author_name: "Dev Rana",
    avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Dev",
    image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
    caption: "Crowd energy from a live event highlight reel.",
    created_at: "2026-05-05T22:10:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }, { user_id: "demo-c" }, { user_id: "demo-d" }, { user_id: "demo-e" }, { user_id: "demo-f" }],
    comments: [
      { id: "demo-live-music-c1", profiles: { display_name: "Kabir Joshi" }, content: "This needs to be the event cover." },
    ],
  },
  {
    id: "demo-studio-portrait",
    is_demo: true,
    author_name: "Nisha Rao",
    avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Nisha",
    image_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85",
    caption: "Studio portrait session for a personal brand refresh.",
    created_at: "2026-05-04T14:32:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }, { user_id: "demo-c" }],
    comments: [
      { id: "demo-studio-portrait-c1", profiles: { display_name: "Riya Shah" }, content: "Very natural and confident." },
      { id: "demo-studio-portrait-c2", profiles: { display_name: "Aarav Mehta" }, content: "Great skin tones." },
    ],
  },
  {
    id: "demo-corporate-film",
    is_demo: true,
    author_name: "Tara Singh",
    avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Tara",
    image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85",
    caption: "Behind the scenes from a corporate film setup.",
    created_at: "2026-05-03T11:18:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }, { user_id: "demo-c" }, { user_id: "demo-d" }],
    comments: [
      { id: "demo-corporate-film-c1", profiles: { display_name: "Meera Iyer" }, content: "The setup looks sharp." },
    ],
  },
  {
    id: "demo-travel-moment",
    is_demo: true,
    author_name: "Ishan Kapoor",
    avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Ishan",
    image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    caption: "Golden-hour frame from a destination album.",
    created_at: "2026-05-02T17:45:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }, { user_id: "demo-c" }, { user_id: "demo-d" }, { user_id: "demo-e" }],
    comments: [
      { id: "demo-travel-moment-c1", profiles: { display_name: "Tara Singh" }, content: "This one feels cinematic." },
    ],
  },
  {
    id: "demo-social-campaign",
    is_demo: true,
    author_name: "Sara Khan",
    avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Sara",
    image_url: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200&q=85",
    caption: "Content planning day for a social media campaign.",
    created_at: "2026-05-01T10:05:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }, { user_id: "demo-c" }],
    comments: [
      { id: "demo-social-campaign-c1", profiles: { display_name: "Ishan Kapoor" }, content: "This fits the brand mood." },
    ],
  },
  {
    id: "demo-food-brand",
    is_demo: true,
    author_name: "Neel Patel",
    avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Neel",
    image_url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85",
    caption: "Food brand shoot with crisp textures and natural light.",
    created_at: "2026-04-30T13:25:00+05:30",
    likes: [{ user_id: "demo-a" }, { user_id: "demo-b" }, { user_id: "demo-c" }, { user_id: "demo-d" }],
    comments: [
      { id: "demo-food-brand-c1", profiles: { display_name: "Sara Khan" }, content: "So fresh. Great for reels too." },
    ],
  },
];

export function Gallery() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) || null,
    [posts, selectedPostId],
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    loadPosts();
  }, []);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") setSelectedPostId(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  async function loadPosts() {
    setLoading(true);
    let { data: postsData, error: postsError } = await supabase
      .from("community_posts")
      .select("*, profiles(display_name, avatar_url)")
      .order("created_at", { ascending: false });

    if (postsError) {
      const fallback = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });

      postsData = fallback.data;
      postsError = fallback.error;
    }

    if (postsError) {
      console.error("Error loading gallery posts:", postsError);
      setPosts(demoPosts);
      setLoading(false);
      return;
    }

    const { data: likesData, error: likesError } = await supabase.from("community_likes").select("*");
    if (likesError) console.error("Error loading gallery likes:", likesError);

    let commentsData = [];
    const commentsResponse = await supabase
      .from("community_comments")
      .select("*, profiles(display_name)")
      .order("created_at", { ascending: true });

    if (!commentsResponse.error) {
      commentsData = commentsResponse.data || [];
    } else {
      console.info("Gallery comments are unavailable:", commentsResponse.error.message);
    }

    const enrichedPosts = (postsData || []).map((post) => {
      const postLikes = likesData?.filter((like) => like.post_id === post.id) || [];
      const postComments = commentsData.filter((comment) => comment.post_id === post.id);

      return {
        ...post,
        likes: postLikes,
        comments: postComments,
        author_name: post.profiles?.display_name || post.author_name || "Community member",
        avatar_url: post.profiles?.avatar_url,
      };
    });

    setPosts([...demoPosts, ...enrichedPosts]);
    setLoading(false);
  }

  function isLikedByMe(post) {
    return Boolean(session?.user && post.likes?.some((like) => like.user_id === session.user.id));
  }

  function avatarInitial(post) {
    return (post.author_name || "U").charAt(0).toUpperCase();
  }

  async function toggleLike(post) {
    if (!session?.user) {
      alert("Please sign in to like posts.");
      return;
    }

    if (post.is_demo) {
      setPosts((currentPosts) =>
        currentPosts.map((currentPost) => {
          if (currentPost.id !== post.id) return currentPost;
          const alreadyLiked = currentPost.likes?.some((like) => like.user_id === session.user.id);
          return {
            ...currentPost,
            likes: alreadyLiked
              ? currentPost.likes.filter((like) => like.user_id !== session.user.id)
              : [...(currentPost.likes || []), { user_id: session.user.id }],
          };
        }),
      );
      return;
    }

    if (isLikedByMe(post)) {
      await supabase.from("community_likes").delete().match({ post_id: post.id, user_id: session.user.id });
    } else {
      await supabase.from("community_likes").insert({ post_id: post.id, user_id: session.user.id });
    }

    await loadPosts();
  }

  async function submitComment(event) {
    event.preventDefault();
    if (!session?.user) {
      alert("Please sign in to comment.");
      return;
    }
    if (!selectedPost || !commentText.trim()) return;

    setSubmittingComment(true);

    if (selectedPost.is_demo) {
      const nextComment = {
        id: `${selectedPost.id}-comment-${Date.now()}`,
        profiles: { display_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "You" },
        content: commentText.trim(),
      };

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === selectedPost.id
            ? { ...post, comments: [...(post.comments || []), nextComment] }
            : post,
        ),
      );
      setCommentText("");
      setSubmittingComment(false);
      return;
    }

    const { error } = await supabase.from("community_comments").insert({
      post_id: selectedPost.id,
      user_id: session.user.id,
      content: commentText.trim(),
    });

    if (error) {
      alert("Could not add comment: " + error.message);
    } else {
      setCommentText("");
      await loadPosts();
    }
    setSubmittingComment(false);
  }

  async function downloadImage(post) {
    try {
      const response = await fetch(post.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `8thsense-${post.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      window.open(post.image_url, "_blank");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="page-container py-16 lg:py-24">
        <div className="mb-12 text-center">
          <h1 className="heading-lg mb-4">Latest Uploads</h1>
          <p className="text-body mx-auto max-w-2xl">
            Explore moments captured and shared by our amazing clients. Join the community by sharing your own photos in the Studio.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-8 sm:p-12">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card text-center py-20">
            <p className="text-slate-500 text-lg">No posts yet. Be the first to share a memory!</p>
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {posts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setSelectedPostId(post.id)}
                className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative bg-slate-100">
                  <img src={post.image_url} alt={post.caption || "Community post"} className="w-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-sm font-semibold text-white">{post.author_name}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-900">
                      <Heart size={13} />
                      {post.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setSelectedPostId(null)}
        >
          <div
            className="grid max-h-[96vh] w-full max-w-6xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl lg:grid-cols-[minmax(0,1.35fr)_390px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex max-h-[42vh] min-h-[240px] items-center justify-center bg-slate-950 sm:max-h-[56vh] lg:max-h-[90vh]">
              <img src={selectedPost.image_url} alt={selectedPost.caption || "Community post"} className="max-h-[42vh] w-full object-contain sm:max-h-[56vh] lg:max-h-[90vh]" />
            </div>

            <aside className="flex max-h-[54vh] min-h-0 flex-col sm:max-h-[90vh]">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-4 sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  {selectedPost.avatar_url ? (
                    <img src={selectedPost.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-600">
                      {avatarInitial(selectedPost)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-slate-900">{selectedPost.author_name}</h2>
                    <p className="text-sm font-medium text-slate-500">{new Date(selectedPost.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPostId(null)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close image"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="border-b border-slate-100 p-4 sm:p-5">
                <p className="mb-5 text-sm leading-6 text-slate-700">{selectedPost.caption || "No caption"}</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => toggleLike(selectedPost)}
                    className={`btn-secondary flex-1 px-4 py-3 ${isLikedByMe(selectedPost) ? "text-red-500" : ""}`}
                  >
                    <Heart size={18} className={isLikedByMe(selectedPost) ? "fill-current" : ""} />
                    {selectedPost.likes?.length || 0}
                  </button>
                  <button type="button" onClick={() => downloadImage(selectedPost)} className="btn-secondary flex-1 px-4 py-3">
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
                  <MessageCircle size={18} className="text-slate-500" />
                  <span className="text-sm font-bold text-slate-900">Comments</span>
                  <span className="text-sm font-semibold text-slate-400">{selectedPost.comments?.length || 0}</span>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
                  {selectedPost.comments?.length ? (
                    selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="text-sm leading-6">
                        <span className="mr-2 font-bold text-slate-900">{comment.profiles?.display_name || "User"}</span>
                        <span className="text-slate-700">{comment.content}</span>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-sm text-slate-500">No comments yet.</p>
                  )}
                </div>

                <form onSubmit={submitComment} className="border-t border-slate-100 p-3 sm:p-4">
                  <div className="relative">
                    <input
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      placeholder="Add a comment..."
                      className="input-field pr-12"
                      disabled={submittingComment}
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40"
                      aria-label="Post comment"
                    >
                      {submittingComment ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    </button>
                  </div>
                </form>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
