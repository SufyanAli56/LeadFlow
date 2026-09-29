import type { LeadSearchResult } from "../../types/leadFinder";

export type LeadResultAddState =
  | "idle"
  | "adding"
  | "added"
  | "already_added"
  | "missing_source_id"
  | "error";

interface LeadResultCardProps {
  result: LeadSearchResult;
  addState: LeadResultAddState;
  addError?: string;
  onAddLead: () => void;
}

function LeadResultCard({
  result,
  addState,
  addError,
  onAddLead,
}: LeadResultCardProps) {
  const isAddDisabled =
    addState === "adding" ||
    addState === "added" ||
    addState === "already_added" ||
    addState === "missing_source_id";

  const addButtonLabel = (() => {
    switch (addState) {
      case "adding":
        return "Adding...";
      case "added":
        return "Added";
      case "already_added":
        return "Already Added";
      case "missing_source_id":
        return "Cannot Add (No ID)";
      case "error":
        return "Add Lead";
      default:
        return "Add Lead";
    }
  })();

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>

      {result.category && (
        <p className="mt-1 text-sm text-gray-500">{result.category}</p>
      )}

      {result.address && (
        <p className="mt-2 text-sm text-gray-600">{result.address}</p>
      )}

      <dl className="mt-4 space-y-2 text-sm">
        {result.phone && (
          <div>
            <dt className="font-medium text-gray-700">Phone</dt>
            <dd className="text-gray-600">{result.phone}</dd>
          </div>
        )}

        {result.website && (
          <div>
            <dt className="font-medium text-gray-700">Website</dt>
            <dd>
              <a
                href={result.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {result.website}
              </a>
            </dd>
          </div>
        )}

        {result.rating != null && (
          <div>
            <dt className="font-medium text-gray-700">Rating</dt>
            <dd className="text-gray-600">{result.rating}</dd>
          </div>
        )}

        {result.reviewsCount != null && (
          <div>
            <dt className="font-medium text-gray-700">Reviews</dt>
            <dd className="text-gray-600">{result.reviewsCount}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {result.googleMapsUrl && (
          <a
            href={result.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Maps
          </a>
        )}

        <button
          type="button"
          onClick={onAddLead}
          disabled={isAddDisabled}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {addButtonLabel}
        </button>
      </div>

      {addState === "error" && addError && (
        <p className="mt-2 text-sm text-red-600">{addError}</p>
      )}

      {addState === "missing_source_id" && (
        <p className="mt-2 text-sm text-amber-600">
          This result has no stable Google Maps identifier and cannot be saved
          without risking duplicates.
        </p>
      )}
    </article>
  );
}

export default LeadResultCard;
