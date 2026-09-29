import { useState } from "react";
import { findLeads } from "../../lib/leadsApi";
import type { Lead } from "../../types/leads";

interface LeadSearchFormProps {
  onResults: (leads: Lead[]) => void;
  onLoading: (loading: boolean) => void;
}

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export default function LeadSearchForm({
  onResults,
  onLoading,
}: LeadSearchFormProps) {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!category || !city || !state) {
      setError("Please enter business category, city, and state.");
      return;
    }

    try {
      onLoading(true);

      const leads = await findLeads({
        category,
        city,
        state,
      });

      onResults(leads);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to find leads.",
      );
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="lead-finder-category"
            className="block text-sm font-medium text-slate-700"
          >
            Business Category <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-finder-category"
            type="text"
            placeholder="Dental Clinic"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lead-finder-city"
            className="block text-sm font-medium text-slate-700"
          >
            City <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-finder-city"
            type="text"
            placeholder="Dallas"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lead-finder-state"
            className="block text-sm font-medium text-slate-700"
          >
            State <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-finder-state"
            type="text"
            placeholder="Texas"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:w-auto"
        >
          Find Leads
        </button>
      </div>
    </form>
  );
}
