import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Users, Image as ImageIcon, Loader2, Briefcase, LayoutGrid, MessageSquare, Plus, Check, X } from "lucide-react";
import { ProfileCard } from "@/components/ui/profile-card";
import { demoPosts as galleryDemoPosts } from "@/pages/Gallery";

export function Admin({ user }) {
  const [tab, setTab] = useState("posts");
  const [data, setData] = useState({
    posts: [],
    users: [],
    services: [],
    portfolio: [],
    messages: []
  });
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({ posts: 0, likes: 0, views: 0 });
  const [roleUpdatingId, setRoleUpdatingId] = useState(null);
  const [roleStatus, setRoleStatus] = useState({ type: "", text: "" });

  // Form states for creating new items
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState({ title: "", slug: "", description: "", image_url: "", cta_text: "Book Now" });
  
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: "", location: "", description: "", image_url: "", category: "Album" });

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === "posts") {
        const { data: postsData } = await supabase
          .from("community_posts")
          .select("*, profiles(display_name, avatar_url)")
          .order("created_at", { ascending: false });

        const demoReviewPosts = galleryDemoPosts.map((post) => ({
          ...post,
          status: post.status || "in_review",
          profiles: {
            display_name: post.author_name,
            avatar_url: post.avatar_url,
          },
        }));
        const allPosts = [...demoReviewPosts, ...(postsData || [])];
        
        // Calculate global stats for admin
        if (allPosts) {
          const totalViews = allPosts.reduce((acc, p) => acc + (p.views || 0), 0);
          const demoLikes = demoReviewPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
          const { count: likesCount } = await supabase.from("community_likes").select("*", { count: "exact", head: true });
          
          setAdminStats({
            posts: allPosts.length,
            likes: demoLikes + (likesCount || 0),
            views: totalViews
          });
        }
        setData(prev => ({ ...prev, posts: allPosts }));

      } else if (tab === "users") {
        const { data: usersData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        setData(prev => ({ ...prev, users: usersData || [] }));

      } else if (tab === "services") {
        const { data: servicesData } = await supabase.from("services").select("*").order("sort_order", { ascending: true });
        setData(prev => ({ ...prev, services: servicesData || [] }));

      } else if (tab === "portfolio") {
        const { data: portfolioData } = await supabase.from("portfolio_items").select("*").order("sort_order", { ascending: true });
        setData(prev => ({ ...prev, portfolio: portfolioData || [] }));

      } else if (tab === "messages") {
        // Try contact_messages first, fallback to contacts if error
        let { data: msgData, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
        if (error) {
          const { data: altMsgData } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
          msgData = altMsgData;
        }
        setData(prev => ({ ...prev, messages: msgData || [] }));
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
    setLoading(false);
  }

  async function deleteItem(table, id, dataKey) {
    if (!window.confirm(`Are you sure you want to delete this item?`)) return;
    if (String(id).startsWith("demo-")) {
      setData(prev => ({ ...prev, [dataKey]: prev[dataKey].filter(item => item.id !== id) }));
      return;
    }

    const { error } = await supabase.from(table).delete().match({ id });
    if (!error) {
      setData(prev => ({ ...prev, [dataKey]: prev[dataKey].filter(item => item.id !== id) }));
    } else {
      alert("Error deleting item: " + error.message);
    }
  }

  async function updatePostStatus(id, status) {
    if (String(id).startsWith("demo-")) {
      setData(prev => ({
        ...prev,
        posts: prev.posts.map(post => post.id === id ? { ...post, status } : post),
      }));
      return;
    }

    const { data: updatedPost, error } = await supabase
      .from("community_posts")
      .update({ status })
      .eq("id", id)
      .select("*, profiles(display_name, avatar_url)")
      .single();

    if (error) {
      alert("Error updating post: " + error.message);
      return;
    }

    setData(prev => ({
      ...prev,
      posts: prev.posts.map(post => post.id === id ? updatedPost : post),
    }));
  }

  async function createService(e) {
    e.preventDefault();
    const { data: newRec, error } = await supabase.from("services").insert([newService]).select();
    if (error) return alert("Error creating service: " + error.message);
    if (newRec) setData(prev => ({ ...prev, services: [...prev.services, newRec[0]] }));
    setShowServiceForm(false);
    setNewService({ title: "", slug: "", description: "", image_url: "", cta_text: "Book Now" });
  }

  async function createPortfolio(e) {
    e.preventDefault();
    const { data: newRec, error } = await supabase.from("portfolio_items").insert([newPortfolio]).select();
    if (error) return alert("Error creating portfolio item: " + error.message);
    if (newRec) setData(prev => ({ ...prev, portfolio: [...prev.portfolio, newRec[0]] }));
    setShowPortfolioForm(false);
    setNewPortfolio({ title: "", location: "", description: "", image_url: "", category: "Album" });
  }

  async function updateMessageStatus(id, newStatus, table = "contact_messages") {
    const { error } = await supabase.from(table).update({ status: newStatus }).match({ id });
    if (!error) {
      setData(prev => ({
        ...prev,
        messages: prev.messages.map(m => m.id === id ? { ...m, status: newStatus } : m)
      }));
    }
  }

  async function updateUserRole(id, role) {
    setRoleUpdatingId(id);
    setRoleStatus({ type: "", text: "" });

    const { data, error } = await supabase.rpc("update_profile_role", {
      target_user_id: id,
      target_role: role,
    });

    const updatedUser = Array.isArray(data) ? data[0] : data;

    if (error || !updatedUser) {
      setRoleStatus({
        type: "error",
        text: error?.message || "Role update did not return a user. Run the latest supabase/schema.sql, then sign out and sign in again.",
      });
      setRoleUpdatingId(null);
      return;
    }

    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, role: updatedUser.role } : u),
    }));
    setRoleStatus({ type: "success", text: "User role updated." });
    setRoleUpdatingId(null);
  }

  const tabs = [
    { id: "posts", label: "Posts", icon: ImageIcon },
    { id: "users", label: "Users", icon: Users },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "portfolio", label: "Portfolio", icon: LayoutGrid },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="page-container section-padding">
      <div className="mb-10 sm:mb-16">
        <ProfileCard 
          name={user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin"}
          title="Super Administrator"
          avatarUrl="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80"
          backgroundUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80"
          posts={adminStats.posts}
          likes={adminStats.likes}
          views={adminStats.views}
        />
      </div>
      <div className="mb-8 sm:mb-10">
        <h1 className="heading-xl text-4xl mb-2">Admin CMS Dashboard</h1>
        <p className="text-body text-sm">Manage community gallery, users, content, and inquiries.</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button 
              key={t.id}
              onClick={() => setTab(t.id)} 
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-colors sm:px-5 ${tab === t.id ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Icon size={18} /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="glass-card shadow-sm p-0 overflow-hidden bg-white">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        ) : (
          <>
            {/* POSTS TAB */}
            {tab === "posts" && (
              <div className="p-4">
                {data.posts.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No posts found</div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {data.posts.map(post => {
                      const status = post.status || "in_review";
                      const isApproved = status === "approved";
                      const isRejected = status === "rejected";

                      return (
                      <article key={post.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <a href={post.image_url} target="_blank" rel="noreferrer" className="block aspect-[4/3] bg-slate-100">
                          <img
                            src={post.image_url}
                            alt={post.caption || "Community post"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </a>
                        <div className="space-y-3 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              {post.profiles?.avatar_url ? (
                                <img src={post.profiles.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-600">
                                  {(post.profiles?.display_name || post.author_name || "U").charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0">
                                <h3 className="truncate font-semibold text-slate-900">
                                  {post.profiles?.display_name || post.author_name || "Community member"}
                                </h3>
                                <p className="text-xs font-medium text-slate-400">
                                  {new Date(post.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                              isApproved
                                ? "bg-emerald-50 text-emerald-700"
                                : isRejected
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}>
                              {isApproved ? "Approved" : isRejected ? "Rejected" : "In review"}
                            </span>
                          </div>
                          <p className="min-h-10 text-sm leading-5 text-slate-600">
                            {post.caption || "No caption"}
                          </p>
                          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                            {!isApproved && (
                              <button
                                type="button"
                                onClick={() => updatePostStatus(post.id, "approved")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800"
                              >
                                <Check size={14} />
                                Approve
                              </button>
                            )}
                            {isApproved && (
                              <button
                                type="button"
                                onClick={() => updatePostStatus(post.id, "in_review")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
                              >
                                Review
                              </button>
                            )}
                            {!isRejected && (
                              <button
                                type="button"
                                onClick={() => updatePostStatus(post.id, "rejected")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => deleteItem("community_posts", post.id, "posts")}
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                              aria-label="Delete community post"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    )})}
                  </div>
                )}
              </div>
            )}

            {/* USERS TAB */}
            {tab === "users" && (
              <div>
                {roleStatus.text && (
                  <div className={`m-4 rounded-xl p-3 text-sm font-medium ${roleStatus.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                    {roleStatus.text}
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
	                      <th className="p-4 font-semibold text-slate-600">Name</th>
	                      <th className="p-4 font-semibold text-slate-600">Email</th>
	                      <th className="p-4 font-semibold text-slate-600">Role</th>
	                      <th className="p-4 font-semibold text-slate-600">Joined</th>
	                      <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
	                    </tr>
	                  </thead>
	                  <tbody>
	                    {data.users.length === 0 ? (
	                      <tr><td colSpan="5" className="p-8 text-center text-slate-500">No users found</td></tr>
	                    ) : (
	                      data.users.map(u => (
	                        <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4 font-medium text-slate-900">{u.display_name || "-"}</td>
                          <td className="p-4 text-slate-600">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                              {u.role}
                            </span>
	                          </td>
	                          <td className="p-4 text-slate-500 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
	                          <td className="p-4 text-right">
	                            {u.id === user.id ? (
	                              <span className="inline-flex rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
	                                Current Admin
	                              </span>
	                            ) : u.role === "admin" ? (
	                              <button
	                                onClick={() => updateUserRole(u.id, "client")}
	                                disabled={roleUpdatingId === u.id}
	                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
	                              >
	                                {roleUpdatingId === u.id ? "Saving..." : "Make Client"}
	                              </button>
	                            ) : (
	                              <button
	                                onClick={() => updateUserRole(u.id, "admin")}
	                                disabled={roleUpdatingId === u.id}
	                                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
	                              >
	                                <Check size={14} />
	                                {roleUpdatingId === u.id ? "Saving..." : "Make Admin"}
	                              </button>
	                            )}
	                          </td>
	                        </tr>
	                      ))
	                    )}
                  </tbody>
	                  </table>
                </div>
	              </div>
            )}

            {/* SERVICES TAB */}
            {tab === "services" && (
              <div className="p-4">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Manage Services</h2>
                  <button onClick={() => setShowServiceForm(!showServiceForm)} className="btn-primary py-2 px-4 text-sm flex gap-2 items-center">
                    {showServiceForm ? <X size={16}/> : <Plus size={16}/>} {showServiceForm ? "Cancel" : "Add Service"}
                  </button>
                </div>

                {showServiceForm && (
                  <form onSubmit={createService} className="mb-8 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input type="text" placeholder="Title" required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-")})} className="p-2 border rounded" />
                      <input type="text" placeholder="Slug (auto-generated)" required value={newService.slug} onChange={e => setNewService({...newService, slug: e.target.value})} className="p-2 border rounded" />
                    </div>
                    <textarea placeholder="Description" required value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} className="p-2 border rounded resize-none" rows="3" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input type="text" placeholder="Image URL" value={newService.image_url} onChange={e => setNewService({...newService, image_url: e.target.value})} className="p-2 border rounded" />
                      <input type="text" placeholder="CTA Text" value={newService.cta_text} onChange={e => setNewService({...newService, cta_text: e.target.value})} className="p-2 border rounded" />
                    </div>
                    <button type="submit" className="btn-primary py-2 mt-2">Save Service</button>
                  </form>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {data.services.map(s => (
                    <div key={s.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                      <div className="h-36 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-24 sm:w-24">
                        {s.image_url && <img src={s.image_url} alt="Service" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between gap-3">
                          <h3 className="font-bold text-slate-900">{s.title}</h3>
                          <button onClick={() => deleteItem("services", s.id, "services")} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">Slug: {s.slug}</p>
                        <p className="text-sm text-slate-600 line-clamp-2">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PORTFOLIO TAB */}
            {tab === "portfolio" && (
              <div className="p-4">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Manage Portfolio</h2>
                  <button onClick={() => setShowPortfolioForm(!showPortfolioForm)} className="btn-primary py-2 px-4 text-sm flex gap-2 items-center">
                    {showPortfolioForm ? <X size={16}/> : <Plus size={16}/>} {showPortfolioForm ? "Cancel" : "Add Item"}
                  </button>
                </div>

                {showPortfolioForm && (
                  <form onSubmit={createPortfolio} className="mb-8 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input type="text" placeholder="Title" required value={newPortfolio.title} onChange={e => setNewPortfolio({...newPortfolio, title: e.target.value})} className="p-2 border rounded" />
                      <input type="text" placeholder="Category" required value={newPortfolio.category} onChange={e => setNewPortfolio({...newPortfolio, category: e.target.value})} className="p-2 border rounded" />
                    </div>
                    <textarea placeholder="Description" required value={newPortfolio.description} onChange={e => setNewPortfolio({...newPortfolio, description: e.target.value})} className="p-2 border rounded resize-none" rows="2" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input type="text" placeholder="Image URL" required value={newPortfolio.image_url} onChange={e => setNewPortfolio({...newPortfolio, image_url: e.target.value})} className="p-2 border rounded" />
                      <input type="text" placeholder="Location" value={newPortfolio.location} onChange={e => setNewPortfolio({...newPortfolio, location: e.target.value})} className="p-2 border rounded" />
                    </div>
                    <button type="submit" className="btn-primary py-2 mt-2">Save Portfolio Item</button>
                  </form>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                  {data.portfolio.map(p => (
                    <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm group">
                      <div className="w-full h-40 bg-slate-100 relative">
                        {p.image_url && <img src={p.image_url} alt="Portfolio" className="w-full h-full object-cover" />}
                        <button onClick={() => deleteItem("portfolio_items", p.id, "portfolio")} className="absolute top-2 right-2 bg-white/90 text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900">{p.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{p.category}</span>
                          <span className="text-xs text-slate-400">{p.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGES TAB */}
            {tab === "messages" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 font-semibold text-slate-600">Status</th>
                      <th className="p-4 font-semibold text-slate-600">From</th>
                      <th className="p-4 font-semibold text-slate-600">Subject</th>
                      <th className="p-4 font-semibold text-slate-600">Message</th>
                      <th className="p-4 font-semibold text-slate-600">Date</th>
                      <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.messages.length === 0 ? (
                      <tr><td colSpan="6" className="p-8 text-center text-slate-500">No messages found</td></tr>
                    ) : (
                      data.messages.map(m => (
                        <tr key={m.id} className={`border-b border-slate-100 hover:bg-slate-50 ${m.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${m.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                              {m.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-900">{m.name}</div>
                            <div className="text-xs text-slate-500">{m.email}</div>
                          </td>
                          <td className="p-4 text-slate-900 text-sm font-medium">{m.subject}</td>
                          <td className="p-4 text-slate-600 text-sm max-w-xs truncate">{m.message}</td>
                          <td className="p-4 text-slate-500 text-sm">{new Date(m.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right flex justify-end gap-2">
                            {m.status === 'new' && (
                              <button onClick={() => updateMessageStatus(m.id, 'read')} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Mark as Read">
                                <Check size={18} />
                              </button>
                            )}
                            <button onClick={() => deleteItem("contact_messages", m.id, "messages")} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
