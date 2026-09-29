import type { Lead } from "../../types/leads";
import LeadCard from "./LeadCard";

interface LeadListProps {
  leads: Lead[];
}

export default function LeadList({ leads }: LeadListProps) {
  if (leads.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white/80 py-10 text-center text-sm text-slate-500">
        No leads found.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
}
