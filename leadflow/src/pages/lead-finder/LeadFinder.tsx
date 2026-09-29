import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import LeadResultCard, {
  type LeadResultAddState,
} from "../../components/lead-finder/LeadResultCard";
import LeadSearchForm from "../../components/lead-finder/LeadSearchForm";
import {
  addLeadFromSearchResult,
  findLeads,
  getGoogleMapsLeadBySourceId,
} from "../../services/leadFinderService";
import type { LeadSearchResult } from "../../types/leadFinder";

function resultKey(result: LeadSearchResult, index: number): string {
  return result.sourceId ?? `${result.name}-${index}`;
}

function LeadFinder() {
  const [businessType, setBusinessType] = useState("Restaurant");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [limit, setLimit] = useState("20");

  const [results, setResults] = useState<LeadSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [addStates, setAddStates] = useState<
    Record<string, LeadResultAddState>
  >({});
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  const hydrateExistingLeads = useCallback(
    async (leads: LeadSearchResult[]) => {
      const nextStates: Record<string, LeadResultAddState> = {};

      await Promise.all(
        leads.map(async (lead, index) => {
          const key = resultKey(lead, index);
          if (!lead.sourceId) {
            nextStates[key] = "missing_source_id";
            return;
          }

          try {
            const existing = await getGoogleMapsLeadBySourceId(lead.sourceId);
            nextStates[key] = existing ? "already_added" : "idle";
          } catch {
            nextStates[key] = "idle";
          }
        }),
      );

      setAddStates(nextStates);
    },
    [],
  );

  const handleSearch = async () => {
    setSearchError("");
    setSearchLoading(true);
    setHasSearched(true);
    setAddErrors({});

    const parsedLimit = Number.parseInt(limit, 10);

    try {
      const leads = await findLeads({
        businessType: businessType.trim(),
        location: location.trim(),
        keywords: keywords.trim(),
        limit: Number.isFinite(parsedLimit) ? parsedLimit : 20,
      });

      setResults(leads);
      await hydrateExistingLeads(leads);
    } catch (err) {
      setResults([]);
      setAddStates({});
      setSearchError(
        err instanceof Error ? err.message : "Search failed. Please try again.",
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddLead = async (result: LeadSearchResult, index: number) => {
    const key = resultKey(result, index);

    setAddStates((current) => ({ ...current, [key]: "adding" }));
    setAddErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });

    try {
      const outcome = await addLeadFromSearchResult(result);
      setAddStates((current) => ({ ...current, [key]: outcome }));
    } catch (err) {
      setAddStates((current) => ({ ...current, [key]: "error" }));
      setAddErrors((current) => ({
        ...current,
        [key]:
          err instanceof Error
            ? err.message
            : "Failed to save lead. Please try again.",
      }));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Finder</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search Google Maps for real businesses and add them to your leads.
          </p>
        </div>

        <Link
          to="/leads"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Saved Leads
        </Link>
      </div>

      <LeadSearchForm
        businessType={businessType}
        location={location}
        keywords={keywords}
        limit={limit}
        loading={searchLoading}
        onBusinessTypeChange={setBusinessType}
        onLocationChange={setLocation}
        onKeywordsChange={setKeywords}
        onLimitChange={setLimit}
        onSubmit={handleSearch}
      />

      {searchError && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {searchError}
        </div>
      )}

      {searchLoading && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          Searching Google Maps via SerpApi...
        </div>
      )}

      {!searchLoading && hasSearched && !searchError && results.length === 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-900">No results</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try different business type, location, or keywords.
          </p>
        </div>
      )}

      {!searchLoading && results.length > 0 && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {results.map((result, index) => {
            const key = resultKey(result, index);
            return (
              <LeadResultCard
                key={key}
                result={result}
                addState={addStates[key] ?? "idle"}
                addError={addErrors[key]}
                onAddLead={() => handleAddLead(result, index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LeadFinder;
