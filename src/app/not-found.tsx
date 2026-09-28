import { Home, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-black text-xs uppercase tracking-widest">
          <span>Error 404 • Resource Not Located</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground">
          Hardware route not found
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
          The POS model, datasheet, or page you requested does not exist or may have been updated to
          a newer hardware iteration.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <Home className="size-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/catalogue"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <ShoppingBag className="size-4" />
            <span>Browse Catalogue</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-border flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <Link href="/solutions" className="hover:text-foreground underline">
            Industry Solutions
          </Link>
          <Link href="/contact" className="hover:text-foreground underline">
            Contact Specialist
          </Link>
          <Link href="/about" className="hover:text-foreground underline">
            About Mifaretech
          </Link>
        </div>
      </div>
    </div>
  );
}
