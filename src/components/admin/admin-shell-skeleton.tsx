export function AdminShellSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Desktop Sidebar Skeleton */}
      <aside className="hidden lg:flex flex-col border-r border-border bg-card/60 shrink-0 sticky top-0 h-screen w-64 xl:w-72 justify-between p-4 animate-pulse">
        <div className="space-y-6">
          {/* Logo skeleton */}
          <div className="flex items-center gap-3 px-1">
            <div className="size-9 rounded-xl bg-muted shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-2.5 w-16 bg-muted/60 rounded" />
            </div>
          </div>

          {/* User badge skeleton */}
          <div className="p-3 rounded-2xl bg-secondary/30 border border-border/40 flex items-center gap-3">
            <div className="size-8 rounded-xl bg-muted shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-24 bg-muted rounded" />
              <div className="h-2.5 w-32 bg-muted/60 rounded" />
            </div>
          </div>

          {/* Nav items skeleton */}
          <div className="space-y-5 pt-2">
            {[1, 2, 3].map((group) => (
              <div key={group} className="space-y-2">
                <div className="h-2.5 w-20 bg-muted/60 rounded px-2" />
                <div className="space-y-1">
                  <div className="h-9 w-full bg-muted/30 rounded-xl" />
                  <div className="h-9 w-full bg-muted/30 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Workspace Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-30 bg-background/80 border-b border-border/80 px-4 sm:px-8 py-3.5 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-muted" />
            <div className="h-4 w-36 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 rounded-full bg-muted/50 hidden sm:block" />
            <div className="h-8 w-8 rounded-xl bg-muted" />
            <div className="h-8 w-20 rounded-xl bg-muted" />
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-7 w-48 bg-muted rounded-lg" />
              <div className="h-4 w-72 bg-muted/60 rounded" />
            </div>
            <div className="h-10 w-32 bg-muted rounded-xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-card border border-border/60 p-5 space-y-3"
              >
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded-lg" />
              </div>
            ))}
          </div>

          <div className="h-64 rounded-2xl bg-card border border-border/60" />
        </main>
      </div>
    </div>
  );
}
