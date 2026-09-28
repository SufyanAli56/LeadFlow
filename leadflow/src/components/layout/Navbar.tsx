import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  const displayName =
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    "User";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="md:hidden">
        <span className="text-lg font-bold text-slate-900">LeadFlow</span>
      </div>

      <div className="hidden flex-1 md:block" />

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{displayName}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">
            {signingOut ? "Signing out..." : "Sign out"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
