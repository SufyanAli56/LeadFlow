import type { FormEvent } from "react";

import Input from "../common/Input";

interface LeadSearchFormProps {
  businessType: string;
  location: string;
  keywords: string;
  limit: string;
  loading: boolean;
  onBusinessTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onKeywordsChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onSubmit: () => void;
}

function LeadSearchForm({
  businessType,
  location,
  keywords,
  limit,
  loading,
  onBusinessTypeChange,
  onLocationChange,
  onKeywordsChange,
  onLimitChange,
  onSubmit,
}: LeadSearchFormProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Business Type"
          placeholder="Restaurant"
          value={businessType}
          onChange={onBusinessTypeChange}
          required
        />

        <Input
          label="Location"
          placeholder="Lahore, Pakistan"
          value={location}
          onChange={onLocationChange}
          required
        />

        <Input
          label="Keywords"
          placeholder="Italian"
          value={keywords}
          onChange={onKeywordsChange}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Number of Results
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(e) => onLimitChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Searching..." : "🔍 Find Leads"}
        </button>
      </div>
    </form>
  );
}

export default LeadSearchForm;
