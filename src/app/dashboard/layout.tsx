import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Star,
  LayoutDashboard,
  Store,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/shops", icon: Store, label: "Shops" },
  { href: "/dashboard/analyses", icon: BarChart3, label: "Analyses" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-[#0a0a0a]">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
            <Star className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">ReviewAnalyzer</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user.email}</p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-500 hover:text-red-400 w-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
