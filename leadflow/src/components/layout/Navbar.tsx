
import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await signOut();
    } finally {
      setSigningOut(false);
      setDropdownOpen(false);
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

      <div className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={dropdownOpen}
          aria-controls="user-menu"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
            aria-hidden="true"
          >
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-slate-900">
              {displayName}
            </p>
          </div>

          <ChevronDown
            className={`hidden h-4 w-4 text-slate-500 transition-transform sm:block ${
              dropdownOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {dropdownOpen && (
          <div
            id="user-menu"
            role="menu"
            aria-label="User menu"
            className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            <div
              role="none"
              className="border-b border-slate-100 px-4 py-3"
            >
              <p
                role="menuitem"
                aria-disabled="true"
                className="text-sm font-semibold text-slate-900"
              >
                {displayName}
              </p>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />

              <span>
                {signingOut ? "Signing out..." : "Sign out"}
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;