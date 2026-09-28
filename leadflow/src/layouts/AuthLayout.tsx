import type { ReactNode } from "react";
import { Zap } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-600 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-400 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
            <Zap className="h-6 w-6" strokeWidth={2.25} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            LeadFlow
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Lead generation and outreach platform
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/20">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
