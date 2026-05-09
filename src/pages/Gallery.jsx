import { useEffect, useMemo, useState } from "react";
import { Download, Heart, Loader2, MessageCircle, Send, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
      setPosts([]);
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

    setPosts(enrichedPosts);
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
