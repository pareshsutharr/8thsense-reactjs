import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrandMark } from "@/components/common/BrandMark";
import { getAppUrl, supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function Auth({ mode }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const isRegister = mode === "register";

  async function getProfileRole(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    return data?.role ?? "client";
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage({ type: "", text: "" });
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { emailRedirectTo: `${getAppUrl()}/studio`, data: { full_name: form.fullName } },
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Account created. Check email for confirmation if enabled." });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        const role = await getProfileRole(data.user.id);
        navigate(role === "admin" ? "/admin" : "/studio");
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function googleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${getAppUrl()}/login` },
    });
    if (error) setMessage({ type: "error", text: error.message });
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md glass-card border-slate-200">
        <div className="mb-8 flex justify-center">
          <BrandMark />
        </div>
        
        <h1 className="heading-md mb-2 text-center">{isRegister ? "Create an account" : "Login"}</h1>
        <p className="text-body text-center text-sm mb-8">
          {isRegister ? "Join our community to post and share memories." : "Use Google or your email and password."}
        </p>

        <form onSubmit={submit} className="flex flex-col gap-5">
          {isRegister && (
            <div>
              <label className="label-text">Full Name</label>
              <input 
                className="input-field" 
                name="fullName" 
                type="text" 
                required 
                value={form.fullName}
                onChange={e => setForm({...form, fullName: e.target.value})}
              />
            </div>
          )}
          
          <div>
            <label className="label-text">Email Address</label>
            <input 
              className="input-field" 
              name="email" 
              type="email" 
              required 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="label-text">Password</label>
            <input 
              className="input-field" 
              name="password" 
              type="password" 
              required 
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>

          {message.text && (
            <div className={`rounded-xl p-4 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn-primary mt-2" disabled={busy}>
            {busy && <Loader2 className="animate-spin" size={18} />}
            {isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Or continue with</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        <button type="button" onClick={googleLogin} className="btn-secondary w-full">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          {isRegister ? "Already have an account? " : "Need a new account? "}
          <Link to={isRegister ? "/login" : "/register"} className="font-semibold text-slate-900 hover:underline">
            {isRegister ? "Sign in" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}
