import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/layout/Layout";
import { Landing } from "@/pages/Landing";
import { Services } from "@/pages/Services";
import { Portfolio } from "@/pages/Portfolio";
import { Gallery } from "@/pages/Gallery";
import { Contact } from "@/pages/Contact";
import { Auth } from "@/pages/Auth";
import { Studio } from "@/pages/Studio";
import { Admin } from "@/pages/Admin";

function useSession() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile(nextSession) {
      setSession(nextSession);
      setProfile(null);

      if (!nextSession?.user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, email, avatar_url, role")
        .eq("id", nextSession.user.id)
        .maybeSingle();

      if (!active) return;
      setProfile(data ?? null);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => loadProfile(data.session));

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      loadProfile(nextSession);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { user: session?.user ?? null, profile, loading };
}

function RequireAuth({ user, loading, children }) {
  if (loading) return <div className="grid min-h-screen place-items-center bg-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ user, profile, loading, children }) {
  if (loading) return <div className="grid min-h-screen place-items-center bg-white">Loading...</div>;
  if (!user || profile?.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, profile, loading } = useSession();

  return (
    <Routes>
      <Route element={<Layout user={user} profile={profile} />}>
        <Route path="/" element={<Landing user={user} />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route path="/login" element={loading ? <div className="grid min-h-screen place-items-center bg-white">Loading...</div> : user ? <Navigate to={profile?.role === "admin" ? "/admin" : "/studio"} replace /> : <Auth mode="login" />} />
        <Route path="/register" element={user ? <Navigate to="/studio" replace /> : <Auth mode="register" />} />
        <Route path="/select-profile" element={<Navigate to="/login" replace />} />
        
        <Route path="/studio" element={
          <RequireAuth user={user} loading={loading}>
            <Studio user={user} />
          </RequireAuth>
        } />
        
        <Route path="/admin" element={
          <RequireAdmin user={user} profile={profile} loading={loading}>
            <Admin user={user} />
          </RequireAdmin>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
