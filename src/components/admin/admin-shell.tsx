"use client";

import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Inbox,
  Layers,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  image?: string | null;
}

interface AdminShellProps {
  user: AdminUser;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Collapsed state initialized with localStorage support
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mifaretech_admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore localStorage errors in SSR / private mode
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("mifaretech_admin_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Keyboard shortcut Ctrl+B or Cmd+B to collapse/expand sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const isAdmin = user.role === "admin";

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      toast.success("Signed out of console successfully.");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Failed to sign out.");
      setIsLoggingOut(false);
    }
  };

  const navGroups = [
    {
      title: "Operations",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
      ],
    },
    {
      title: "Hardware Catalogue",
      items: [
        { label: "Products", href: "/admin/catalogue", icon: Monitor },
        { label: "Categories", href: "/admin/categories", icon: Layers },
        { label: "Solutions", href: "/admin/solutions", icon: Briefcase },
      ],
    },
    {
      title: "Content & Configuration",
      items: [
        { label: "Site Content", href: "/admin/content", icon: Layers },
        { label: "Site Settings", href: "/admin/settings", icon: Settings },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: "Access & System",
            items: [
              { label: "Staff Users", href: "/admin/users", icon: Users },
              { label: "Audit Logs", href: "/admin/audit", icon: ShieldAlert },
              { label: "Two-Factor Auth", href: "/admin/security/2fa", icon: ShieldCheck },
            ],
          },
        ]
      : [
          {
            title: "Security",
            items: [{ label: "Two-Factor Auth", href: "/admin/security/2fa", icon: ShieldCheck }],
          },
        ]),
  ];

  // Helper to get active page title and category for the admin header
  const getPageContext = () => {
    if (pathname === "/admin") return { title: "Overview", group: "Operations" };
    if (pathname.startsWith("/admin/enquiries"))
      return { title: "Inbound Enquiries", group: "Operations" };
    if (pathname.startsWith("/admin/catalogue"))
      return { title: "Hardware Fleet", group: "Hardware Catalogue" };
    if (pathname.startsWith("/admin/categories"))
      return { title: "Product Categories", group: "Hardware Catalogue" };
    if (pathname.startsWith("/admin/solutions"))
      return { title: "Industry Solutions", group: "Hardware Catalogue" };
    if (pathname.startsWith("/admin/content"))
      return { title: "Content Management", group: "Content & Assets" };
    if (pathname.startsWith("/admin/users"))
      return { title: "Staff & Access Control", group: "Access & System" };
    if (pathname.startsWith("/admin/security/2fa"))
      return { title: "Two-Factor Security", group: "Security" };
    if (pathname.startsWith("/admin/audit"))
      return { title: "Audit Trail", group: "Access & System" };
    if (pathname.startsWith("/admin/settings"))
      return { title: "Global Settings", group: "Access & System" };
    return { title: "Console", group: "Admin" };
  };

  const { title: currentTitle, group: currentGroup } = getPageContext();

  return (
    <div className="h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased overflow-hidden">
      {/* ========================================================= */}
      {/* 1. DESKTOP SIDEBAR WITH SLEEK FLOATING BORDER COLLAPSE BUTTON */}
      {/* ========================================================= */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border bg-card shrink-0 h-full transition-[width] duration-300 ease-in-out z-20 ${
          isCollapsed ? "w-[76px] px-3 py-4" : "w-64 xl:w-72 p-4.5"
        }`}
      >
        {/* Floating Border Collapse Button right on the boundary between sidebar and main page */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-6 z-40 size-7 rounded-full bg-card border border-border/90 text-muted-foreground hover:text-foreground hover:bg-secondary shadow-md hover:scale-110 active:scale-95 transition-all duration-150 flex items-center justify-center cursor-pointer ring-4 ring-background"
          title={isCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5 text-foreground" />
          ) : (
            <ChevronLeft className="size-3.5 text-foreground" />
          )}
        </button>

        {/* Top: Brand Header */}
        <div className="shrink-0 mb-3 pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className={`flex items-center group select-none ${
                isCollapsed ? "justify-center w-full" : "gap-3"
              }`}
            >
              <div className="relative size-9 rounded-xl overflow-hidden shrink-0 shadow-xs border border-border/50">
                <Image
                  src="/logo.png"
                  alt="Mifaretech"
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 transition-opacity duration-200">
                  <span className="text-base font-black tracking-tight text-foreground block truncate">
                    Mifare<span className="text-brand-600 dark:text-brand-400">tech</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                    Enterprise Console
                  </span>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Middle: Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1 scrollbar-thin">
          <div className="space-y-4 pt-1 pb-2">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                {!isCollapsed && (
                  <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 block">
                    {group.title}
                  </span>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isCollapsed ? item.label : undefined}
                        className={`group flex items-center rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isCollapsed ? "justify-center size-10 mx-auto p-0" : "gap-3 px-3 py-2"
                        } ${
                          isActive
                            ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                        }`}
                      >
                        <Icon
                          className={`size-4 shrink-0 transition-transform ${
                            isActive
                              ? "text-white"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE WITH CLEAN STICKY ADMIN HEADER */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Sticky Executive Admin Header */}
        <header className="sticky top-0 z-30 h-16 bg-card/95 backdrop-blur-md border-b border-border/80 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0">
          {/* Left: Collapse Button & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Desktop header sidebar collapse toggle icon right beside the sidebar */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden lg:inline-flex items-center justify-center p-2 rounded-xl border border-border/80 bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs"
              title={isCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </button>

            {/* Mobile menu sheet trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger
                render={
                  <button
                    type="button"
                    className="lg:hidden p-2 rounded-xl border border-border bg-card text-foreground"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="size-4" />
                  </button>
                }
              />
              <SheetContent
                side="left"
                className="w-[85vw] sm:max-w-xs p-6 flex flex-col justify-between"
              >
                <SheetHeader className="text-left pb-2">
                  <SheetTitle className="text-sm font-bold">Admin Navigation</SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    Mifaretech fleet management console
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-thin">
                  {navGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {group.title}
                      </span>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive =
                            item.href === "/admin"
                              ? pathname === "/admin"
                              : pathname.startsWith(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsMobileOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                                isActive
                                  ? "bg-brand-900 text-white dark:bg-brand-500"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                              }`}
                            >
                              <Icon className="size-4" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Modern Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs truncate">
              <span className="text-muted-foreground font-medium hidden sm:inline">
                {currentGroup}
              </span>
              <span className="text-muted-foreground/60 hidden sm:inline">/</span>
              <span className="font-bold text-foreground text-sm truncate">{currentTitle}</span>
            </nav>
          </div>

          {/* Right: Quick actions, Live Site, Theme & PROMINENT LOGOUT / SIGN OUT */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Live Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-all shadow-2xs"
            >
              <ExternalLink className="size-3 text-muted-foreground" />
              <span>Live Site</span>
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-border/80 bg-card hover:bg-secondary text-foreground transition-colors cursor-pointer"
              title="Toggle color theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {/* Staff User Profile Tag */}
            <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-border/70">
              <div className="size-8 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-2xs">
                {user.name?.slice(0, 2) || "AD"}
              </div>
              <div className="text-left hidden lg:block leading-none">
                <span className="text-xs font-bold text-foreground block truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono uppercase block mt-0.5">
                  {user.role || "staff"}
                </span>
              </div>
            </div>

            {/* PROMINENT EXECUTIVE SIGN OUT / LOGOUT BUTTON IN ADMIN HEADER */}
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl border border-destructive/30 bg-destructive/10 hover:bg-destructive hover:text-white text-destructive text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
              title="End staff administrative session"
              aria-label="Sign out"
            >
              {isLoggingOut ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <LogOut className="size-3.5" />
              )}
              <span className="font-bold">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Content Area: Natural Window Scrolling, NO nested overflow-y container */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE BOTTOM TABS BAR */}
      {/* ========================================================= */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-3 py-2 flex items-center justify-around">
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === "/admin" ? "text-brand-600 dark:text-brand-400" : "text-muted-foreground"
          }`}
        >
          <LayoutDashboard className="size-4" />
          <span>Overview</span>
        </Link>
        <Link
          href="/admin/enquiries"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname.startsWith("/admin/enquiries")
              ? "text-brand-600 dark:text-brand-400"
              : "text-muted-foreground"
          }`}
        >
          <Inbox className="size-4" />
          <span>Enquiries</span>
        </Link>
        <Link
          href="/admin/catalogue"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname.startsWith("/admin/catalogue")
              ? "text-brand-600 dark:text-brand-400"
              : "text-muted-foreground"
          }`}
        >
          <Monitor className="size-4" />
          <span>Hardware</span>
        </Link>
        {isAdmin && (
          <Link
            href="/admin/users"
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              pathname.startsWith("/admin/users")
                ? "text-brand-600 dark:text-brand-400"
                : "text-muted-foreground"
            }`}
          >
            <Users className="size-4" />
            <span>Users</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
