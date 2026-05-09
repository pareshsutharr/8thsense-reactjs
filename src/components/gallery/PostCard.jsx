import { useState } from "react";
import { Heart, MessageCircle, Download, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function PostCard({ post, currentUser, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLikedByMe = currentUser ? post.likes.some(l => l.user_id === currentUser.id) : false;

  async function toggleLike() {
    if (!currentUser) return alert("Please sign in to like posts");
    
    if (isLikedByMe) {
      await supabase.from("community_likes").delete().match({ post_id: post.id, user_id: currentUser.id });
    } else {
      await supabase.from("community_likes").insert({ post_id: post.id, user_id: currentUser.id });
    }
    onUpdate();
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!currentUser) return alert("Please sign in to comment");
    if (!commentText.trim()) return;

    setSubmitting(true);
    await supabase.from("community_comments").insert({
      post_id: post.id,
      user_id: currentUser.id,
      content: commentText.trim()
    });
    setCommentText("");
    setSubmitting(false);
    onUpdate();
  }

  async function handleDownload() {
    try {
      const response = await fetch(post.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `8thsense-${post.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      // Fallback
      window.open(post.image_url, '_blank');
    }
  }

  const avatarInitial = post.author_name ? post.author_name.charAt(0).toUpperCase() : "?";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {post.avatar_url ? (
          <img src={post.avatar_url} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
            {avatarInitial}
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-900 leading-tight">{post.author_name}</p>
          <p className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Image */}
      <div className="aspect-[4/5] w-full bg-slate-100 overflow-hidden relative group">
        <img src={post.image_url} alt="Post" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex gap-4">
          <button 
            onClick={toggleLike} 
            className={`flex items-center gap-1.5 transition-colors ${isLikedByMe ? 'text-red-500' : 'text-slate-600 hover:text-red-500'}`}
          >
            <Heart size={24} className={isLikedByMe ? "fill-current" : ""} />
            <span className="font-medium text-sm">{post.likes.length || ""}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)} 
            className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-blue-500"
          >
            <MessageCircle size={24} />
            <span className="font-medium text-sm">{post.comments.length || ""}</span>
          </button>
        </div>
        
        <button onClick={handleDownload} className="text-slate-600 transition-colors hover:text-slate-900" title="Download Image">
          <Download size={22} />
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-3">
          <p className="text-sm text-slate-800"><span className="font-bold mr-2">{post.author_name}</span>{post.caption}</p>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-slate-100 bg-slate-50 p-4">
          <div className="mb-4 flex max-h-48 flex-col gap-3 overflow-y-auto pr-2">
            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-2">No comments yet.</p>
            ) : (
              post.comments.map(c => (
                <div key={c.id} className="text-sm">
                  <span className="font-semibold text-slate-900 mr-2">{c.profiles?.display_name || 'User'}</span>
                  <span className="text-slate-700">{c.content}</span>
                </div>
              ))
            )}
          </div>
          
          <form onSubmit={submitComment} className="relative mt-2">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none focus:border-slate-400"
              disabled={submitting}
            />
            <button 
              type="submit" 
              disabled={submitting || !commentText.trim()} 
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
