import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({ user, profile }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar user={user} profile={profile} />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
