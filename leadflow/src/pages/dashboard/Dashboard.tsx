import { Mail, Megaphone, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const stats = [
  {
    label: "Total Leads",
    value: "0",
    icon: Users,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    label: "Campaigns",
    value: "0",
    icon: Megaphone,
    accent: "bg-violet-50 text-violet-600",
  },
  {
    label: "Emails Sent",
    value: "0",
    icon: Mail,
    accent: "bg-emerald-50 text-emerald-600",
  },
];

function Dashboard() {
  const { user } = useAuth();
  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "there";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {firstName}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your leads and outreach campaigns from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
                  {value}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white/80 p-8 text-center">
        <p className="text-sm font-medium text-slate-700">Getting started</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Import leads, create your first campaign, and connect your inbox.
          More modules will appear here as you build out LeadFlow.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
