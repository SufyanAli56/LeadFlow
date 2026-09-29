import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import LeadSearchForm from "../../components/leads/LeadSearchForm";
import LeadList from "../../components/leads/LeadList";
import type { Lead } from "../../types/leads";

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Find Leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search businesses using Google Maps (Apify).
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Search className="h-4 w-4" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Search criteria</p>
            <p className="text-xs text-slate-500">
              Category, city, and state are required.
            </p>
          </div>
        </div>

        <LeadSearchForm onResults={setLeads} onLoading={setLoading} />
      </div>

      {loading && (
        <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-12 text-sm text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
          Finding leads…
        </div>
      )}

      {!loading && leads.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Results
            </h2>
            <p className="text-sm tabular-nums text-slate-500">
              {leads.length} lead{leads.length === 1 ? "" : "s"} found
            </p>
          </div>

          <LeadList leads={leads} />
        </div>
      )}
    </div>
  );
}
